var React = require('react');
var DataGrid = require('react-datagrid');
var _ = require('underscore');
var sorty = require('sorty');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var ReactBsTable = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var Avatar = require('material-ui').Avatar;
var ListItem = require('material-ui').ListItem;
var SORT_INFO = [ { name: 'entity_key', dir: 'asc' } ]
var titleize = require('underscore.string/titleize');
var numberFormat = require('underscore.string/numberFormat');

function sort(arr) {
    return sorty(SORT_INFO, arr)
}

//var data = [];
//var originalData = [];
//var columns = [];

var MetricTable = React.createClass({
    //mixins: [ FluxMixin, StoreWatchMixin("ScoresStore") ],
    //getStateFromFlux: function() {
    //    return this.getFlux().store("ScoresStore").getState();
    //},
    getInitialState: function() {
        var scores = {};
        var scoreNames = [];
        var metricNames = [];
        _.each(this.props.scores, function(score) {
            var scoreName = score.name;
            scoreNames.push(score.name);
            _.each(score.score.nodeDataArray, function(node) {
                var parent = _.findWhere(score.score.nodeDataArray, { key: node.parent });
                var display = "";
                if (parent != null && typeof(parent) != 'undefined') {
                    display = parent.component;
                }

                metricNames.push(node.dataname);
                scores[node.dataname] = {
                    score: scoreName,
                    weight: node.weight,
                    group: display
                }
            });
        });
        var assetOptions = {};
        var metricOptions = {};
        var scoreOptions = {};
        var assetNames = [];
        var data = [];
        _.each(this.props.assets, function(asset) {
            assetNames.push(asset.name);
            _.each(asset.metrics, function(metric) {
                if (_.has(scores, metric.metric)) {
                    var entry = {
                        id: metric.id,
                        entity_key: asset.name,
                        source: metric.source,
                        metric: metric.metric,
                        value: metric.value,
                        icon: metric.icon,
                        norm_value: metric.norm_value,
                        rank: metric.rank,
                        entity_image: asset.image_url,
                        score: scores[metric.metric].score,
                        weight: scores[metric.metric].weight,
                        group: scores[metric.metric].group
                    }
                    data.push(entry);
                }
            })
        });
        _.each(assetNames, function(name) {
             assetOptions[name] = name;
        })
        _.each(metricNames, function(metric) {
             metricOptions[metric] = metric;
        })
        _.each(scoreNames, function(score) {
             scoreOptions[score] = score;
        })

        return { data: data, metricOptions: metricOptions, assetOptions: assetOptions, scoreOptions: scoreOptions }
    },
    handleSortChange: function(sortInfo) {
        SORT_INFO = sortInfo;
        data = [].concat(this.state.data)
        data = sort(data)
        this.setState({data: data})
    },
    handleFilter: function(column, value, allFilterValues){
        // todo - need original copy of data...
        var newData = [].concat(this.state.originalData);

        Object.keys(allFilterValues).forEach(function(name){
            var columnFilter = (allFilterValues[name] + '').toUpperCase()
            if (columnFilter == ''){
                return
            }
            newData = newData.filter(function(item){
                if ((item[name] + '').toUpperCase().indexOf(columnFilter) === 0){
                    return true
                }
            })
        })

	    this.setState({ data: newData })
	},
    formatEntity: function(cell, row) {
        return (
            <ListItem
                leftAvatar={<Avatar src={row['entity_image']} />}
                disabled={true}
                >{cell}
            </ListItem>
        );
    },
    formatText: function(cell, row) {
        return (
            <ListItem
                disabled={true}
                >{cell}
            </ListItem>
        );
    },
    formatMetric: function(cell, row) {
        return (
            <ListItem
                leftAvatar={<Avatar src={'images' + row['icon']} backgroundColor="#fff" />}
                disabled={true}
                >{titleize(cell.split("_").join(" "))}
            </ListItem>
        );
    },
    formatScore: function(cell, row) {
        console.log("pre", cell, row);
        var icon = 'images/metrics/' + cell.split(" ").join("_").toLowerCase() + '.png';
        console.log("icon" , icon);

        return (
            <ListItem
                leftAvatar={<Avatar src={icon} backgroundColor="#fff" />}
                disabled={true}
                >{titleize(cell)}
            </ListItem>
        )
    },
    formatNumber: function(cell, row) {
        var number = parseFloat(cell.toString() );
        var text = cell.toString();
        // has decimal
        if (number % 1 != 0) {
            if (number < 1) {
                return <ListItem disabled={true}>{numberFormat(number, 3)}</ListItem>
            }
            if (number < 100) {
                return <ListItem disabled={true}>{numberFormat(number, 2)}</ListItem>
            }
        }
        return <ListItem disabled={true}>{numberFormat(number, 0)}</ListItem>
    },
    render: function() {
        return (
        <div id="my-grid">
            <BootstrapTable
                data={this.state.data}
                height={"450"}
                hover={true}
                trClassName="mui-table"
                bordered={false}
                condensed={false}
                striped={false}
                search={false}
                style={{fontFamily: 'Avenir-Book'}}
                >
                <TableHeaderColumn
                    dataField="id"
                    isKey={true}
                    hidden={true}
                    >ID
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField="entity_key"
                    filter={{type: "SelectFilter", options: this.state.assetOptions}}
                    dataSort={true}
                    dataFormat={this.formatEntity}
                    width="100"
                    >Property
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField="metric"
                    filter={{type: "TextFilter", placeholder: 'Filter'}}
                    dataSort={true}
                    dataFormat={this.formatMetric}
                    width="100"
                    >Data Point
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField="value"
                    dataSort={true}
                    dataFormat={this.formatNumber}
                    width="50"
                    >Value
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField="score"
                    filter={{type: "SelectFilter", options: this.state.scoreOptions}}
                    dataSort={true}
                    width="100"
                    dataFormat={this.formatScore}
                    >Property Score
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField="weight"
                    dataSort={true}
                    dataFormat={this.formatNumber}
                    width="50"
                    >Weight
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField="group"
                    dataSort={true}
                    dataFormat={this.formatText}
                    width="100"
                    >Tier
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField="norm_value"
                    dataSort={true}
                    dataFormat={this.formatNumber}
                    width="50"
                    >Normalized
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField="rank"
                    width="50"
                    dataFormat={this.formatNumber}
                    dataSort={true}
                    >Peer Rank
                </TableHeaderColumn>
            </BootstrapTable>
        </div>
        )
        /*
        return (
                { name: 'index', title: '#', width: 50 },
            { name: 'entity_key', flex: 1 },
            { name: 'source', flex: 1 },
            { name: 'metric', flex: 1 },
            { name: 'value', flex: 1 },
            { name: 'score', flex: 1 },
            { name: 'weight', flex: 1 },
            { name: 'norm_value', flex: 1 },
            { name: 'rank', flex: 1}

            <div id="my-grid">
            <DataGrid
                idProperty="id"
                dataSource={this.state.data}
                sortInfo={SORT_INFO}
                onSortChange={this.handleSortChange}
                columns={this.state.columns}
                liveFilter={true}
                groupBy={['score', 'entity_key']}
                onFilter={this.handleFilter}
                style={{height: 400}}
            />
            </div>
        );
        */
    }
});

module.exports = MetricTable;
