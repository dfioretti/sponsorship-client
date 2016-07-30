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

var MetricTable = React.createClass({
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
        var icon = 'images/metrics/' + cell.split(" ").join("_").toLowerCase() + '.png';
        return (
            <ListItem
                leftAvatar={<Avatar src={icon} backgroundColor="#fff" />}
                disabled={true}
                >{titleize(cell)}
            </ListItem>
        )
    },
    formatNumber: function(cell, row) {
        if (cell == null) return "";
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
                pagination={true}
                data={this.props.data}
                height={"420"}
                hover={true}
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
                    filter={{type: "SelectFilter", options: this.props.assetOptions}}
                    dataSort={true}
                    dataFormat={this.formatEntity}
                    width="120"
                    >Property
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField="metric"
                    filter={{type: "TextFilter", placeholder: 'Filter'}}
                    dataSort={true}
                    dataFormat={this.formatMetric}
                    width="120"
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
                    filter={{type: "SelectFilter", options: this.props.scoreOptions, defaultValue: "Team Score"}}
                    dataSort={true}
                    width="110"
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
                    hidden={true}
                    dataFormat={this.formatNumber}
                    width="50"
                    >Normalized
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField="rank"
                    width="50"
                    dataFormat={this.formatNumber}
                    dataSort={true}
                    >Metric Score
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
