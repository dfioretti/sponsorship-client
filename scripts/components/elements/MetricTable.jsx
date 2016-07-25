var React = require('react');
var DataGrid = require('react-datagrid');
var _ = require('underscore');
var sorty = require('sorty');

var SORT_INFO = [ { name: 'entity_key', dir: 'asc' } ]

function sort(arr) {
    return sorty(SORT_INFO, arr)
}

var MetricTable = React.createClass({
    getInitialState: function() {
       var data = [];
        _.each(this.props.assets, function(asset) {
            _.each(asset.metrics, function(metric) {
                data.push(metric);
            })
        });

        var columns = [
            { name: 'index', title: '#', width: 50 },
            { name: 'entity_key', flex: 1 },
            { name: 'source', flex: 1 },
            { name: 'metric', flex: 1 },
            { name: 'value', flex: 1 }
        ];
        var rows = [].concat(data);

        return { data: data, columns: columns, originalData: rows }
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
    render: function() {
        return (
            <div id="my-grid">
            <DataGrid
                idProperty="id"
                dataSource={this.state.data}
                sortInfo={SORT_INFO}
                onSortChange={this.handleSortChange}
                columns={this.state.columns}
                liveFilter={true}
                groupBy={['entity_key', 'source']}
                onFilter={this.handleFilter}
                style={{height: 400}}
            />
            </div>
        );
    }

});

module.exports = MetricTable;
