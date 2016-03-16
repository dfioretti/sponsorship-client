var React = require('react');
var RouteHandler = require('react-router').RouteHandler;
var Header = require('../components/Header.react.jsx');
var SessionStore = require('../stores/SessionStore.react.jsx');
var RouteStore = require('../stores/RouteStore.react.jsx');
var Navigation = require('react-router').Navigation;
//var Auth = require('j-toker');
var Auth = require('../vendor/jtoker.js');

var PubSub = require('pubsub-js');
var Nav = require('../components/common/nav.jsx');
var Fluxxor = require('fluxxor');
var stores = require('../stores/stores.js');
var actions = require('../actions/actions.js');
window.Auth = Auth;

const LoggedOutPaths = [
  '/account_login',
  '/create_account',
  '/reset_password',
  '/password_recovery'
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
    return { loaded: false };
  },
  componentWillMount: function() {
    Auth.configure({
      apiUrl: 'http://localhost:4000/api/v1',
      passwordResetSuccessUrl: function() {
        return "http://" + "<%=j ENV['DEFAULT_HOST'] %>" + "/reset_password";
      }
    });
  //},
  //componentWillMount: function() {
      PubSub.subscribe('auth.signIn.success', function(ev, user) {
        this.transitionTo('/apt/portfolio/dashboard');
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
                this.transitionTo('/account_login');
              }
            }
          }.bind(this));
          this.setState({loaded: true});
        }.bind(this))
        .fail(function(resp) {
          console.log("WTF");
          this.setState({loaded: true});
          if (LoggedOutPaths.indexOf(window.location.pathname) == -1) {
            this.transitionTo('/account_login');
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

  render: function() {
    var flux = new Fluxxor.Flux(stores, actions);
    window.flux = flux;
    flux.on("dispatch", function(type, payload) {
      console.log("[Dispatch]", type, payload);
    });
    return (
      <div id="main">
        <Nav {...this.props} flux={flux} />
        <RouteHandler {...this.props} flux={flux} />
      </div>
    );
  }

});

module.exports = SmallApp;
