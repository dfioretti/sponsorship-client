var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		StoreWatchMixin = Fluxxor.StoreWatchMixin;

var AppSidebar = require('./sidebar/app_sidebar.jsx');
var Nav = require('./common/nav.jsx');
var ComponentEditor = require('./editors/component_editor.jsx');
//var Gallery = require('../components/demos/Gallery.jsx');
var Grid = require('../components/demos/Grid.jsx');
var GridView = require('./containers/GridView.jsx');
/*
var Dev = React.createClass({
	mixins: [FluxMixin],

	render: function() {
		return (
			<div>
				<Nav />
				<AppSidebar />
				<ComponentEditor />
			</div>
		);
	}
});
*/

var Dev = React.createClass({


  render: function () {
		var elements = ["hey", "you", "sup"];
    return (
			<div>
				<GridView />
			</div>
    );
  }
});

module.exports = Dev;
