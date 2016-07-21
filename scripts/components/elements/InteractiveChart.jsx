var React = require('react');
var _ = require('underscore');
var LineChart = require('react-chartjs').Line;
var BarChart = require('react-chartjs').Bar;
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var SelectField = require('material-ui').SelectField;
var MenuItem = require('material-ui').MenuItem;
var Checkbox = require('material-ui').Checkbox;
var uuid = require('node-uuid');
var numberFormat = require('underscore.string/numberFormat');
var titleize = require('underscore.string/titleize');
var Col = require('react-bootstrap').Col;
var Grid = require('react-bootstrap').Grid;
var Row = require('react-bootstrap').Row;
var Toolbar = require('material-ui').Toolbar;
var DropDownMenu = require('material-ui').DropDownMenu;
var ToolbarGroup = require('material-ui').ToolbarGroup;
var IconMenu = require('material-ui').IconMenu;
var Menu = require('material-ui').Menu;
var RaisedButton = require('material-ui').RaisedButton;
var Popover = require('material-ui').Popover;
var Drawer = require('material-ui').Drawer;
var Avatar = require('material-ui').Avatar;



var InteractiveChart = React.createClass({
    mixins: [FluxMixin],
    getInitialState: function() {
        var colors = ["#3c88d1", "#50e3c2", "#f5a623", "#e76959", "#97c93c", "#ffd300", "#ff0000"];
        var assets = this.getFlux().store("AssetsStore").getState().assets;
        var data = {};
        var assetMap = {};
        var chartData = {
            labels: ["2010", "2011", "2012", "2013", "2014", "2015"],
            datasets: [
                {
                    data: [ 1, 2, 3, 4, 5, 6 ]
                }
            ]
        };
        var displayAssets = [];
        displayAssets.push(assets[0].entity_key);
        displayAssets.push(assets[1].entity_key);
        displayAssets.push(assets[2].entity_key);

        _.each(assets, function(asset) {
            assetMap[asset.entity_key] = asset;
            _.each(asset.historicals, function(h) {
                if (_.has(data, h.metric)) {
                    data[h.metric][h.entity_key] = 1;
                } else {
                    var obj = {};
                    obj[h.entity_key] = 1;
                    data[h.metric] = obj;
                }
            }.bind(this));
        }.bind(this));
        var metrics = _.keys(data);
        return { open: false, colors: colors, assetMap: assetMap, displayAssets: displayAssets, chartData: chartData, data: data, metrics: metrics, value: metrics[0] }
    },
    handleDataChange: function(e, i, v) {
        this.setState({value: this.state.metrics[i]});
    },
    renderSelector: function() {
//                                            label={titleize(a.split("_").pop(-1))}
//style={{height: "30px", marginLeft: "-20px", marginRight: "-50px", paddingTop: "10px"}}>
// <Col md={2} style={{paddingTop: "13px", marginLeft: "-30px", marginRight: "-40px"}}>
//                                        <Avatar src={this.state.assetMap[a].image_url} style={{position: "relative", top: "-30px", left: "40px", size: 20}}/>
        //

        var assets = _.keys(this.state.data[this.state.value]);
        return (
            <Row style={{height: "50px" }}>
                <Col style={{textTransform: "uppercase", marginTop: "-2px", marginRight: "0px", marginLeft: "-30px"}}md={2}>
                    <DropDownMenu
                        onChange={this.handleDataChange}
                        value={this.state.value}
                        labelStyle={{color: "white"}}
                        underlineStyle={{display: "none"}}
                        >
                        {this.state.metrics.map(function(m) {
                            return (
                                <MenuItem
                                    value={m}
                                    primaryText={m}
                                    key={uuid.v4()}
                                    />
                            )
                        })}
                    </DropDownMenu>
                    </Col>
                                {assets.map(function(a) {
                                    return (
                                        <Col md={2} style={{paddingTop: "13px", marginLeft: "-30px", marginRight: "-40px"}}>
                                        <Checkbox
                                            key={a}
                                            label=""
                                            id={a}
                                            labelStyle={{color: "white", marginLeft: "-10px"}}
                                            inputStyle={{marginRight: "20px"}}
                                            defaultChecked={this.isChecked(a)}
                                            onCheck={this.toggleCheck}
                                        >
                                        </Checkbox>
                                        <Avatar src={this.state.assetMap[a].image_url} style={{position: "relative", top: "-30px", left: "40px", size: 20}}/>
                                        </Col>
                                    )
                                }.bind(this))}
                    </Row>
        )
    },
    handleTouchTap: function(event) {
        event.preventDefault();
        this.setState({open: true, anchorEl: event.currentTarget});
    },
    handleRequestClose: function() {
        this.setState({open: false});
    },
    isChecked: function(key) {
        return _.contains(this.state.displayAssets, key);
    },
    toggleCheck: function(event, checked) {
        console.log(this.state.chartData, event.target.id, checked, "ok");
        var chartAssets = [];
        _.each(this.state.displayAssets, function(asset) {
            chartAssets.push(asset);
        });
        if (checked) {
            chartAssets.push(event.target.id);
        } else {
            var index = chartAssets.indexOf(event.target.id);
            if (index > -1) {
                chartAssets.splice(index, 1);
            }
        }
        this.setState({displayAssets: chartAssets});
    },
    loadChartData: function() {
        var dataSets = [];
        var chartData;
        var chartLabels = [ "2010", "2011", "2012", "2013", "2014", "2015" ];
        _.each(this.state.displayAssets, function(key) {
            var data = [];
            _.each(this.state.assetMap[key].historicals, function(h) {
                if (h.metric == this.state.value) {
                    var index = this.state.displayAssets.indexOf(key);
                    dataSets.push({
                        data: _.values(h.data),
                        label: titleize(key.split("_").join(" ")),
                        fillColor: "rgba(172, 194, 132, 0.0)",
                        pointStrokeColor: this.state.colors[index],
                        strokeColor: this.state.colors[index],
                        pointColor: this.state.colors[index],

                    });
                    return;
                }
            }.bind(this));

        }.bind(this));

        var chartData = {
            labels: chartLabels,
            datasets: dataSets
        }
        return chartData;
    },
    renderChart: function() {
        var steps = 12;
        var chartData = this.loadChartData();
        var sample = [];
        _.each(chartData.datasets, function(set) {
            sample.push(set.data[0]);
        });
        var max = (_.max(sample)) * 2;
        var chartSettings = {
            scaleFontColor: "#fff",
            scaleFontSize: 16,
           // scaleOverride: true,
            scaleSteps: steps,
            //scaleStepWidth: Math.ceil(max / steps),
            backgroundColor: "#fff",
            scaleLabel: function(valuePayload) {
                 var val = parseFloat(valuePayload.value);
                 if (val < 1000) {
                     if (val < 1) {
                         return numberFormat(val, 3);
                     }
                     return numberFormat(val, 2);
                 } else {
                     return numberFormat(val, 0);
                 }
            }
        }
        return (
            <div className="interactive-chart" style={{display: 'flex', justifyContent: 'center'}}>
                <LineChart style={{marginTop: "5px"}}data={chartData} options={chartSettings} width="1150" height="500" redraw />
            </div>
        )
    },
    render: function() {
        console.log("render");
        return (
            <div data-ss-colspan='3' className="dashboard-module wide">
                <div className="top">
                    <div className="drag-handle"></div>
                    <div className="top-title">Interactive Data</div>
                </div>
                <div className="main">
                    <Grid style={{padding: "0px"}}>
                            {this.renderSelector()}
                            </Grid>
                    {this.renderChart()}
                </div>
            </div>
        );
    }
});

module.exports = InteractiveChart;
