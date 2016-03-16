var React = require('react');
var ReactDOM = require('react-dom');
var Auth = require('j-toker');
var Link = require('react-router').Link;


var PasswordRecovery = React.createClass({
  componentWillMount: function() {
    this.props.setTitle('Password Recovery');
  },
  recoverPassword: function(e) {
    e.preventDefault();

    var params = {
      email: ReactDOM.findDOMNode(this.refs.email).value,
      redirect_url: APIEndpoints.PASSWORD_RESET
    };

    Auth.requestPasswordReset(params)
      .then(function(user) {
        var message = user.message
        PubSub.publish('alert.update', {message: message, alertType: "info"});
      }.bind(this))
      .fail(function(resp) {
        var message = resp.data.errors.join(', ');
        PubSub.publish('alert.update', {message: message, alertType: "danger"});
      }.bind(this));
  },
  render: function() {
    return (
      <div className="centered">
        <div className="form-container">
          <div className="image-top">
          </div>
          <form onSubmit={this.recoverPassword}>
            <div className="form-group">
              <span className="text-icon email"></span>
              <input type="text" className="form-control" ref="email" placeholder="Email Address" />
            </div>
            <div className="form-group">
              <button className="pull-right btn primary" type="submit">Reset</button>
            </div>
          </form>
        </div>
        <div className="links">
          <Link to="account_login">Account Login</Link>
        </div>
      </div>
    );
  }
});

module.exports = PasswordRecovery;
