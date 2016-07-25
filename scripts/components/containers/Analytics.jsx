var React = require('react');
var Grid = require('react-bootstrap').Grid;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var ToolbarTitle = require('material-ui').ToolbarTitle;
var Slider = require('react-slick');
var Paper = require('material-ui').Paper;
var DropDownMenu = require('material-ui').DropDownMenu;
var MenuItem = require('material-ui').MenuItem;
var RadialBar = require('recharts').RadialBar;
var RadialBarChart = require('recharts').RadialBarChart;
var Legend = require('recharts').Legend;
var ReactDataGrid = require('react-data-grid');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Table = require('material-ui').Table;
var TableRow = require('material-ui').TableRow;
var TableRowColumn = require('material-ui').TableRowColumn;
var Avatar = require('material-ui').Avatar;
var Checkbox = require('material-ui').Checkbox;
var TableBody = require('material-ui').TableBody;
var TableHeader = require('material-ui').TableHeader;
var TableHeaderColumn = require('material-ui').TableHeaderColumn;
var LinearProgress = require('material-ui').LinearProgress;
var BarChart = require('react-chartjs').Bar;
var Tooltip = require('recharts').Tooltip;
var Toolbar = require('material-ui').Toolbar;
var Spinner = require('react-spinkit');
var RadialChart = require('../../components/elements/RadialChart.jsx');
var ScoreBar = require('../../components/elements/ScoreBar.jsx');

var Analytics = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin("AssetsStore")],
    getInitialState: function() {
        var charts = ["success_score", "fan_score", "reach_score", "alignment_score", "finance_score", "engagement_score"];

         return {chart: 'success_score', charts: charts}
    },
    renderTop: function() {
        var settings = {
            dots: true,
            slidesToShow: 3
        };
        var paperStyle = {
           // height: "200px",
           // width: "100%",
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center'
        };

        var style = {
        //    top: 0,
        //    left: 350,
        //    lineHeight: '24px'
        };
        return (
            <Row>
                <Slider {...settings}>
                {this.state.assets.map(function(a) {
                    return (
                        <Col key={a.id} md={4}>
                            <Paper key={a.id} style={paperStyle} zDepth={5}>
                                <RadialChart key={a.id} asset={a} />
                            </Paper>
                        </Col>
                    );
                })}
                </Slider>
            </Row>
        );
    },
    renderBottom: function() {
        if (this.state.assetsLoaded) {
            var data = this.getFlux().store("AssetsStore").getState().assets[0].metrics;
            var columns = [
                {
                    key: 'entity_key',
                    name: 'Entity'
                },
                {
                    key: 'source',
                    name: 'Source'
                },
                {
                    key: 'metric',
                    name: 'Metric'
                },
                {
                    key: 'value',
                    name: 'Value'
                }
            ];
            var rowGetter = function(i) {
                 return data[i];
            };

            return (
                <Row style={{backgroundColor: "blue"}}>
                    <Col md={12}>
                        <div style={{width: "100%", height: "500px"}} >
                            <ReactDataGrid
                                columns={columns}
                                rowGetter={rowGetter}
                                rowsCount={data.length}
                                minHeight={500}
                                />
                        </div>
                    </Col>
                </Row>
            )
        } else {
            return (
                <Row>
                    <h1> eh</h1>
                </Row>
            )
        }
    },
    handleChange: function(e, i, v) {
        console.log(e.target, i, v)
        this.setState({chart: this.state.charts[i]});
    },
    renderMiddle: function() {
        var assets = [];
        if (this.state.assetsLoaded) {
             assets = this.state.assets;
        }
        var rankings = [];
        _.each(assets, function(a) {
            var val = null;
            for (var i = 0; i < a.metrics.length; i++) {
                if (a.metrics[i].metric == 'team_score') {
                    val = a.metrics[i].value;
                    break;
                }
            }
            rankings.push({
                name: a.name,
                image: a.image_url,
                score: val
            });
        });
        rankings = _.sortBy(rankings, 'score').reverse();
        return (
             <Row style={{marginTop: "20px"}}>
                <Col md={8}>
                    <Paper zDepth={4} style={{backgroundColor: "white", margin: "0px"}}>
                    <Toolbar style={{backgroundColor: "#208089"}}className="toolbar">
                        <ToolbarTitle text="Property Scores" />
                        <DropDownMenu value={this.state.chart} onChange={this.handleChange}>
                        {this.state.charts.map(function(i) {
                            console.log("iter", i);
                            return (
                                <MenuItem
                                    value={i}
                                    primaryText={i}
                                    key={i}
                                    style={{textTransform: 'uppercase'}}
                                />
                            )
                        }.bind(this))}
                        </DropDownMenu>
                    </Toolbar>
                        <ScoreBar assets={this.state.assets} metric={this.state.chart} />
                    </Paper>
                </Col>
                <Col md={4}>
                    <Paper zDepth={4} style={{backgroundColor: "white", margin: "0px"}}>
                        <Toolbar style={{backgroundColor: "#208089"}} className="toolbar">
                            <ToolbarTitle text="Property Ranking" />
                        </Toolbar>
                        <Table height={"550px"}>
                            <TableBody
                                displayRowCheckbox={false}
                            >
                                {rankings.map(function(r) {
                                    return (
                                         <TableRow key={r.id}>
                                            <TableRowColumn style={{width: "50px"}}><Avatar src={r.image} /></TableRowColumn>
                                            <TableRowColumn style={{width: "100px"}}>{r.name}</TableRowColumn>
                                            <TableRowColumn style={{width: "100px"}}><LinearProgress style={{height: "10px"}}mode="determinate" value={r.score * 100}/></TableRowColumn>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </Paper>
                </Col>
             </Row>
        )
    },
    getStateFromFlux: function() {
         return this.getFlux().store("AssetsStore").getState();
    },
    render: function() {
        if (!this.state.assetsLoaded) {
            return (
            <div className=''>
		        <div style={{marginTop: "20%", display: 'flex', justifyContent: 'center'}}>
			        <Spinner style={{height: 200, width: 200}} overrideSpinnerClassName={'loader'} spinnerName='circle' noFadeIn />
			    </div>
		    </div>
            );
        }

        return (
            <div className="analytics">
                <div className="analytics-body">
                    {this.renderTop()}
                    {this.renderMiddle()}
                    {this.renderBottom()}
                </div>
            </div>
        );
    }
});
module.exports = Analytics;
