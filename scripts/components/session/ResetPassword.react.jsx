var React = require('react');
var ReactDOM = require('react-dom');
var Auth = require('j-toker');
var Link = require('react-router').Link

var ResetPassword = React.createClass({
  componentWillMount: function() {
    this.props.setTitle('Reset Password');
  },
  reset: function(e) {
    e.preventDefault();

    var params = {
      password: ReactDOM.findDOMNode(this.refs.password).value,
      password_confirmation: ReactDOM.findDOMNode(this.refs.confirmation).value
    };

    $.auth.updatePassword(params)
      .then(function(user) {
        var message = user.data.message;
        PubSub.publish('alert.update', {message: message, alertType: "info"});
      }.bind(this))
      .fail(function(resp) {
        var message = resp.data.errors.full_messages.join(', ');
        PubSub.publish('alert.update', {message: message, alertType: "danger"});
      }.bind(this));
  },
  render: function() {
    return (
      <div className="centered">
        <div className="form-container">
          <div className="image-top">
          </div>
          <form onSubmit={this.reset}>
            <div className="form-group">
              <span className="text-icon password"></span>
              <input type="password" className="form-control" ref="password" placeholder="Password" />
            </div>
            <div className="form-group">
              <span className="text-icon password"></span>
              <input type="password" className="form-control" ref="confirmation" placeholder="Retype Password" />
            </div>
            <div className="form-group">
              <button className="pull-right btn primary" type="submit">Update</button>
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

module.exports = ResetPassword;
