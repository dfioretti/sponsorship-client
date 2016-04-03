var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Link = require('react-router').Link,
		Immutable = require('immutable'),
		uuid = require('node-uuid'),
		MultiThemeProvider = require('material-ui').MultiThemeProvider,
		cyan500 = require('material-ui').cyan500,
		getMultiTheme = require('material-ui').getMultiTheme,
		DashboardMixin = require('../mixins/dashboard_mixin.jsx'),
		Immutable = require('immutable'),
		DynamicComponent = require('../common/DynamicComponent.jsx'),
		PortfolioMap = require('./modules/PortfolioMap.jsx'),
		PortfolioTreemap = require('./modules/PortfolioTreemap.jsx'),
		ScoreTrend = require('./modules/ScoreTrend.jsx'),
		PortfolioSummary = require('./modules/PortfolioSummary.jsx'),
		AppSidebar = require('../sidebar/app_sidebar.jsx'),
		AssetOverview = require('../assets/AssetOverview.jsx'),
		AssetScore = require('./modules/AssetScore.jsx'),
		Notes = require('./modules/Notes.jsx'),
		SocialStats = require('../assets/SocialStats.jsx'),
		ConsumerSurvey = require('../assets/ConsumerSurvey.jsx'),
		TallTabbedModule = require('../common/TallTabbedModule.jsx'),
		TwitterFeed = require('../common/TwitterFeed.jsx'),
		StoreWatchMixin = Fluxxor.StoreWatchMixin;

var PortfolioDashboard = React.createClass({
  mixins: [
    FluxMixin,
		StoreWatchMixin("DashboardHomeStore"),
		StoreWatchMixin("ComponentsStore"),
		StoreWatchMixin("AssetsStore")
  ],
	componentWillMount: function() {
		this.ensureLoaded();
	},
	ensureLoaded: function() {
		if (!this.getFlux().store("DashboardHomeStore").getState().dashboardsLoaded
				&& !this.getFlux().store("DashboardHomeStore").getState().loading) {
			this.getFlux().actions.loadDashboards();
		}
		if (!this.getFlux().store("ComponentsStore").getState().componentsLoaded
					&& !this.getFlux().store("ComponentsStore").getState().loading) {
			this.getFlux().actions.loadComponents();
		}
	},
	componentDidMount: function() {
		if (this.props.params.id) {
			this.getFlux().actions.setBreadcrumb(this.getFlux().store("AssetsStore").getAsset(this.props.params.id));
			this.getFlux().actions.setCurrentNav("asset", this.props.params.id);
			this.setState({assetId: parseInt(this.props.params.id)});
		} else {
			this.getFlux().actions.setBreadcrumb("My Portfolio");
			this.getFlux().actions.setCurrentNav("portfolio", null);
		}
		if (!this.getFlux().store("ComponentsStore").getState().componentsLoaded) {
			this.getFlux().actions.loadComponents();
		}
		this.setupGrid();
	},
	componentDidUpdate: function() {
			if (this.props.params.id) {
				this.setState({assetId: parseInt(this.props.params.id)});
			}
	},
	getInitialState: function() {
		return Immutable.Map( { assetId: null } );
	},
	isDashboardLoaded: function () {
		return this.getFlux().store("DashboardHomeStore").getState().dashboardsLoaded;
	},
	areAssetsLoaded: function() {
		return this.getFlux().store("AssetsStore").getState().assetsLoaded;
	},
	setupGrid: function() {
    $('.modules-container').shapeshift({
      selector: ".dashboard-module",
      handle: ".drag-handle",
      align: "left",
      minColumns: 2,
      autoHeight: false,
      gutterX: 20,
      gutterY: 20,
      paddingX: 20,
      paddingY: 20
    });
	},
  getComponentFromFlux: function(cid) {
    return flux.store("ComponentsStore").getComponent(cid);
  },
	// weirdness with multi store watch
	getStateFromFlux: function() {
		return {};
	},
	getDashboardFromFlux: function() {
		if (this.props.params.id) {
			return this.getFlux().store("DashboardHomeStore").getAssetDashboard();
		} else {
			return this.getFlux().store("DashboardHomeStore").getPortoflioDashboard();
		}
	},
	componentWillReceiveProps: function(newProps) {
		if (this.isDashboardLoaded())
    	this.setupGrid();
  },
  componentWillUpdate: function() {
		if (this.isDashboardLoaded())
    	this.setupGrid();
  },
  componentDidUpdate: function() {
		if (this.isDashboardLoaded())
    	this.setupGrid();
  },
	areComponentsLoaded: function() {
		return this.getFlux().store("ComponentsStore").getState().componentsLoaded;
	},
	mapModule: function(name, state) {
    var el, hidden;
    hidden = false;
		el = null;
    if (name.indexOf('custom_component') > -1) {
      var component = this.getComponentFromFlux(parseInt(name.split("_").pop(-1)));
      if (typeof(component) == 'undefined') return;
      el = <DynamicComponent key={component.id} component={component} />
    }
    else {
      switch (name) {
				case 'asset_score':
					var asset = this.getFlux().store("AssetsStore").getAsset(this.props.params.id);
					var score = null;
					asset.metrics.forEach(function(metric) {
						if (metric.metric === 'passion_score') {
							score = metric;
						}
					});
					el = <AssetScore score={score} asset={asset} />
					break;
        case 'portfolio_map':
        	el = <PortfolioMap hidden={hidden} key={uuid.v4()} />
          break;
        case 'portfolio_summary':
          el = <PortfolioSummary hidden={hidden} key={uuid.v4()} />
          break;
        case 'score_trend':
          //el = <ScoreTrend hidden={hidden} key={name}  title="Top 5 Passion Scores"  />
          break;
        case 'portfolio_tree_map':
          el = <PortfolioTreemap hidden={hidden} key={uuid.v4()} />
          break;
				case 'social_stats':
					el = <SocialStats key={uuid.v4()} hidden={hidden} asset={this.getFlux().store("AssetsStore").getAsset(this.props.params.id)} />
					break;
				case 'asset_score':
					el = <AssetScore key={uuid.v4()} hidden={hidden} />
					break;
				case 'asset_overview':
					el = <AssetOverview key={uuid.v4()} asset={this.getFlux().store("AssetsStore").getAsset(this.props.params.id) } />
					break;
				case 'consumer_survey':
					//el = <TallTabbedModule key={uuid.v4()} asset={this.getFlux().store("AssetsStore").getAsset(this.props.params.id) }/>
					el = <ConsumerSurvey key={uuid.v4()} asset={this.getFlux().store("AssetsStore").getAsset(this.props.params.id) } />
					break;
				case 'twitter_feed':
					el = <TwitterFeed key={uuid.v4()} screen_name={this.getFlux().store("AssetsStore").getAsset(this.props.params.id).twitter_handle } />
					break;
				case 'notes':
					el = <Notes key={uuid.v4()} />
					break;
				case 'asset_data':
					el = <TallTabbedModule key={uuid.v4()} asset={this.getFlux().store("AssetsStore").getAsset(this.props.params.id) }/>
					break;
        }
    }
    return el;
  },
  renderModules: function(dashboardState) {
    var modules = $.map(dashboardState, function(v, k){
      return this.mapModule(k, v.toggle);
    }.bind(this));

    return (
      <div className="modules-container">
        {modules}
      </div>
    );
  },
	render: function() {
		if (!this.isDashboardLoaded() || !this.areComponentsLoaded() || !this.areAssetsLoaded() ) {
			return (
				<div className="dashboard">
				</div>
			);
		} else {
			return (
				<div className="dashboard">
					<div className="modules-box">
						{this.renderModules(this.getDashboardFromFlux().state)}
					</div>
				</div>
			);
		}
	}
});
module.exports = PortfolioDashboard;
