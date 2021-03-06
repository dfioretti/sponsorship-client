var React = require('react'),
		Tabs = require('material-ui').Tabs,
		Tab = require('material-ui').Tab,
		FontIcon = require('material-ui').FontIcon,
		CircularProgress = require('material-ui').CircularProgress,
		Social = require('react-icons/lib/fa/comment-o'),
		Dollar = require('react-icons/lib/fa/group'),
		Dash = require('react-icons/lib/fa/dashboard'),
		ImageHelper = require('../../utils/ImageHelper.js'),
		DataFormatter = require('../../utils/DataFormatter.js'),
		_ = require('lodash'),
		GenericBarListItem = require('./charts/GenericBarListItem.jsx');
		GenericValueListItem = require('./charts/GenericValueListItem.jsx');

var TallTabbedModule = React.createClass({
	getInitialState: function() {
		return { value: 'a' }
	},
	handleTabChange: function(value) {
		this.setState({value: value});
	},
	render: function() {
		if (this.props.asset == null) {
			return (
				<div id="top_global_issues" className="dashboard-module tall">
					<div className="top">
						<div className="drag-handle"></div>
						<div className="top-title">{this.props.title}</div>
					</div>
					<div className="main">
						<div style={{marginTop: 50, display: 'flex', justifyContent: 'center'}}>
							<CircularProgress size={2} />
						</div>
					</div>
				</div>
			);
		}
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
		var bar = this.props.bar;
		var listClass = (bar) ? "probability-list" : "generic-list";
		if (!bar)
			social.push({source: "klout", metric: "klout_score", icon: "/metrics/klout.png", value: this.props.asset.klout_score})

		return (
			<div id="top_global_issues" className="dashboard-module tall">
				<div className="top">
					<div className="drag-handle"></div>
					<div className="top-title">{this.props.title}</div>
				</div>
				<div className="main">
					<Tabs
						value={this.state.value}
						onChange={this.handleTabChange}
						key={500}
						tabItemContainerStyle={{
							backgroundColor: "#2d64a5",
							position: "absolute",
							bottom: "0px"
						}}
						inkBarStyle={{
							backgroundColor: "rgb(0, 188, 212)",
							position: "absolute",
							bottom: "50px"
						}}
						>
						<Tab
							icon={<Social />}
							value="a"
							key={1}
							>
							<div className="global-issues-list-container-tall">
								<ul className={listClass} >
									{social.map(function(metric) {
										if (bar) {
											return (
												<GenericBarListItem
													key={metric.id}
													id={metric.id}
													link={false}
													statImage={ImageHelper(metric.source, metric.icon)}
													rightText={Math.round(DataFormatter(metric.rank))}
													probability={metric.rank}
													title={metric.metric.split("_").join(" ")}
													/>
											)
										}
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
							key={2}
							>
							<div className="global-issues-list-container-tall">
								<ul className={listClass}>
									{money.map(function(metric) {
										if (bar) {
											return (
												<GenericBarListItem
													key={metric.id}
													id={metric.id}
													link={false}
													statImage={ImageHelper(metric.source, metric.icon)}
													rightText={Math.round(DataFormatter(metric.rank))}
													probability={metric.rank}
													title={metric.metric.split("_").join(" ")}
													/>
											)
										}
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
							key={3}
							>
							<div className="global-issues-list-container-tall">
								<ul className={listClass}>
									{team.map(function(metric) {
										if (bar) {
											return (
												<GenericBarListItem
													key={metric.id}
													id={metric.id}
													link={false}
													statImage={ImageHelper(metric.source, metric.icon)}
													rightText={Math.round(DataFormatter(metric.rank))}
													probability={metric.rank}
													title={metric.metric.split("_").join(" ")}
													/>
											)
										}
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
