var React = require('react');
var CircularProgress = require('material-ui').CircularProgress;
var Grid = require('react-bootstrap').Grid;
var Col = require('react-bootstrap').Col;
var Row = require('react-bootstrap').Row;
var Colors = require('../../constants/colors.js');
var Card = require('material-ui').Card;
var CardMedia = require('material-ui').CardMedia;
var Avatar = require('material-ui').Avatar;
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Paper = require('material-ui').Paper;
var CardTitle = require('material-ui').CardTitle;
var TextField = require('material-ui').TextField;
var DownloadIcon = require('react-icons/lib/md/file-download');
var ReactBsTable = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var ReactEcharts = require('echarts-for-react');
var theme = require('../../constants/walden.js');
var echarts = require('echarts');
var _ = require('underscore');
var DropDownMenu = require('material-ui').DropDownMenu;
var MenuItem = require('material-ui').MenuItem;
var ReactDataGrid = require('react-data-grid');
var ReactDataGridPlugins = require('react-data-grid/addons');
var Toolbar = ReactDataGridPlugins.Toolbar;
var LineChart = require('react-icons/lib/fa/line-chart');
var BarChart = require('react-icons/lib/fa/bar-chart');
var PieChart = require('react-icons/lib/fa/pie-chart');
var AreaChart = require('react-icons/lib/fa/area-chart');
var CalcIcon = require('react-icons/lib/fa/calculator');
var TableIcon = require('react-icons/lib/fa/list');
var UserIcon = require('react-icons/lib/fa/user');
var RadarIcon = require('react-icons/lib/md/gps-fixed');
var Selectors = ReactDataGridPlugins.Data.Selectors;
var LinearProgress = require('material-ui').LinearProgress;
var numberFormat = require('underscore.string/numberFormat');
var LiveTwitter = require('../common/LiveTwitter.jsx');
var API_ROOT = require('../../constants/environment.js').API_ROOT;
var $ = require('jquery');
var CardText = require('material-ui').CardText;
var DashboardContainer = require('../common/DashboardContainer.jsx');
var Divider = require('material-ui').Divider;
var titleize = require('underscore.string/titleize');
var IconButton = require('material-ui').IconButton;
var TwitterIcon = require('react-icons/lib/fa/twitter');
var FacebookIcon = require('react-icons/lib/fa/facebook');
var Chip = require('material-ui').Chip;


var rowHeight = 250;
var PropertyDashboard = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("AssetsStore", "DocumentStore")],

	componentWillMount: function () {
		if (this.state.assets == null && !this.state.assetsLoaded && !this.state.loading) {
			this.getFlux().actions.loadAssets();
		} else {
			var property = this.getFlux().store("AssetsStore").getAsset(this.props.params.id);
			if (!property) return;
			var historicals = [];
			property.historicals.map(function (h) {
				historicals.push(h.metric);
			});
			var originalRows = property.metrics;
			var rows = originalRows.slice(0);
			this.loadData(property.twitter_handle);
			this.setState({
				property: property,
				rows: rows,
				originalRows: originalRows,
				historicals: historicals
			});
		}
	},
	handleHistoricalChange: function (event, index, value) {
		this.setState({
			historical: value
		});
	},
	getInitialState: function () {
		return { property: null, historical: 3, historicals: [], rows: [], originalRows: [], tweets: [] }
	},
	loadData: function (handle) {
		//if (this.state.property == null) return;
		$.ajax({
			type: "GET",
			contentType: "application/json",
			url: API_ROOT + "api/v1/twitter",
			data: { screen_name: handle },
			success: function (data, status, xhr) {
				this.setState({
					tweets: data
				});
				this.forceUpdate();
			}.bind(this),
			error: function (xhr, status, error) {
				console.log(status);
				console.log(error);
			}
		});
	},
	componentWillReceiveProps: function (newProps) {
		if (this.state.assetsLoaded) {
			var property = this.getFlux().store("AssetsStore").getAsset(newProps.params.id);
			var originalRows = property.metrics;
			var rows = originalRows.slice(0);

			if (this.state.tweets.length > 0) {
				if (newProps.params.id != this.props.params.id) {
					this.loadData(property.twitter_handle);
				}
			} else {
				this.loadData(property.twitter_handle);
			}
			var historicals = [];
			property.historicals.map(function (h) {
				historicals.push(titleize(h.metric.split("_").join(" ")));
			});
			this.setState({
				property: property,
				rows: rows,
				originalRows: originalRows,
				historicals: historicals
			});
		}
	},
	getStateFromFlux: function () {
		return this.getFlux().store("AssetsStore").getState();
	},
	getOptions: function () {
		var hist = this.state.property.historicals[this.state.historical];
		var label = titleize(hist.metric.split("_").join(" "));
		var options = {
			xAxis: [
				{
					type: 'category',
					data: _.keys(this.state.property.historicals[this.state.historical].data)
				}
			],
			yAxis: [
				{
					type: 'value'
				}
			],
			tooltip: {
				trigger: 'axis'
			},
			series: [
				{
					name: label,//hist.metric,//property.historicals[this.state.historical].metric,
					type: 'line',
					data: _.values(this.state.property.historicals[this.state.historical].data),
				}
			],
			legend: {
				data: [label]//[hist.metric]//[property.historicals[this.state.historical].metric]
			},
			grid: {
				y: 60,
				x: 90,
				x2: 60,
				containLabel: false
			}
		}
		return options;
	},
	handleChange: function (event, index, value) {
		this.setState({
			historical: index
		});
	},
	getRadar: function (property) {
		var indicators = [];
		var data = [];
		var legend = [];
		property.metrics.forEach(function (metric) {
			if (metric.source == 'score') {
				indicators.push({ text: metric.metric.split("_")[0], max: 1 });
				legend.push(metric.metric.split("_")[0]);
				data.push(metric.value);
			}
		});
		var options = {
			polar: [
				{
					indicator: indicators
				}
			],
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				orient: 'horizontal',
				x: 'left',
				y: 'top',
				data: ['Scores']
			},
			series: [
				{
					name: "Property Scores",
					type: 'radar',
					itemStyle: {
						normal: {
							areaStyle: {
								type: 'default'
							}
						}
					},
					data: [
						{
							value: data,
							name: "Scores"
						}
					]
				}
			],
			grid: {
				x: 100,
				x2: 100
			}
		}
		return options;
	},
	getPie: function (property) {
		var data = [];
		property.metrics.forEach((function (metric) {
			if (metric.metric == 'facebook_likes') {
				data.push({ value: metric.value, name: 'FB' });
			} else if (metric.metric == 'twitter_followers') {
				data.push({ value: metric.value, name: 'Twitter' });
			} else if (metric.metric == 'instagram_followers') {
				data.push({ value: metric.value, name: "Instagram" });
			} else if (metric.metric == 'google_followers') {
				data.push({ value: metric.value, name: "Google+" });
			}
		}));

		var options = {
			calculable: true,
			tooltip: {
				trigger: 'item'
			},
			legend: {
				orient: 'horizontal',
				x: 'left',
				y: 'top',
				data: ['FB', 'Twitter', 'Instagram', 'Google+']
			},
			series: [
				{
					name: 'Social Reach',
					type: 'pie',
					radius: '55%',
					center: ['50%', '60%'],
					data: data
				}
			]/*,
			grid: {
			y: 60,
			x: 90,
			x2: 60,
			containLabel: false
			}
			*/
		}
		return options;
	},
	rowGetter: function (i) {
		return this.state.rows[i];
	},
	formatRank: function (cell, row) {
		if (cell == null) {
			cell = row.value;
		}
		return (
			<Row>
				<Col md={10}>
					<LinearProgress mode="determinate" max={1} mind={0} value={parseFloat(cell)} style={{ height: 15 }} />
				</Col>
				<Col md={2}>
					<span style={{ position: 'relative', right: 20 }}>{Math.round(parseFloat(cell) * 100)}</span>
				</Col>
			</Row>
		);
	},
	rankFormatter: function (data) {
		return (
			<Row>
				<Col md={10}>
					<LinearProgress mode="determinate" max={1} mind={0} value={parseFloat(data.value)} style={{ height: 15 }} />
				</Col>
				<Col md={2}>
					<span style={{ position: 'relative', right: 20 }}>{Math.round(parseFloat(data.value) * 100)}</span>
				</Col>
			</Row>
		);
	},
	formatIcon: function (cell, row) {
		return (
			<Avatar size={25} src={'/images' + cell} />
		);
	},
	sourceFormatter: function (data) {
		return (
			<Avatar size={35} src={'/images' + data.value} />
		);
	},
	formatValue: function (cell, row) {
		cell = parseFloat(cell);
		if (cell < 0) {
			return (
				<span>{numberFormat(cell, 2)}</span>
			);
		}
		return (
			<span>{numberFormat(cell, 0)}</span>
		);
	},
	valueFormatter: function (data) {
		var value = parseFloat(data.value);
		var decimal = 0;
		if (value <= 1) {
			value = value * 100;
			decimal = 2;
		}
		return (
			<span>{numberFormat(value, decimal)}</span>
		);
	},
	handleGridSort: function (sortColumn, sortDirection) {
		var comparer = function (a, b) {
			if (sortDirection === 'ASC') {
				return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
			} else if (sortDirection === 'DESC') {
				return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
			}
		}
		var rows = sortDirection === 'NONE' ? this.state.originalRows.slice(0) : this.state.rows.sort(comparer);
		this.setState({ rows: rows });
	},
	formatMetric: function (cell, row) {
		return (
			<span>{titleize(cell.split("_").join(" "))}</span>
		);
	},
	metricFormatter: function (data) {
		return (
			<span className="text-fix dark">{data.value.split("_").join(" ")}</span>
		);
	},
	sourceNameFormatter: function (data) {
		return (
			<span className="text-fix dark">{data.value}</span>
		);
	},
	downloadCSV: function () {
		this.refs.propertyTable.handleExportCSV();
	},
	handleSearchChange: function (event) {
		this.refs.propertyTable.handleSearch(event.target.value);
	},
	renderPropertyData: function (property) {
		var columns = [
			{
				key: 'icon',
				name: '',
				formatter: this.sourceFormatter,
				width: 55
			},
			{
				key: 'source',
				name: 'Source',
				//filterable: true,
				sortable: true,
				formatter: this.sourceNameFormatter,
				width: 100
			},
			{
				key: 'metric',
				name: 'Metric',
				//filterable: true,
				sortable: true,
				formatter: this.metricFormatter,
				width: 150
			},
			{
				key: 'value',
				name: 'Value',
				sortable: true,
				width: 100,
				formatter: this.valueFormatter
			},
			{
				key: 'rank',
				name: 'Raking',
				sortable: true,
				formatter: this.rankFormatter
			}
		];
		return (
			<DashboardContainer
				cols={8}
				title="Property Data"
				subtitle=""
				avatar={<TableIcon style={{ color: Colors.MAIN }} size={20} />}
				text=""
				>
				<div>
					<Row>
						<Col md={4} style={{ marginLeft: 20 }}>
							<TextField hintText="Search" onChange={this.handleSearchChange}></TextField>
						</Col>
						<Col md={1} mdPush={6}>
							<IconButton style={{ color: Colors.MAIN }} onTouchTap={this.downloadCSV}><DownloadIcon style={{ color: Colors.MAIN }} size={20} /></IconButton>
						</Col>
					</Row>
					<BootstrapTable
						data={this.state.rows}
						ref="propertyTable"
						height="442"
						>
						<TableHeaderColumn
							dataField="id"
							isKey={true}
							hidden={true}
							>ID
						</TableHeaderColumn>
						<TableHeaderColumn
							dataField="icon"
							width="50"
							dataFormat={this.formatIcon}
							/>
						<TableHeaderColumn
							dataField="source"
							dataSort={true}
							width="100"
							>Source
						</TableHeaderColumn>
						<TableHeaderColumn
							dataField="metric"
							dataSort={true}
							width="200"
							dataFormat={this.formatMetric}
							>Metric
						</TableHeaderColumn>
						<TableHeaderColumn
							dataField="value"
							width="90"
							dataSort={true}
							dataFormat={this.formatValue}
							>Metric
						</TableHeaderColumn>
						<TableHeaderColumn
							dataField="rank"
							dataSort={true}
							dataFormat={this.formatRank}
							>Ranking
						</TableHeaderColumn>
					</BootstrapTable>
				</div>
			</DashboardContainer>
		);
	},
	/*
						<ReactDataGrid
						columns={columns}
						style={{ fontSize: 12 }}
						rowGetter={this.rowGetter}
						rowsCount={this.state.rows.length}
						onGridSort={this.handleGridSort}
						onAddFilter={this.handleFilterChange}
						onClearFilters={this.onClearFilters}
						minHeight={500}
						/>
	*/
	renderContractStatus: function () {

		<DashboardContainer
			cols={4}
			title="Contract Status"
			>
			<div style={{ paddingTop: 10, paddingBottom: 20 }}>
				<Row style={{ paddingTop: 10, paddingBottom: 8 }}>
					<Col md={12}>
						<span className="text-fix small dark pad"><strong>Renewal:&nbsp;&nbsp;&nbsp;</strong>{this.state.property.pretty_renewal}</span>
					</Col>
				</Row>
				<Row style={{ paddingTop: 10, paddingBottom: 8 }}>
					<Col md={12}>
						<span className="text-fix small dark pad"><strong>Cost:&nbsp;&nbsp;&nbsp;</strong>{this.state.property.pretty_cost}</span>
					</Col>
				</Row>
				<Row style={{ paddingTop: 10, paddingBottom: 8 }}>
					<Col md={12}>
						<span className="text-fix small dark pad"><strong>Term:&nbsp;&nbsp;&nbsp;</strong>{this.state.property.pretty_term}</span>
					</Col>
				</Row>
			</div>
		</DashboardContainer>
	},
	renderPropertyBackground: function () {
		var wrap = {
			display: 'flex',
			flexWrap: 'wrap',
			paddingBottom: 18
		}
		var chipStyle = {
			margin: 4,
			marginLeft: 6,
			marginRigth: 6,
			color: 'white'
		}
		return (
			<div style={{ height: "100%" }}>
				<DashboardContainer
					cols={8}
					title="Overview"
					avatar={<UserIcon style={{ color: Colors.MAIN }} size={20} />}
					>
					<div>
						<CardText style={{ fontSize: 18 }}>
							{this.state.property.description}
						</CardText>
						<Divider />
						<Row style={{ marginTop: 10, paddingTop: 20, paddingBottom: 20, textAlign: 'center' }}>
							<Col md={4}>
								<span className="text-fix small dark pad"><strong>Renewal:&nbsp;&nbsp;&nbsp;</strong>{this.state.property.pretty_renewal}</span>
							</Col>
							<Col md={4}>
								<span className="text-fix small dark pad"><strong>Contract:&nbsp;&nbsp;&nbsp;</strong>{this.state.property.pretty_term}</span>
							</Col>
							<Col md={4}>
								<span className="text-fix small dark pad"><strong>Total Cost:&nbsp;&nbsp;&nbsp;</strong>{this.state.property.pretty_cost}</span>
							</Col>
						</Row>
						<Row style={{ paddingTop: 8, paddingBottom: 0 }}>
							<Col md={10}>
								<div style={wrap}>
									<Chip style={chipStyle}
										labelColor="white"
										backgroundColor={Colors.LIME_GREEN}
										>
										{this.state.property.scope}
									</Chip>
									<Chip style={chipStyle}
										labelColor="white"
										backgroundColor={Colors.LIGHT_PURPLE}
										>
										{this.state.property.category}
									</Chip>
									<Chip style={chipStyle}
										labelColor="white"
										backgroundColor={Colors.LIGHT_YELLOW_GREEN}
										>

										{this.state.property.subcategory}
									</Chip>
									<Chip style={chipStyle}
										labelColor="white"
										backgroundColor="#c0deed"
										onTouchTap={() => window.location = "https://www.twitter.com/" + this.state.property.twitter_handle}
										>
										<Avatar backgroundColor="white" src={'/images/metrics/twitter.png'} />
										{'@' + this.state.property.twitter_handle}
									</Chip>
									<Chip
										backgroundColor="#8b9dc3"
										labelColor="white"
										onTouchTap={() => window.location = this.state.property.facebook_page}
										style={chipStyle}>
										<Avatar backgroundColor="white" src={'/images/metrics/facebook.png'} />
										{this.state.property.name}
									</Chip>
								</div>
							</Col>
						</Row>
					</div>
				</DashboardContainer>
				<DashboardContainer
					cols={4}
					title="Scores"
					avatar={<RadarIcon style={{ color: Colors.MAIN }} size={20} />}
					pad={true}
					>
					<ReactEcharts
						option={this.getRadar(this.state.property)}
						theme="theme"
						/>
				</DashboardContainer>

			</div>

		);
	},
	/*
	<Col md={3}>
	Twitter:
	<a href={"http://www.twitter.com/" + this.state.property.twitter_handle}>
	<TwitterIcon size={25} />
	@{this.state.property.twitter_handle}
	</a>
	</Col>
	<Col md={3}>
	Facebook:
	<a href={this.state.property.facebook_page}>
	<FacebookIcon size={25} />
	{this.state.property.name}
	</a>
	</Col>
	*/
	renderTwitterFeed: function () {
		if (this.state.property == null) return null;

		return (
			<DashboardContainer
				cols={4}
				title="Twitter Feed"
				avatar={<TwitterIcon style={{ color: Colors.MAIN }} size={20} />}
				>
				<LiveTwitter height={500} tweets={this.state.tweets} handle={this.state.property.twitter_handle} />
			</DashboardContainer>
		);
	},
	renderScores: function () {
		if (!this.getFlux().store("DocumentStore").metricsLoaded()) return null;
		var collection = this.getFlux().store("DocumentStore").getMetricsCollection();
		var results = collection.findOne({
			'$and': [{
				entity_key: this.state.property.entity_key
			}, {
				metric: 'team_score'
			}]
		});
		return (
			<div>
				<Row>
					<Col md={6}>
					</Col>
					<Col md={4}>
						<div style={{ textAlign: 'center', margin: 0, padding: 0 }} className="text-fix light xlarge">{Math.round(results.value * 100, 0)}</div>
						<div style={{ textAlign: 'center', margin: 0, padding: 0 }} className="text-fix light medium">Team Score</div>
					</Col>
					<Col md={2}>
					</Col>
				</Row>
			</div>
		);
	},
	createHistoricalDropdown: function () {
		return (
			<DropDownMenu value={this.state.historical} onChange={this.handleHistoricalChange} style={{ textTransform: 'capitalize' }}>
				{this.state.historicals.map(function (h, i) {
					return (
						<MenuItem key={i} value={i} style={{ textTransform: 'capitalize' }} primaryText={this.state.historicals[i]} />
					);
				}.bind(this))}
			</DropDownMenu>
		);
	},
	renderPropertyContent: function () {
		var height = 180;
		var margin = 20;
		return (
			<Grid fluid={true}>
				<Row style={{ marginBottom: margin }}></Row>
				<Row style={{ height: '100%' }}>
					{this.renderPropertyBackground()}
				</Row>
				<Row style={{ marginBottom: margin }}></Row>
				<Row style={{ height: height }}>

					<DashboardContainer
						cols={4}
						title={"Social Reach"}
						avatar={<PieChart style={{ color: Colors.MAIN }} size={20} />}
						pad={true}
						>
						<ReactEcharts
							option={this.getPie(this.state.property)}
							theme="theme"
							/>
					</DashboardContainer>

					<DashboardContainer
						cols={8}
						title="Historical Data"
						subtitle=""
						text=""
						avatar={<LineChart style={{ color: Colors.MAIN }} size={20} />}
						pad={true}
						rightMenu={this.createHistoricalDropdown()}
						>

						<ReactEcharts
							option={this.getOptions()}
							notMerge={true}
							lazyUpdate={true}
							theme="theme"
							/>
					</DashboardContainer>
				</Row>
				<Row style={{ marginBottom: margin }}></Row>
				<Row>
					{this.renderPropertyData()}
					{this.renderTwitterFeed()}
				</Row>
				<Row style={{ marginBottom: margin }}></Row>

			</Grid>
		);
	},
	render: function () {
		if (this.state.property == null) {
			return (
				<Row style={{ marginTop: "25%" }}>
					<Col md={5}></Col>
					<Col md={2}>
						<CircularProgress size={3} />
					</Col>
					<Col md={5}></Col>
				</Row>
			);
		}

		echarts.registerTheme('theme', theme);
		var property = this.getFlux().store("AssetsStore").getAsset(this.props.params.id);
		return (
			<div>
				<Card>
					<CardMedia
						overlay={
							<div style={{ height: 90 }}>
								<Row style={{ margin: 0, height: 75, padding: 0 }}>
									<Col md={2}>
										<Avatar size={175} className="profileAvatar" src={property.image_url} />
									</Col>
									<Col md={4} style={{ marginTop: 33, marginLeft: 30, padding: 0 }}>
										<div className="text-fix large">{property.name}</div>
										<div className="text-fix medium">{property.subcategory}</div>
									</Col>
									<Col md={5}>
										{this.renderScores()}
									</Col>
								</Row>
							</div>
						}
						>
						<img className="cover-photo" style={{ height: 300 }} src={'/images/login/login-bw.jpg'} />
					</CardMedia>
				</Card>
				{this.renderPropertyContent()}
			</div>
		);
	}

});

module.exports = PropertyDashboard;
