var React = require('react');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Link = require('react-router').Link;
var Auth = require('../../vendor/jtoker.js');
var PubSub = require('pubsub-js');
var FilterableDataList = require('../common/FilterableDataList.jsx');
require('../../vendor/fastLiveFilter.js');

const PermissionLinkMap = {
  admin: 'users',
  fifa: 'fifa_dashboard',
  ews: 'choose_company'
}

var Nav = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("AssetsStore")],

  getStateFromFlux: function() {
		return this.getFlux().store("AssetsStore").getState();
	},
	componentWillMount: function() {
		if (!this.getStateFromFlux().assetsLoaded && !this.getStateFromFlux().loading) {
			this.getFlux().actions.loadAssets();
		}
  	var st = PubSub.subscribe('auth.validation.success', function(ev, user) {
      this.setState({name: user.name, image: user.image, permissions: user.permissions});
    }.bind(this));
    var rt = PubSub.subscribe('auth.emailRegistration.success', function(ev, user) {
      var user = user.data;
      this.setState({name: user.name, image: user.image, permissions: user.permissions});
    }.bind(this));
    var ut = PubSub.subscribe('auth.signOut.success', function(ev, user) {
      this.setState({name: null, image: null});
    }.bind(this));
    this.setState({st: st, ut: ut, rt: rt});
	},
	componentWillUnmount: function() {
		PubSub.unsubscribe(this.state.st);
		PubSub.unsubscribe(this.state.ut);
		PubSub.unsubscribe(this.state.rt);
	},
	signOut: function() {
		Auth.signOut();
	},
	renderLogo: function() {
		var logo;
    if (typeof(this.state.name) !== 'undefined' && this.state.name !== null) {
      logo = <div className="nav navbar-nav navbar-left nav-brand"><Link to="/">Teneo</Link></div>
    } else {
      logo = <div className="nav navbar-nav navbar-left nav-brand"><Link to="account_login">Teneo</Link></div>
    }
    return logo;
	},
	renderMenu: function() {
		var menu;
		if (typeof(this.state.name) !== 'undefined' && this.state.name !== null) {
			if (this.state.permissions) {
				var access = $.map(this.state.permissions, function(p, i) {
					var link = PermissionLinkMap[p]
					return (
						<li key={i}><Link to={link}>{p.slice(0,1).toUpperCase() + p.substring(1)}</Link></li>
					);
				});
			}
			menu = (
				<li>
					<a href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						<div className="nav-user-image">
							<span className="user-icon"></span>
						</div>
						<div className="nav-user-name">
							{this.state.name}
						</div>
					</a>
					<ul className="dropdown-menu" aria-labelledby="user-dropdown">
						{access}
						<li role="separator" className="divider"></li>
						<li><a onClick={this.signOut}>Sign out</a></li>
					</ul>
				</li>
			)
		} else {
			menu = (
				<li>
					<div className="nav-user-image">
						<span className="user-icon"></span>
					</div>
					<div className="nav-user-name">
						{this.state.name}
					</div>
				</li>
			)
		}
		return menu;
	},
  getAsssetList: function() {
    if (this.state.filteredList === null) return [];
    var list = [];
    this.state.filteredList.map(function(item) {
      var image = "/images/images/" + item.id + ".jpg";
      var link = '/apt/asset/dashboard/'+ item.id;
      var imgStyle = {
        height: "50px",
        width: "50px",
        borderRadius: "50px"
      }
      list.push(
        <div key={item.id} className="asset-nav-list">
          <Link className="asset-link" to={link}>
            <ul>
              <li className="thumb">
                <img style={imgStyle} src={image} />
              </li>
              <li className="asset-name">
                {item.name}
              </li>
            </ul>
          </Link>
        </div>
      );
    }.bind(this));
    return list;
  },
  handleAssetSearch: function(e) {
    if (this.state.filteredList === null) return;
    var filterText = e.target.value;
    var filteredList = [];
    this.state.assets.forEach(function(asset) {
      if (asset.name.toLowerCase().indexOf(filterText) === -1) {
        return;
      } else {
        filteredList.push(asset);
      }
    });
    this.setState({filteredList: filteredList});
  },
  renderSearchList: function() {
    var list = this.getAsssetList();
    return (
      <div>
        <a href="#" className='company-select' data-toggle="dropdown" role='button' aria-haspopup='true' aria-expanded='false'>
          Go to Asset
        </a>
        <div className="dropdown-menu">
          <div className="dropdown-searchbar">
            <input id="search_input" type="text" onChange={this.handleAssetSearch} placeholder="Search for Assets" />
          </div>
          <div className="company-list">
            <ul>
              {list}
            </ul>
          </div>
        </div>
      </div>
    );
  },
	render: function() {
		return (
			<nav id="navbar" className="nav navbar-default navbar-fixed-top">
        <div className="nav-center">{this.renderSearchList()}</div>
        <div className="navbar-collapse collapse">
					{this.renderLogo()}
          <ul className="nav navbar-nav navbar-right nav-user">
					{this.renderMenu()}
          </ul>
        </div>
      </nav>
		);
	}
});

module.exports = Nav;
