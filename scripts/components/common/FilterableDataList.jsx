var React = require('react');


var FilterableDataList = React.createClass({
	getInitialState: function() {
		return {filteredList: this.props.dataList};
	},
	formatData: function(point) {
		return point.split("_").join(" ");
	},
	getDataPointList: function() {
		var list = [];
		var imgStyle = {
			height: "50px",
			width: "50px",
			borderRadius: "50%",
			marginLeft: "0px"
		};

		this.state.filteredList.map(function(item) {
			var image = item.icon;
			var name = this.formatData(item.point);
			list.push(
				<div key={item.id} className="container filter-content">
					<div id={item.id} className="row filter-row">
						<div id={item.id} style={{paddingTop: "10px"}} className="col-md-3 filter-row">
							<img style={imgStyle} src={image} />
						</div>
						<div id={item.id} style={{height: "50px", paddingTop: "20px"}} className="col-md-5 filter-row data-item">
							{name}
						</div>
					</div>
				</div>);
		}.bind(this));
		return list
	},
	handleDataFilterChange: function(e) {
		var filterText = e.target.value;
		var filteredList = [];
		this.props.dataList.forEach(function(item) {
			if (item['point'].split("_").join(" ").indexOf(filterText) === -1) {
				return;
			} else {
				filteredList.push(item);
			}
		});
		this.setState({filteredList: filteredList});
	},
	render: function() {
		var dataPointList = this.getDataPointList();
		return (
			<div>
				<label>Select Data</label><br />
				<input type="text" placeholder="Filter avilable data" className="form-control" onChange={this.handleDataFilterChange} />
				<ul className="filter-list" onClick={this.props.handleSelect}>
					{dataPointList}
				</ul>
			</div>
		)
	}
});
module.exports = FilterableDataList;
