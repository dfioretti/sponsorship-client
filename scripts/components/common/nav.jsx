var React = require('react');
var Link = require('react-router').Link;
var PubSub = require('pubsub-js');


var Nav = React.createClass({

	render: function() {
		return (
			<nav id="navbar" className="nav navbar-default navbar-fixed-top">
        <div className="nav-center"></div>
        <div className="navbar-collapse collapse">
          <ul className="nav navbar-nav navbar-right nav-user">
          </ul>
        </div>
      </nav>
		);
	}
});

module.exports = Nav;
