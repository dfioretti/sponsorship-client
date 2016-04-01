var React = require('react'),
		Tabs = require('material-ui').Tabs,
		Tab = require('material-ui').Tab,
		FontIcon = require('material-ui').FontIcon,
		Social = require('react-icons/lib/fa/comment-o'),
		Dollar = require('react-icons/lib/fa/group'),
		Dash = require('react-icons/lib/fa/dashboard'),
		ImageHelper = require('../../utils/ImageHelper.js'),
		DataFormatter = require('../../utils/DataFormatter.js'),
		_ = require('lodash'),
		GenericValueListItem = require('./charts/GenericValueListItem.jsx');


var TallTabbedModule = React.createClass({
	getInitialState: function() {
		return { value: 'a' }
	},
	handleTabChange: function(value) {
		this.setState({value: value});
	},
	render: function() {
		var social = [];
		var team = [];
		var money = [];
		this.props.asset.metrics.map(function(metric) {
			switch (metric.source) {
				case 'team':
				case 'scarborough':
					team.push(metric);
					break;
				case 'facebook':
				case 'twitter':
				case 'google':
				case 'instagram':
					social.push(metric);
					break;
				case 'espn':
				case 'forbes':
				case 'mvp_index':
					money.push(metric);
					break;
			}
		});
		team 	 = _.sortBy(team, "source");
		social = _.sortBy(social, "source");
		money  = _.sortBy(money, "source");
		social.push({source: "klout", metric: "klout_score", icon: "/metrics/klout.png", value: this.props.asset.klout_score})

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
									{social.map(function(metric) {
										return (
											<GenericValueListItem
												key={metric.id}
												statImage={ImageHelper(metric.source, metric.icon)}
												statHeader={metric.metric}
												link={"/"}
												statMetric={DataFormatter(metric.value)}
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
							<div className="global-issues-list-container-tall">
								<ul className="generic-list">
									{money.map(function(metric) {
										return (
											<GenericValueListItem
												key={metric.id}
												statImage={ImageHelper(metric.source, metric.icon)}
												statHeader={metric.metric}
												link={"/"}
												statMetric={DataFormatter(metric.value)}
												/>
										);
									})}
								</ul>
							</div>
						</Tab>
						<Tab
							icon={<Dash />}
							value="c"
							>
							<div className="global-issues-list-container-tall">
								<ul className="generic-list">
									{team.map(function(metric) {
										return (
											<GenericValueListItem
												key={metric.id}
												statImage={ImageHelper(metric.source, metric.icon)}
												statHeader={metric.metric}
												link={"/"}
												statMetric={DataFormatter(metric.value)}
												/>
										);
									})}
								</ul>
							</div>
						</Tab>
						</Tabs>
				</div>
			</div>
		);
	}
});

module.exports = TallTabbedModule;
