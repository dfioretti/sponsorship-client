var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		DashboardMixin = require('../../mixins/dashboard_mixin.jsx');

var AssetDashboard = React.createClass({
  mixins: [DashboardMixin, FluxMixin],
  getInitialState: function() {
    return {dashboardLoaded: false, assetLoaded: false};
  },
  componentWillMount: function() {
    this.props.setTitle('apt');

    if (AssetsStore.getState().ready) {
      this.setState({assetLoaded: true, assets: AssetsStore.getState().assets })
    }
    AssetsStore.setCurrent(this.props.params.id);

    NotesStore.setCompanyId(this.props.params.id);

    DashboardsStore.getAsset(this.props.params.id).then(function(){
      this.setState({dashboardState: DashboardsStore.getState().current, dashboardLoaded: true});

      if (this.state.dashboardLoaded && this.state.assetLoaded) {
        this.setupGrid();
      }
    }.bind(this));

    if (AssetsStore.getState().ready) {
      this.setState({assetLoaded: true});
    }

    AssetsStore.on("update", function() {
      AssetsStore.setCurrent(this.props.params.id);
      this.setState({assetLoaded: true});
      if (this.state.dashboardLoaded && this.state.assetLoaded) {
        this.setupGrid();
      }
    }.bind(this));
  },
  componentWillReceiveProps: function(newProps) {
    if (newProps.params.id !== this.props.params.id) {
      this.props.setTitle('apt');

      AssetsStore.setCurrent(newProps.params.id);

      NotesStore.setCompanyId(newProps.params.id);
      DashboardsStore.getAsset(newProps.params.id).then(function() {
        this.handleChange();
        $('.modules-container').trigger('ss-rearrange');
      }.bind(this));
    }
  },
  mapModule: function(name, state, componentId, componentType, componentTitle) {
    var el, hidden;
    if (state == "off")
      hidden = true;

    // TODO: Kill companies to fix notes
    var company = CompaniesStore.getState().current;
    var asset = AssetsStore.getState().current;

    if (name.indexOf('custom_component') > -1 ) {
      el = <CustomComponent hidden={hidden} componentType={componentType} componentTitle={componentTitle} componentId={componentId} />
    } else {
      switch (name) {
        case 'passion_score':
          el = <PassionScore hidden={hidden} />
          break;
        case 'asset_overview':
          el = <AssetOverview asset={asset} hidden={hidden} key={name}/>
          break;
        case 'notes':
          el = <Notes company={company} hidden={hidden} key={name}/>
          break;
        case 'social_stats':
          el = <SocialStats asset={asset} hidden={hidden} key={name}/>
          break;
        case 'consumer_survey':
          el = <ConsumerSurvey asset={asset} hiddine={hidden} key={name}/>
          break;
        case 'top_news':
          var start = new Date(2016, 1, 1);
          var end = new Date(2016, 1, 15);
          el = <News hidden={hidden} key={name} startDate={start} endDate={end} />
          break;
      }
    }
    return el
  },
  renderModules: function(dashboardState) {
    var modules = $.map(dashboardState, function(v, k){
      return this.mapModule(k, v.toggle, v.component_id, v.component_type, v.title);
    }.bind(this));

    return (
      <div className="modules-container">
        {modules}
      </div>
    );
  },
  render: function() {
    var dashboardState;
    if (this.state.dashboardLoaded && this.state.assetLoaded) {
      var dashboardState = this.state.dashboardState;
      return (
        <div className="dashboard">
          <AppSidebar context="dashboard" />
          <div className="modules-box">
            {this.renderModules(dashboardState.state)}
          </div>
        </div>
      );
    } else {
      return (
        <div className="dashboard"></div>
      );
    }
  }
});
module.exports = AssetDashboard;
