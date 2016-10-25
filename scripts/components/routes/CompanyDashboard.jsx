var React = require('react');
var CircularProgress =  require('material-ui').CircularProgress;
var CalcIcon = require('react-icons/lib/fa/calculator');
var Grid = require('react-bootstrap').Grid;
var Col = require('react-bootstrap').Col;
var Row = require('react-bootstrap').Row;
var uuid = require('node-uuid');
var Colors = require('../../constants/colors.js');
var Card = require('material-ui').Card;
var CardMedia = require('material-ui').CardMedia;
var Avatar = require('material-ui').Avatar;
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var ContractIcon = require('react-icons/lib/md/contacts');
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Paper = require('material-ui').Paper;
var CardTitle = require('material-ui').CardTitle;
var ReactEcharts = require('echarts-for-react');
var theme = require('../../constants/walden.js');
var echarts = require('echarts');
var DashboardCard = require('../common/DashboardCard.jsx');
var _ = require('underscore');
var DropDownMenu = require('material-ui').DropDownMenu;
var MenuItem = require('material-ui').MenuItem;
var ReactDataGrid = require('react-data-grid');
var ReactDataGridPlugins = require('react-data-grid/addons');
var Toolbar = ReactDataGridPlugins.Toolbar;
var Selectors = ReactDataGridPlugins.Data.Selectors;
var LinearProgress = require('material-ui').LinearProgress;
var numberFormat = require('underscore.string/numberFormat');
var LiveTwitter = require('../common/LiveTwitter.jsx');
var PortfolioSummaryTable = require('../common/PortfolioSummaryTable.jsx');
var API_ROOT = require('../../constants/environment.js').API_ROOT;
var $ = require('jquery');
var CardText = require('material-ui').CardText;
var DashboardContainer = require('../common/DashboardContainer.jsx');
var Divider = require('material-ui').Divider;
var IconButton = require('material-ui').IconButton;
var TwitterIcon = require('react-icons/lib/fa/twitter');
var FacebookIcon = require('react-icons/lib/fa/facebook');
var Chip = require('material-ui').Chip;
var CalendarIcon = require('react-icons/lib/md/perm-contact_calendar');
var CardHeader = require('material-ui').CardHeader;
var PropertyIcon = require('react-icons/lib/md/people');
var SpendIcon = require('react-icons/lib/md/attach-money');
var BudgetIcon = require('react-icons/lib/fa/money');
var GridList = require('material-ui').GridList;
var GridTile = require('material-ui').GridTile;
var Card = require('material-ui').Card;
var Subheader = require('material-ui').Subheader;
var Navigation = require('react-router').Navigation;
var Link = require('react-router').Link;
var numberFormat = require('underscore.string/numberFormat');


var rowHeight = 250;
var CompanyDashboard = React.createClass({
	mixins: [ FluxMixin, StoreWatchMixin("AssetsStore", "DocumentStore")],
	componentWillMount: function() {
		if (!this.state.assetsLoaded && !this.state.loading)
		this.getFlux().actions.loadAssets();
	},
	renderPropertyGrid: function() {
		return (
			<div style={{marginRight: 20, marginLeft: -15}}>
				{this.getFlux().store("AssetsStore").getOwnedAssets().map((tile) => (
					<Col md={3}
						style={{margin: "20px -20px 20px 20px"}}
						key={uuid.v4()}
						>
						<Card>
							<CardMedia
								overlay={<CardTitle showExpandableButton={true} actAsExpander={true} title={tile.name} subtitle={tile.category + " - " + tile.subcategory} />}
								>
								<img src={tile.image_url} style={{height: 300}} />
							</CardMedia>
							<CardTitle
								actAsExpander={true}
								showExpandableButton={true}
								title=""
								titleStyle={{textTransform: 'uppercase', letterSpacing: '1.5px'}}
								/>
							<CardText expandable={true}>
								this is the expandable tet
							</CardText>
						</Card>
					</Col>
				))}
			</div>
		);
	},
	getStateFromFlux: function() {
		return this.getFlux().store("AssetsStore").getState();
	},
	getOption: function() {
		var data = [];
		var legend = [];
		var metrics = [];
		var xAxis = [];
		var properties = [];
		var reachScore = [];
		var alignmentScore = [];
		var successScore = [];
		var financeScore = [];
		var engagementScore = [];
		var fanScore = [];
		{this.getFlux().store("AssetsStore").getOwnedAssets().map((tile) => (
			tile.metrics.map(function(met) {
				if (met.metric == "team_score") {
					if (legend.indexOf(met.source) == -1) {
						legend.push(met.metric);
					}
					metrics.push(numberFormat(met.value * 100, 2));
				} else if (met.metric == "reach_score") {
					reachScore.push(numberFormat(met.value * 100, 2));
				} else if (met.metric == 'fan_score') {
					fanScore.push(numberFormat(met.value * 100, 2));
				} else if (met.metric == 'success_score') {
					successScore.push(numberFormat(met.value * 100, 2));
				} else if (met.metric == 'finance_score') {
					financeScore.push(numberFormat(met.value * 100, 2));
				} else if (met.metric == 'engagement_score') {
					engagementScore.push(numberFormat(met.value * 100, 2));
				} else if (met.metric == 'alignment_score') {
					alignmentScore.push(numberFormat(met.value * 100, 2));
				} 
				if (properties.indexOf(tile.name) == -1)
					properties.push(tile.name);
			})
		))};
		engagementScore.pop();
		var option = {
			tooltip : {
				trigger: 'axis',
				axisPointer : {            // 坐标轴指示器，坐标轴触发有效
					type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis : [
				{
					type : 'category',
					data : properties,//['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
					axisTick: {
						alignWithLabel: true
					}
				}
			],
			yAxis : [
				{
					type : 'value'
				}
			],
			series : [
				{
					name:'Team Score',
					type:'bar',
					//barWidth: '60%',
					data: metrics//[10, 52, 200, 334, 390, 330, 220]
				},
				{
					name: 'Reach Score',
					type: 'bar',
					data: reachScore
					//barW
				},
				{
					name: 'Alignment Score',
					type: 'bar',
					data: alignmentScore
				}, 
				{
					name: 'Fan Score',
					type: 'bar',
					data: fanScore
				},
				{
					name: "Finance Score",
					type: 'bar',
					data: financeScore
				},
				{
					name: "Success Score",
					type: 'bar',
					data: successScore
				},
				{
					name: "Engagement Score",
					type: 'bar',
					data: engagementScore
				}
			]
		};
		var options = {
			tootltip: {
				trigger: 'axis'
			},
			xAxis: [
				{
					type: 'value'
				}
			]
		}
		return option;
	},
	renderPortfolioTable: function() {
		return (
				<Row style={{marginLeft: 5, marginRight: 0, marginBottom: 20, marginTop: 0}}>
				<Col md={12}>
				<Card>
				<CardHeader titleStyle={{fontWeight: 500}} title="Contract Data" avatar={<ContractIcon size={20} style={{color: Colors.MAIN}} />} />
					<PortfolioSummaryTable data={this.getFlux().store("AssetsStore").getOwnedAssets()} />
				</Card>
				</Col>
				</Row>
		);
	},
	renderChart: function() {
		return (
			<Grid fluid={true}>
			<Row style={{marginLeft: -10}}>
			<Col md={12}>
				<Card>
			<CardHeader titleStyle={{fontWeight: 500}} avatar={<CalcIcon size={20} style={{color: Colors.MAIN}} />} title="Property Scores" />
			<ReactEcharts
				option={this.getOption()}
				style={{height: 300}}
				theme="theme"
				/>
			</Card>
			</Col>
			</Row>
			</Grid>
		);
	},
	renderStatsRow: function() 	{
		return (
			<Row style={{marginRight: 20}}>
				<Col md={3}>
					<DashboardCard heading="Owned Properties" style={1} metric="&nbsp;&nbsp;&nbsp;	4" icon={<PropertyIcon style={{color: Colors.WHITE}} size={48} />}/>
				</Col>
				<Col md={3}>
					<DashboardCard heading="Portfolio Spend" style={2} metric="$483K" icon={<SpendIcon style={{color: Colors.WHITE}} size={48} />}/>
				</Col>
				<Col md={3}>
					<DashboardCard heading="Next Renewal" style={3} metric="1/10/17" icon={<CalendarIcon style={{color: Colors.WHITE}} size={48} />}/>
				</Col>
				<Col md={3}>
					<DashboardCard heading="Remaining Budget" style={4} metric="$130K" icon={<BudgetIcon style={{color: Colors.WHITE}} size={48} />}/>
				</Col>
			</Row>
		)
	},
	render: function() {
		if (!this.state.assetsLoaded) return (<div>wait</div>);
		echarts.registerTheme('theme', theme);
		return (
			<div>
				<Card>
					<CardMedia
						overlay={
							<div style={{height: 90}}>
								<Row style={{margin: 0, height: 75, padding: 0}}>
									<Col md={2}>
										<Avatar size={175} className="profileAvatar" src={"/images/" + location.hostname.split(".")[0] + ".png"} />
									</Col>
									<Col md={4} style={{marginTop: 33, marginLeft: 30, padding: 0}}>
										<div className="text-fix large">McDonald's</div>
										<div className="text-fix medium">Chicago</div>
									</Col>
									<Col md={5}>
									</Col>
								</Row>
							</div>
						}
						>
						<img className="cover-photo" style={{height: 300}} src={'/images/login/login-bw.jpg'} />
					</CardMedia>
				</Card>
				{this.renderStatsRow()}
				{this.renderPortfolioTable()}
				{this.renderChart()}
				{this.renderPropertyGrid()}
			</div>
		);
	}

});

module.exports = CompanyDashboard;
