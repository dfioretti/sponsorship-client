var React = require('react');
var Link = require('react-router').Link;
var Auth = require('j-toker');
var ReactDOM = require('react-dom');

var CreateAccount = React.createClass({
  componentWillMount: function() {
    this.props.setTitle('Create Account');
  },
  createUser: function(e) {
    e.preventDefault();

    var params = {
      name: ReactDOM.findDOMNode(this.refs.name).value,
      email: ReactDOM.findDOMNode(this.refs.email).value,
      password: ReactDOM.findDOMNode(this.refs.password).value,
      password_confirmation: ReactDOM.findDOMNode(this.refs.confirmation).value
    };

    Auth.emailSignUp(params)
      .then(function(user) {
        // console.log(user);
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
          <form onSubmit={this.createUser}>
            <div className="form-group">
              <span className="text-icon email"></span>
              <input type="text" className="form-control" ref="name" placeholder="Analyst Name" />
            </div>
            <div className="form-group">
              <span className="text-icon email"></span>
              <input type="text" className="form-control" ref="email" placeholder="Email Address" />
            </div>
            <div className="form-group">
              <span className="text-icon password"></span>
              <input type="password" className="form-control" ref="password" placeholder="Password" />
            </div>
            <div className="form-group">
              <span className="text-icon password"></span>
              <input type="password" className="form-control" ref="confirmation" placeholder="Retype Password" />
            </div>
            <div className="form-group">
              <button className="pull-right btn primary" type="submit">Create</button>
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

module.exports = CreateAccount;
