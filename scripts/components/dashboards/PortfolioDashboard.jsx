var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		API_ROOT = require("../../constants/environment.js").API_ROOT,
		Link = require('react-router').Link,
		uuid = require('node-uuid'),
		DynamicComponent = require('../common/DynamicComponent.jsx'),
		PortfolioMap = require('./modules/PortfolioMap.jsx'),
		PortfolioTreemap = require('./modules/PortfolioTreemap.jsx'),
		ScoreTrend = require('./modules/ScoreTrend.jsx'),
		PortfolioSummary = require('./modules/PortfolioSummary.jsx'),
		AssetOverview = require('../assets/AssetOverview.jsx'),
		AssetScore = require('./modules/AssetScore.jsx'),
		Valuation = require('./modules/Valuation.jsx'),
		Notes = require('./modules/Notes.jsx'),
		SocialStats = require('../assets/SocialStats.jsx'),
		ConsumerSurvey = require('../assets/ConsumerSurvey.jsx'),
		TallTabbedModule = require('../common/TallTabbedModule.jsx'),
		TwitterFeed = require('../common/TwitterFeed.jsx'),
		AssetClient = require('../../clients/asset_client.js'),
		CircularProgress = require('material-ui').CircularProgress,
		RefreshIndicator = require('material-ui').RefreshIndicator,
		Spinner = require('react-spinkit'),
		StoreWatchMixin = Fluxxor.StoreWatchMixin;

var PortfolioDashboard = React.createClass({
  mixins: [
    FluxMixin,
		StoreWatchMixin("EntityDashboardStore"),
  ],
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
  componentWillMount: function() {
		if (!this.getFlux().store("ComponentsStore").getState().componentsLoaded
				&& !this.getFlux().store("ComponentsStore").getState().loading) {
					this.getFlux().actions.loadComponents();
		}

		if (this.props.params.id) {
			this.getFlux().actions.setEntityDashboardMode('asset');
			this.getFlux().actions.loadDashboard('asset');
			this.getFlux().actions.loadAsset(this.props.params.id);
		} else {
			this.getFlux().actions.setEntityDashboardMode('portfolio');
			this.getFlux().actions.loadDashboard('portfolio');
			this.getFlux().actions.setCurrentNav('portfolio', null);
			this.getFlux().actions.setBreadcrumb('My Portfolio');
		}
	},
	componentDidMount: function() {
		this.setupGrid();
	},
	componentDidUpdate: function() {
		this.setupGrid();
	},
	componentWillReceiveProps: function(newProps) {
		if (newProps.params.id) {
			if (this.state.mode != 'asset') {
				this.getFlux().actions.setEntityDashboardMode('asset');
				this.getFlux().actions.loadDashboard('asset');
			}
			if (this.state.asset == null || this.state.asset.id != newProps.params.id)
				this.getFlux().actions.loadAsset(newProps.params.id);
		} else {
			if (this.state.mode != 'portfolio') {
				this.getFlux().actions.setEntityDashboardMode('portfolio');
				this.getFlux().actions.loadDashboard('portfolio');
			}
		}
	},
	getStateFromFlux: function() {
		return this.getFlux().store("EntityDashboardStore").getState();
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
			var asset = this.state.asset;
      switch (name) {
				case 'asset_score':
					var score = null;
					if (asset != null) {
						asset.metrics.forEach(function(metric) {
							if (metric.metric === 'passion_score') {
								score = metric;
							}
						});
					}
					el = <AssetScore key={uuid.v4()} score={score} asset={asset} />
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
          //el = <PortfolioTreemap hidden={hidden} key={uuid.v4()} />
          break;
				case 'social_stats':
					el = <SocialStats key={uuid.v4()} hidden={hidden} asset={asset} />
					break;
				case 'asset_overview':
					el = <AssetOverview key={uuid.v4()} asset={asset} />
					break;
				case 'consumer_survey':
					//el = <TallTabbedModule key={uuid.v4()} asset={this.getFlux().store("AssetsStore").getAsset(this.props.params.id) }/>
					//	el = <ConsumerSurvey key={uuid.v4()} consumerSurvey={this.state.consumerSurvey} asset={asset} />
					break;
				case 'twitter_feed':
					el = <TwitterFeed key={uuid.v4()} tweets={this.state.tweets} />
					break;
				case 'notes':
					el = <Notes key={uuid.v4()} />
					break;
				case 'asset_data':
					el = <TallTabbedModule key={uuid.v4()} asset={asset} />
					break;
        }
    }
    return el;
  },
	getComponentFromFlux: function(cid) {
		return this.getFlux().store("ComponentsStore").getComponent(cid);
	},
  renderModules: function(dashboardState) {
		if (this.state.mode == 'asset') {
			var asset = this.state.asset;
			var score = null;
			var perfScore = null;
			if (asset != null) {
				asset.metrics.forEach(function(metric) {
					if (metric.metric === 'passion_score') {
						score = metric;
					}
					if (metric.metric === 'performance_score') {
						perfScore = metric;
					}
				});
			}
			if (this.state.asset == null || this.state.tweets == null) {
				return (
					<div className=''>
						<div style={{marginTop: "20%", display: 'flex', justifyContent: 'center'}}>
							<Spinner style={{height: 200, width: 200}} overrideSpinnerClassName={'loader'} spinnerName='circle' noFadeIn />
						</div>
					</div>
				);
			}
			return (
				<div className="modules-container">
					<AssetOverview key={uuid.v4()} asset={asset} />
					<AssetScore key={uuid.v4()} title="Passion Score" score={score} asset={asset} />
					<AssetScore key={uuid.v4()} title="Performance Score" score={perfScore} asset={{}} />
					<TallTabbedModule title={"Asset Data"} bar={false} key={uuid.v4()} asset={asset} />
					<TallTabbedModule title={"Data Ranking"} bar={true} key={uuid.v4()} asset={asset} />
					<TwitterFeed key={uuid.v4()} tweets={this.state.tweets} />
					<Valuation key={uuid.v4()} title={"Forbes Valuation"} asset={asset} />
				</div>
			)
		}
		var score = null;
		var perfScore = null;
		if (this.state.dashboard != null) {
			this.state.dashboard.metrics.forEach(function(metric) {
				if (metric.metric === 'portfolio_passion_score') {
					score = metric;
				}
				if (metric.metric === 'portfolio_performance_score') {
					perfScore = metric;
				}
			});
		}
		var extras = [];
		var el = null;
		$.map(dashboardState, (function(value, key) {
			if (key.indexOf('custom_component') > -1) {
				var component = this.getComponentFromFlux(parseInt(key.split("_").pop(-1)));
				extras.push(<DynamicComponent key={component.id} component={component} />)
			}
		}.bind(this)));
		/*
		if (dashboardState.map(function(name.indexOf('custom_component') > -1) {
			var component = this.getComponentFromFlux(parseInt(name.split("_").pop(-1)));
			if (typeof(component) == 'undefined') return;
			extras.push(<DynamicComponent key={component.id} component={component} />)
		}
		*/
		return (
			<div className="modules-container">
				<PortfolioMap />
				<AssetScore key={uuid.v4()} title="Portfolio Passion Score" score={score} asset={{}} />
				<AssetScore key={uuid.v4()} title="Portfolio Performance Score" score={perfScore} asset={{}} />
				<Notes dashboard={this.state.dashboard} key={uuid.v4()} />
				<PortfolioSummary />
				{extras}
			</div>
		)
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
		if (this.state.dashboard == null) return null;
		return (
			<div className="dashboard">
				<div className="modules-box">
					{this.renderModules(this.state.dashboard.state)}
				</div>
			</div>
		);
	}
});
module.exports = PortfolioDashboard;
