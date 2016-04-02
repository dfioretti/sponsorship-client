var React = require('react'),
	 	ToggleIcon = require('react-icons/lib/md/arrow-drop-down'),
		DashboardIcon = require('react-icons/lib/fa/dashboard'),
		ModuleIcon = require('react-icons/lib/md/dashboard'),
		ScoreIcon = require('react-icons/lib/fa/sitemap'),
		HomeIcon = require('react-icons/lib/fa/home'),
		CreateIcon = require('react-icons/lib/md/create'),
		List = require('material-ui').List,
		ListItem = require('material-ui').ListItem,
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Navigation = require('react-router').Navigation;

var MainNav = React.createClass({
	mixins: [Navigation, FluxMixin],

	handleDashboardCreate: function(e) {
		console.log("change", e);
	},
	handleDashboardHome: function(e) {
		console.log("change", e);

	},
	handleScoreCreate: function(e) {
		this.getFlux().actions.resetScoreEditor();
		this.transitionTo('/apt/editor_score');
	},
	handleScoreHome: function(e) {
		this.transitionTo('score_index');
	},
	handleModuleHome: function(e) {
		this.transitionTo('/components_index');
	},
	handleModuleCreate: function(e) {
		this.getFlux().actions.resetComponentEditor();
		this.transitionTo('/apt/editor_component')
	},
	render: function() {
		var iconStyle = {
			color: 'white',
			//marginTop: 3
		}
		var itemStyle = {
			//color: 'white',
			color: '#9e9e9e',
			//fontSize: 14,
			//height: 40,
			textTransform: 'uppercase',
			letterSpacing: '1.5px'
		}
		var textStyle = {
			//marginTop: -8
		}
		return (
		<List>
			<ListItem
				style={itemStyle}
				leftIcon={<DashboardIcon style={iconStyle} />}
				primaryText={<div style={textStyle}>Dashboards</div>}
				primaryTogglesNestedList={true}
				rightIcon={<ToggleIcon style={iconStyle} />}
				nestedItems={[
					<ListItem
						key={1}
						leftIcon={<HomeIcon style={iconStyle} />}
						primaryText={<div style={textStyle}>Home</div>}
						style={itemStyle}
						onTouchTap={this.handlDashboardHome}

						/>,
					<ListItem
						key={2}
						leftIcon={<CreateIcon style={iconStyle} />}
						primaryText={<div style={textStyle}>Create</div>}
						style={itemStyle}
						onTouchTap={this.handleDashboardCreate}
						/>
				]}
			/>
			<ListItem
				style={itemStyle}
				primaryText={<div style={textStyle}>Scores</div>}
				primaryTogglesNestedList={true}
				leftIcon={<ScoreIcon style={iconStyle} />}
				rightIcon={<ToggleIcon style={iconStyle} />}
				nestedItems={[
					<ListItem
						key={1}
						leftIcon={<HomeIcon style={iconStyle} />}
						onTouchTap={this.handleScoreHome}
						primaryText={<div style={textStyle}>Home</div>}
						style={itemStyle}
						/>,
					<ListItem
						key={2}
						onTouchTap={this.handleScoreCreate}
						primaryText={<div style={textStyle}>Create</div>}
						leftIcon={<CreateIcon style={iconStyle} />}
						style={itemStyle}
						/>
				]}
			/>
			<ListItem
				style={itemStyle}
				primaryText={<div style={textStyle}>Modules</div>}
				primaryTogglesNestedList={true}
				leftIcon={<ModuleIcon style={iconStyle} />}
				rightIcon={<ToggleIcon style={iconStyle} />}
				nestedItems={[
					<ListItem
						key={1}
						leftIcon={<HomeIcon style={iconStyle} />}
						onTouchTap={this.handleModuleHome}
						primaryText={<div style={textStyle}>Home</div>}
						style={itemStyle}
						/>,
					<ListItem
						key={2}
						primaryText={<div style={textStyle}>Create</div>}
						style={itemStyle}
						leftIcon={<CreateIcon style={iconStyle} />}
						onTouchTap={this.handleModuleCreate}
						/>
				]}
			/>
		</List>
		)
	}
});

module.exports = MainNav;
