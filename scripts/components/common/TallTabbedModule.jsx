var React = require('react'),
		Tabs = require('material-ui').Tabs,
		Tab = require('material-ui').Tab,
		FontIcon = require('material-ui').FontIcon,
		Social = require('react-icons/lib/fa/comment-o'),
		Dollar = require('react-icons/lib/fa/dollar'),
		Dash = require('react-icons/lib/fa/dashboard'),
		GenericValueListItem = require('./charts/GenericValueListItem.jsx');


var TallTabbedModule = React.createClass({
	getInitialState: function() {
		return { value: 'a' }
	},
	handleTabChange: function(value) {
		console.log("handle", value);
		this.setState({value: value});
	},
	render: function() {
		return (
			<div id="top_global_issues" className="dashboard-module tall">
				<div className="top">
					<div className="drag-handle"></div>
					<div className="top-title">Asset Data</div>
				</div>
				<div className="main">
					<Tabs
						value={this.state.value}
						onChange={this.handleTabChange}
						tabItemContainerStyle={{
							backgroundColor: "#2d64a5",
							position: "absolute",
							bottom: "0px"
						}}
						inkBarStyle={{
							backgroundColor: "#50e3c2",
							position: "absolute",
							bottom: "50px"
						}}
						>
						<Tab
							icon={<Social />}
							value="a"
							>
							<div className="global-issues-list-container-tall">
								<ul className="generic-list">
									{this.props.asset.metrics.map(function(metric) {
										return (
											<GenericValueListItem
												key={metric.id}
												statImage={metric.icon}
												statHeader={metric.metric}
												link={"/"}
												statMetric={metric.value}
												/>
										);
									})}
								</ul>
							</div>
						</Tab>
						<Tab
							icon={<Dollar />}
							value="b"
							>
							<h1>yo?</h1>
						</Tab>
						<Tab
							icon={<Dash />}
							value="c"
							>
							<h1>hola</h1>
						</Tab>
						</Tabs>
				</div>
			</div>
		);
	}
});

module.exports = TallTabbedModule;
