var React = require('react');
var Sidebar = require('react-sidebar');
var Button = require('react-bootstrap').Button;
var DataDrawer = require('../elements/Drawer.jsx');
var AppBar = require('material-ui').AppBar;
var IconButton = require('material-ui').IconButton;
var NavigationClose = require('material-ui').NavigationClose;
var IconMenu = require('material-ui').IconMenu;
var MoreVertIcon = require('material-ui').MoreVertIcon;
var MenuItem = require('material-ui').MenuItem;
var Select = require('react-select');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React)
var DataContainer = require('../data-search/DataContainer.jsx');
var Layout = require('../data-search/Layout.jsx');

var Workspace = React.createClass({
	mixins: [FluxMixin],

	getInitialState: function() {
		return {open: true};
	},
	toggleDrawer: function(e) {
		this.setState({open: !this.state.open});
	},
	render: function() {
		console.log("render");
		console.log(this.state.open);
		/*
		<Select
			multi={true}
			options={options}
			onChange={this.logSelect}
		/>
		*/
		//				<DataDrawer open={this.state.open} >
		var options = [
    { value: 'one', label: 'One' },
    { value: 'two', label: 'Two' }
		];

		return (
			<div>
				<AppBar />
				<Button onClick={this.toggleDrawer} />
				<Layout />
				<DataDrawer open={this.state.open}>
					<DataContainer />
				</DataDrawer>
			</div>
		);
	}
});

module.exports = Workspace;
