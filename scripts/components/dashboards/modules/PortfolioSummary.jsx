/*
 * TODO: jScrollPane is being a dick, so haven't figured out how to include that yet
 */

var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		StoreWatchMixin = Fluxxor.StoreWatchMixin;
		GenericValueListItem = require('../../common/charts/GenericValueListItem.jsx');
var jScrollPane = require('jscrollpane');
var PortfolioSummary = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("AssetsStore")],
  getInitialState: function() {
    return {dataLoaded: false, scrollLoaded: false, orderBy: {field: "renewal", order: 1}, ownedAssets: []};
  },
  componentWillMount: function() {
		if (this.getStateFromFlux().assetsLoaded)
    	this.setOwnedAssets();
		if (!this.state.scrollLoaded && this.state.dataLoaded) {
		//	this.setState({scrollLoaded: true});...
		//	$('.risk-indicator-list-container').jScrollPane();
		}
  },
	componentDidUpdate: function() {
		//$('#port-scroll').jScrollPane();
		//$('.risk-indicator-list-continexr').jScrollPane();
		if (this.getStateFromFlux().assetsLoaded) {
			this.setOwnedAssets();
		}
		if (!this.state.scrollLoaded && this.state.dataLoaded) {
		//	this.setState({scrollLoaded: true});
		//	$('.risk-indicator-list-container').jScrollPane();
		}
	},
	getStateFromFlux: function() {
		return this.getFlux().store("AssetsStore").getState();
	},
  componentDidMount: function() {
    //if (!this.state.scrollLoaded && this.state.dataLoaded) {
    //  this.setState({scrollLoaded: true});
  //  	$('.risk-indicator-list-container').jScrollPane();
  //  }
  },
  setOwnedAssets: function() {
	//	var allAssets = this.getStateFromFlux().assets;
  //  var allAssets = AssetsStore.getState().assets;
  //  var ownedAssets = [];
  //  $.each(allAssets, function(i, a) {
  //    if (a.owned == true) {
  //      ownedAssets.push(a);
  //    }
  //  });
  //  this.setState({ownedAssets: ownedAssets, dataLoaded: true});
  },
  order: function(value, e) {
    $('#risk_indicators .filter').removeClass('asc');
    switch (value) {
      case 0:
        var order = 1;
        if (this.state.orderBy.field == "renewal" && this.state.orderBy.order == 1) {
          $(e.target).closest('.filter').addClass('asc');
          order = 0;
        }
        this.setState({orderBy: {field: "renewal", order: order}});
        break;
      case 1:
        var order = 1;
        if (this.state.orderBy.field == "name" && this.state.orderBy.order == 1) {
          $(e.target).closest('.filter').addClass('asc');
          order = 0;
        }
        this.setState({orderBy: {field: "name", order: order}});
        break;
    }
  },
	getOwnedAssets: function() {
		return this.getFlux().store("AssetsStore").getOwnedAssets();
	},
  renderList: function() {
    var listAssets = this.getOwnedAssets();
    if (this.state.orderBy) {
      listAssets.sort(function(i1, i2){
        var order;
        var field1 = i1[this.state.orderBy.field];
        var field2 = i2[this.state.orderBy.field];
        if (this.state.orderBy.order == 0) {
          order = field1.localeCompare(field2);
        } else {
          order = field2.localeCompare(field1);
        }
        return order;
      }.bind(this));
    }
    var list = $.map(listAssets, function(asset, i) {
      var imageLink = "/images/" + asset.id + ".jpg";
      var assetLink = "/apt/asset/dashboard/" + asset.id;
      var styleOverride = {
        height: "70px",
        paddingTop: "20px"
      };
      return <GenericValueListItem key={i} reAnimate={false} link={assetLink} statImage={imageLink} value={asset.id} statHeader={asset.name} styleOverride={styleOverride} statMetric={asset.renewal} />
    }.bind(this));
    return (
      <div id="port-scroll" className="risk-indicator-list-container">
        <ul className="probability-list risk-indicator-list">
          {list}
        </ul>
      </div>
    );
  },
  render: function() {
    var hiddenStyle = this.props.hidden ? {display: 'none'} : {};
    return (
      <div id="risk_indicators" className="dashboard-module tall" style={hiddenStyle}>
        <div className="top">
          <div className="drag-handle"></div>
          <div className="top-title">Portfolio Summary</div>
        </div>
        <div className="main">
          <div className="filters">
            <div className="filter value-filter" onClick={this.order.bind(this, 0)}>Sort By Renewal Date<span className="caret"></span></div>
            <div className="filter severity-filter" onClick={this.order.bind(this, 1)}>Sort by Name<span className="caret"></span></div>

          </div>
          {this.renderList()}
        </div>
      </div>
    );
  }
});
module.exports = PortfolioSummary;
