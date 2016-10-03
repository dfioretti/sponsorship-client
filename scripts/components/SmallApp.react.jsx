var React = require('react');
var RouteHandler = require('react-router').RouteHandler;
var Header = require('../components/Header.react.jsx');
var SessionStore = require('../stores/SessionStore.react.jsx');
var RouteStore = require('../stores/RouteStore.react.jsx');
var API_ROOT = require("../constants/environment.js").API_ROOT;
var Navigation = require('react-router').Navigation;
var Auth = require('../vendor/jtoker.js');
var PubSub = require('pubsub-js');
var Nav = require('../components/common/nav.jsx');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var stores = require('../stores/stores.js');
var actions = require('../actions/actions.js');
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var injectTapEventPlugin = require('react-tap-event-plugin');
var SideNavigation = require('./sidebar/SideNavigation.jsx');
var TopNavigation = require('./sidebar/TopNavigation.jsx');
var MuiThemeProvider = require('material-ui').MuiThemeProvider;
var Pusher = require('pusher-js');
window.Auth = Auth;
var AlertManager = require('./common/AlertManager.jsx');
injectTapEventPlugin();

const LoggedOutPaths = [
  '/account_login',
  '/create_account',
  '/reset_password',
  '/password_recovery',
  '/home'
]

const PermissionTypes = [
  'admin',
  'fifa',
  'ews'
]

const PermissionLinkMap = {
  admin: 'users',
  fifa: 'fifa_dashboard',
  ews: 'choose_company'
}

var SmallApp = React.createClass({
  mixins: [ Navigation ],

  getInitialState: function() {
    var flux = new Fluxxor.Flux(stores, actions);
    window.flux = flux;
    if (location.href.indexOf('localhost') > -1) {
      flux.on("dispatch", function(type, payload) {
        console.log("[Dispatch]", type, payload);
      });
    }
    return { loaded: false , flux: flux }
  },
  componentWillMount: function() {
    Pusher.logToConsole = true;
    var pusher = new Pusher('bf8bd8741c0f6755705c', {
      encrypted: true
    });

    var channel = pusher.subscribe('score_engine');
    channel.bind('score_updated_event', function(data) {
      this.state.flux.actions.showAlert(data.message);
      this.state.flux.actions.loadScores();
      this.state.flux.actions.loadScoreMetrics();
    }.bind(this));
    Auth.configure({
      apiUrl: API_ROOT + "api/v1",
      passwordResetSuccessUrl: function() {
        return "http://" + "<%=j ENV['DEFAULT_HOST'] %>" + "/reset_password";
      }
    });
    //},
    //componentWillMount: function() {
    PubSub.subscribe('auth.signIn.success', function(ev, user) {
      this.transitionTo('/');
      //this.transitionTo('/apt/portfolio/dashboard');
    }.bind(this));
    PubSub.subscribe('auth.emailRegistration.success', function(ev, user) {
      this.transitionTo('/apt/portfolio/dashboard');
    }.bind(this));
    PubSub.subscribe('auth.signOut.success', function(ev, user) {
      this.transitionTo('/account_login');
      //CompaniesStore.setCurrent();
    }.bind(this));

    Auth.validateToken()
    .then(function(user) {
      $.each(PermissionTypes, function(i, p) {
        if (window.location.pathname.indexOf(p) == 1) {
          if (user.permissions.indexOf(p) == -1) {
            PubSub.publish('alert.update', {message: "You don't have access to this page", alertType: "danger"});
            this.transitionTo('/home');
            //this.transitionTo('/account_login');
          }
        }
      }.bind(this));
      this.setState({loaded: true});
    }.bind(this))
    .fail(function(resp) {
      this.setState({loaded: true});
      if (LoggedOutPaths.indexOf(window.location.pathname) == -1) {
        //this.transitionTo('/account_login');
        this.transitionTo('/home')
      }
    }.bind(this));

    var opts = {
      lines: 9, // The number of lines to draw
      length: 13, // The length of each line
      width: 16, // The line thickness
      radius: 52, // The radius of the inner circle
      scale: 1, // Scales overall size of the spinner
      corners: 0.5, // Corner roundness (0..1)
      color: 'white', // #rgb or #rrggbb or array of colors
      opacity: 0.25, // Opacity of the lines
      rotate: 0, // The rotation offset
      direction: 1, // 1: clockwise, -1: counterclockwise
      speed: 1, // Rounds per second
      trail: 60, // Afterglow percentage
      fps: 20, // Frames per second when using setTimeout() as a fallback for CSS
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      className: 'spinner', // The CSS class to assign to the spinner
      top: '50%', // Top position relative to parent
      left: '50%', // Left position relative to parent
      shadow: false, // Whether to render a shadow
      hwaccel: false, // Whether to use hardware acceleration
      position: 'absolute', // Element positioning
    };
    //      var target = document.getElementById('spinner');
    //      var spinner = new Spinner(opts).spin(target);
  },
  onRequestClose: function() {
    this.setState({open: false})
  },
  render: function() {
    //             <div id="main" style={{paddingTop: "0px"}}>
    //<Nav {...this.props} flux={flux} />
    var style = {
      paddingTop: "0px"
    }

    //flux.actions.loadDashboard();
    //flux.actions.loadComponents();
    //flux.actions.loadScores();
    //        <Nav {...this.props} flux={flux} />
    //

    //
    return (
      <MuiThemeProvider>
        <div id="main" style={style}>
          <SideNavigation {...this.props} flux={this.state.flux} />
          <TopNavigation {...this.props} flux={this.state.flux} />
          <RouteHandler {...this.props} flux={this.state.flux} />
          <AlertManager {...this.props} flux={this.state.flux} />
        </div>
      </MuiThemeProvider>
    );
  }

});

module.exports = SmallApp;
