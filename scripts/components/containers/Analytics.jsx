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
var uuid = require('node-uuid');
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
var ToolbarGroup = require('material-ui').ToolbarGroup;
var Spinner = require('react-spinkit');
var RadialChart = require('../../components/elements/RadialChart.jsx');
var ScoreBar = require('../../components/elements/ScoreBar.jsx');
var MetricTable = require('../../components/elements/MetricTable.jsx');
var InfoIcon = require('react-icons/lib/md/info-outline');
var Popover = require('material-ui').Popover;
var titleize = require('underscore.string/titleize');
var _ = require('underscore');

var Analytics = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin("AnalyticsStore")],
    componentWillMount: function() {
        var state = this.getFlux().store("AnalyticsStore").getState();
        if (!state.scoresLoaded) this.getFlux().actions.loadScores();
        if (!state.assetsLoaded) this.getFlux().actions.loadAssets();
        if (!state.scoreMetricsLoaded) this.getFlux().actions.loadScoreMetrics();
    },
    getInitialState: function() {
        var charts = ["team_score", "success_score", "fan_score", "reach_score", "alignment_score", "finance_score", "engagement_score"];

        return { chart: 'team_score', charts: charts, ranking: 'team_score' }
    },
    handleScoreView: function(event) {
        event.preventDefault();
        this.setState({
            open: true,
            anchorEl: event.currentTarget
        })
    },
    handleRequestClose: function() {
        this.setState({
            open: false,
        });
    },
    renderTop: function() {
        var settings = {
            dots: true,
            slidesToShow: 3
        };
        var paperStyle = {
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center'
        };
        return (
            <Row>
                <Slider {...settings}>
                {_.values(this.state.assets).map(function(a) {
                    return (
                        <Col key={a.id} md={4}>
                            <Paper key={a.id} style={paperStyle} zDepth={5}>
                                <RadialChart key={a.id} asset={a} metricKeys={this.state.charts} metrics={this.state.scoreMetrics} />
                            </Paper>
                        </Col>
                    );
                }.bind(this))}
                </Slider>
            </Row>
        );
    },
    renderBottom: function() {
        return (
            <Row style={{marginTop: "20px"}}>
                <Col md={12}>
                    <Paper zDepth={4} style={{backgroundColor: "white", margin: "0px"}}>
                        <Toolbar style={{backgroundColor: "#4861A6", color: "white"}}className="toolbar">
                            <ToolbarTitle text="Property Data" />
                        </Toolbar>
                        <MetricTable data={this.state.chartData} assetOptions={this.state.assetOptions} scoreOptions={this.state.scoreOptions} />
                    </Paper>
                </Col>
            </Row>
        )
    },
    handleChange: function(e, i, v) {
        this.setState({chart: this.state.charts[i]});
    },
    handleRankingChange: function(e, i, v) {
        this.setState({ranking: this.state.charts[i]});
    },
    renderMiddle: function() {
        var entity_keys = _.keys(this.state.assets);
        var rankings = [];
        _.each(entity_keys, function(key) {
            var metricKey = this.state.ranking + "_" + key;
            var metric = this.state.scoreMetrics[metricKey];
            rankings.push({
                name : this.state.assets[key].name,
                image: this.state.assets[key].image_url,
                score: metric.value
            });
        }.bind(this));
        rankings = _.sortBy(rankings, 'score').reverse();
        var name = titleize(this.state.chart.split("_").join(" "));
        var currentScore = this.state.scores[name];
        var i = 0;
        return (
             <Row style={{marginTop: "20px"}}>
                <Col md={8}>
                    <Paper zDepth={4} style={{backgroundColor: "white", margin: "0px"}}>
                    <Toolbar style={{backgroundColor: "#4861A6", color: "white"}}className="toolbar">
                        <ToolbarTitle text="Property Scores" />
                        <ToolbarGroup lastChild={true} >
                        <Popover
                            open={this.state.open}
                            anchorEl={this.state.anchorEl}
                            anchorOrigin={{"horizontal":"left","vertical":"center"}}
                            targetOrigin={{"horizontal":"right","vertical":"center"}}
                            onRequestClose={this.handleRequestClose}
                            style={{marginTop: "5%", backgroundColor: "rgba(26, 54, 127, 0.2)"}}
                            >
                            <div sytle={{display: "inline-block"}}>
                            <span style={{verticalAlign: 'middle', display: 'flex', justifyContent: 'center'}}>
                                <img style={{marginTop: "5%", verticalAlign: "middle"}}src={currentScore.image} />
                            </span>
                            </div>
                        </Popover>

                        <DropDownMenu value={this.state.chart} onChange={this.handleChange} labelStyle={{color: "white"}}>
                        {this.state.charts.map(function(i) {
                            return (
                                <MenuItem
                                    value={i}
                                    primaryText={i.split("_").join(" ")}
                                    key={uuid.v4()}
                                    style={{textTransform: 'uppercase'}}
                                />
                            )
                        }.bind(this))}
                        </DropDownMenu>
                        <div style={{cursor: "pointer", marginTop: "15px",marginLeft: "-20px", marginRight: "5px"}} ref='target' onClick={this.handleScoreView}>
                            <InfoIcon
                            style={{
                                color: "#e76959",
                                cursor: "pointer",
                                height: "20px",
                                width: "20px",
                                pointerEvents: "none"
                            }}
                            />
                        </div>
                    </ToolbarGroup>
                    </Toolbar>
                    <div style={{height: "550px"}}>
                        <ScoreBar assets={this.state.assets} metric={this.state.chart} scoreMetrics={this.state.scoreMetrics} />
                    </div>
                    </Paper>
                </Col>
                <Col md={4}>
                    <Paper zDepth={4} style={{backgroundColor: "white", margin: "0px"}}>
                        <Toolbar style={{backgroundColor: "#4861A6"}} className="toolbar">
                            <ToolbarTitle text="Ranking" />
                            <DropDownMenu value={this.state.ranking} onChange={this.handleRankingChange} labelStyle={{color: "white"}}>
                                {this.state.charts.map(function(i) {
                                    return (
                                        <MenuItem
                                            value={i}
                                            primaryText={i.split("_").join(" ")}
                                            key={uuid.v4()}
                                            style={{textTransform: 'uppercase'}}
                                        />
                                    )
                                }.bind(this))}
                            </DropDownMenu>

                        </Toolbar>
                        <Table height={"550px"}>
                            <TableBody
                                displayRowCheckbox={false}
                            >
                                {rankings.map(function(r) {
                                    return (
                                         <TableRow key={uuid.v4()} style={{fontFamily: "Avenir-Book"}}>
                                            <TableRowColumn key={uuid.v4()} style={{paddingLeft: "10px", paddingRight: "10px", width: "15px"}}>#{++i}</TableRowColumn>
                                            <TableRowColumn key={uuid.v4()} style={{paddingLeft: "10px", paddingRight: "10px", width: "30px"}}><Avatar src={r.image} /></TableRowColumn>
                                            <TableRowColumn key={uuid.v4()} style={{paddingLeft: "10px", paddingRight: "10px", width: "60px"}}>{r.name}</TableRowColumn>
                                            <TableRowColumn key={uuid.v4()} style={{paddingLeft: "10px", paddingRight: "10px", width: "100px"}}>
                                                <LinearProgress key={uuid.v4()} color="#208089" style={{marginTop: "15px", height: "15px"}}mode="determinate" value={r.score * 100}/>
                                                <p style={{position: "relative", display: "inline", color: "white", left: "85px", top: "-17.5px"}}>{Math.round(r.score * 100.0)}</p>
                                            </TableRowColumn>
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
        return this.getFlux().store("AnalyticsStore").getState();
    },
    render: function() {
        if (!this.state.assetsLoaded || !this.state.scoresLoaded || !this.state.scoreMetricsLoaded || !this.state.chartDataLoaded) {
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
