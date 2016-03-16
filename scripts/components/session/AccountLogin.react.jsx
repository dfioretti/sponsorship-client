var React = require('react');
var Link = require('react-router').Link;
var Auth = require('j-toker');
var ReactDOM = require('react-dom');
var PubSub = require('pubsub-js');


var AccountLogin = React.createClass({
  componentWillMount: function() {
    //this.props.setTitle('Account Login');
  },
  login: function(e) {
    e.preventDefault();

    var params = {
      email: ReactDOM.findDOMNode(this.refs.email).value,
      password: ReactDOM.findDOMNode(this.refs.password).value,
      remember_me: ReactDOM.findDOMNode(this.refs.remember).value
    };

    Auth.emailSignIn(params)
      .then(function(user) {
        console.log(user);
        // console.log(user);
      }.bind(this))
      .fail(function(resp) {
        console.log(resp);
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
          <form onSubmit={this.login}>
            <div className="form-group">
              <span className="text-icon email"></span>
              <input type="text" className="form-control" ref="email" placeholder="Email Address" />
            </div>
            <div className="form-group">
              <span className="text-icon password"></span>
              <input type="password" className="form-control" ref="password" placeholder="Password" />
            </div>
            <div className="form-group">
              <input type="checkbox" ref="remember" />
              <label>Remember me</label>
              <button className="pull-right btn primary" type="submit">Login</button>
            </div>
          </form>
        </div>
        <div className="links">
          <Link to="create_account">Create New Account</Link>
          <Link className="pull-right" to="password_recovery">Forgot Password?</Link>
        </div>
      </div>
    );
  }
});

module.exports = AccountLogin;
