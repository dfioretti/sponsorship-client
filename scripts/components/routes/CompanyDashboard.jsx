var React = require('react');
var CircularProgress =  require('material-ui').CircularProgress;
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
var PropertyIcon = require('react-icons/lib/md/people');
var SpendIcon = require('react-icons/lib/md/attach-money');
var BudgetIcon = require('react-icons/lib/fa/money');
var GridList = require('material-ui').GridList;
var GridTile = require('material-ui').GridTile;
var Card = require('material-ui').Card;
var Subheader = require('material-ui').Subheader;
var Navigation = require('react-router').Navigation;
var Link = require('react-router').Link;


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
		{this.getFlux().store("AssetsStore").getOwnedAssets().map((tile) => (
			tile.metrics.map(function(met) {
				console.log('prp',tile)
				console.log('met', met)
				if (met.source == "score") {
					console.log('prp',tile)
					if (legend.indexOf(met.source) == -1) {
						legend.push(met.metric);
					}
					metrics.push(met.value);
				}
			})
		))};
		console.log('data', xAxis, metrics, legend);
		option = {
			color: ['#3398DB'],
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
					data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
					name:'直接访问',
					type:'bar',
					barWidth: '60%',
					data:[10, 52, 200, 334, 390, 330, 220]
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
	renderChart: function() {
		return (
			<ReactEcharts
				option={this.getOption()}
				style={{height: 300, width: '100%'}}
				theme="theme"
				/>
		);
	},
	renderStatsRow: function() 	{
		return (
			<Row style={{marginRight: 20}}>
				<Col md={3}>
					<DashboardCard heading="Owned Properties" style={1} metric="&nbsp;&nbsp;&nbsp;	4" icon={<PropertyIcon style={{color: Colors.MAIN}} size={48} />}/>
				</Col>
				<Col md={3}>
					<DashboardCard heading="Portfolio Spend" style={2} metric="$483K" icon={<SpendIcon style={{color: Colors.SECONDARY}} size={48} />}/>
				</Col>
				<Col md={3}>
					<DashboardCard heading="Next Renewal" style={3} metric="1/10/17" icon={<CalendarIcon style={{color: Colors.LIGHT_BLUE}} size={48} />}/>
				</Col>
				<Col md={3}>
					<DashboardCard heading="Remaining Budget" style={4} metric="$130K" icon={<BudgetIcon style={{color: Colors.LIME_GREEN}} size={48} />}/>
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
				{this.renderChart()}
				{this.renderPropertyGrid()}
			</div>
		);
	}

});

module.exports = CompanyDashboard;
