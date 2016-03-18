var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Link = require('react-router').Link,
		Immutable = require('immutable'),
		DashboardMixin = require('../mixins/dashboard_mixin.jsx'),
		Immutable = require('immutable'),
		DynamicComponent = require('../common/DynamicComponent.jsx'),
		PortfolioMap = require('./modules/PortfolioMap.jsx'),
		PortfolioTreemap = require('./modules/PortfolioTreemap.jsx'),
		ScoreTrend = require('./modules/ScoreTrend.jsx'),
		PortfolioSummary = require('./modules/PortfolioSummary.jsx'),
		AppSidebar = require('../sidebar/app_sidebar.jsx'),
		AssetOverview = require('./AssetDashboard.jsx'),
		StoreWatchMixin = Fluxxor.StoreWatchMixin;



var AssetDashboard = React.createClass({
  mixins: [
    FluxMixin,
		StoreWatchMixin("DashboardHomeStore"),
		StoreWatchMixin("ComponentsStore")
  ],
	componentDidMount: function() {
		if (!this.getFlux().store("ComponentsStore").getState().componentsLoaded) {
			this.getFlux().actions.loadComponents();
		}
		if (!this.getFlux().store("AssetsStore").getState().assetsLoaded)
			this.getFlux().actions.loadAssets();
	},
	getInitialState: function() {
		return Immutable.Map();
	},
	isDashboardLoaded: function () {
		return this.getFlux().store("DashboardHomeStore").getState().dashboardLoaded;
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
		return this.getFlux().store("DashboardHomeStore").getAssetDashboard();
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
			console.log(name);

      switch (name) {
        case 'asset_overview':
        	//el = <AssetOverview asset={this.getFlux().store("AssetsStore").getAsset(467)} hidden={hidden} key={name} />
          break;
        case 'portfolio_summary':
          el = <PortfolioSummary hidden={hidden} key={name} />
          break;
        case 'score_trend':
          //el = <ScoreTrend hidden={hidden} key={name}  title="Top 5 Passion Scores"  />
          break;
        case 'portfolio_tree_map':
          el = <PortfolioTreemap hidden={hidden} key={name} />
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
		if (!this.isDashboardLoaded() || !this.areComponentsLoaded()) {
			return (
				<div className="dashboard">
					<AppSidebar context="dashboard" />
				</div>
			);
		} else {
			return (
				<div className="dashboard">
					<AppSidebar context="asset" />
					<div className="modules-box">
						{this.renderModules(this.getDashboardFromFlux().state)}
					</div>
				</div>
			);
		}
	}
});
module.exports = AssetDashboard;
