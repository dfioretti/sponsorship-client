var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		StoreWatchMixin = Fluxxor.StoreWatchMixin;

var AppSidebar = require('./sidebar/app_sidebar.jsx');
var Nav = require('./common/nav.jsx');
var ComponentEditor = require('./editors/component_editor.jsx');


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

module.exports = Dev;
