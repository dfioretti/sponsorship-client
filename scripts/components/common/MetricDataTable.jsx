var React = require('react'),
		ReactBsTable = require('react-bootstrap-table'),
		TableHeaderColumn = ReactBsTable.TableHeaderColumn,
		_ = require('underscore'),
		Fluxxor = require('fluxxor'),
		ImageHelper = require('../../utils/ImageHelper.js'),
		FluxMixin = Fluxxor.FluxMixin(React),
		BootstrapTable = ReactBsTable.BootstrapTable;

var MetricDataTable = React.createClass({
	mixins: [FluxMixin],
	formatMetrics: function(cell, row) {
		return cell.split("_").join(" ");
	},
	onRowSelect: function(row, isSelected) {
		console.log("select", row, isSelected);
		this.getFlux().actions.updateNodeData(row.id);
		//this.props.handleSelect(row.id);
	},
	generateSourceDropdown: function() {
		// whatever, fuck this, i don't really know javascript
		var sourcesList = [];
		for(var i=0; i < this.props.data.length; i++) {
			if (!_.contains(sources, this.props.data[i].source))
				sourcesList.push(this.props.data[i].source);
		}
		var sources = {};
		for(var i=0; i < sourcesList.length; i++) {
			sources[sourcesList[i]] = sourcesList[i]
		}
		return sources;
	},
	formatIcon: function(cell, row) {
		var iconStyle = {
			height: "20px",
			width: "20px"
		}
		return '<img style={iconStyle} src={cell} />';
	},
	formatSource: function(cell, row) {
		var iconStyle = {
			height: "20px",
			width: "20px",
			margin: "0px 5px 0px 0px"
		}
		return <div><img style={iconStyle} src={ImageHelper("", row.icon)} /> {cell} </div>;
	},
 	render: function() {
		var selectRowProps = {
			mode: "radio",
			clickToSelect: true,
			bgColor: "rgb(0, 185, 209)",
			onSelect: this.onRowSelect
		}
		return (
			<BootstrapTable
				data={this.props.data}
				height={"400"}
				bordered={false}
				hover={true}
				condensed={false}
				striped={true}
				search={true}
				selectRow={selectRowProps}
				>
				<TableHeaderColumn
					dataField="id"
					isKey={true}
					hidden={true}
					>
					ID
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="source"
					dataSort={true}
					dataFormat={this.formatSource}
					filter={{type: "SelectFilter", options: this.generateSourceDropdown()}}
					>
					Source
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="point"
					dataSort={true}
					filter={{type: "TextFilter"}}
					dataFormat={this.formatMetrics}
					>
					Metric
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="icon"
					dataFormat={this.formatIcon}
					hidden={true}
					>
					Icon
				</TableHeaderColumn>
			</BootstrapTable>
		);
	}

});

module.exports = MetricDataTable;
