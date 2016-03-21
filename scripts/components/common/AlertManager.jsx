var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Snackbar = require('material-ui').Snackbar,
		StoreWatchMixin = Fluxxor.StoreWatchMixin;


var AlertManager = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("AlertStore")],
	onRequestClose: function() {
		this.getFlux().actions.hideSnackbar();
	},
	getStateFromFlux: function() {
		return this.getFlux().store("AlertStore").getState();
	},
	render: function() {
		var snackbarStyle = {
			fontFamily: 'Avenir-Medium',
			textAlign: 'center',
			textTransform: 'uppercase',
			letterSpacing: '1.5px'
		};

		return (
			<Snackbar
				style={snackbarStyle}
				open={this.state.open}
				message={this.state.message}
				onRequestClose={this.onRequestClose}
				autoHideDuration={900} />
		);
	}
});
module.exports = AlertManager;
