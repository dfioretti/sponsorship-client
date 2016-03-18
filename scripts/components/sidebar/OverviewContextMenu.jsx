var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Navigation = require('react-router').Navigation,
		ReactBootstrap = require('react-bootstrap'),
		StoreWatchMixin = Fluxxor.StoreWatchMixin;

var OverviewContextMenu = React.createClass({
  mixins: [FluxMixin, Navigation],

	getInitialState: function() {
    return {};
  },
  getStateFromFlux: function() {
    return this.getFlux().store("OverviewStore").getState();
  },
	handleOverviewContextChange: function(e) {
		console.log("wtf");
		console.log(e);
		this.getFlux().actions.changeOverviewPane(e.target.id);
  },
  render: function() {
		return (
			<div className="context-menu">
				<div className="editor-menu">
					<ul onClick={this.handleOverviewContextChange}>
						{this.getStateFromFlux().menuItems.map(function(i) {
							if (this.getStateFromFlux().selectedPane == i) {
								return (
									<li key={i} id={i} className="active-item">
										{i}
									</li>
								);
							} else {
								return (
									<li key={i} id={i}>
										{i}
									</li>
								);
							}
						}.bind(this))}
					</ul>
				</div>
			</div>
	);
  }
});
module.exports = OverviewContextMenu;
