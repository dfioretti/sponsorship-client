var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Link = require('react-router').Link,
		Glyphicon = require('react-bootstrap').Glyphicon,
		StoreWatchMixin = Fluxxor.StoreWatchMixin;

var AppSidebar = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("ComponentEditorStore")],

  getInitialState: function() {
    return {};
  },
  getStateFromFlux: function() {
    return this.getFlux().store("ComponentEditorStore").getState();
  },
  toggleMenu: function() {
    $("#app-menu").slideToggle(250);
  },
  renderTopMenu: function() {
		//<CreateDashboardModal id="create-dashboard-modal" flux={this.getFlux()} />
		//            <div id="menu-button" className="glyphicon glyphicon-menu-hamburger" aria-hidden="true"></div>


    return (
      <div className="sidebar-top-menu">
        <div className="top-menu">
          <div onClick={this.toggleMenu} className="menu-container">
						<Glyphicon glyph='menu-hamburger' bStyle="info" />

            <div className="menu-text">Menu</div>
          </div>
          <div id="app-menu">
            <ul>
              <li>
                Dashboards
                <ul>
                  <Link to="/">
                    <li>
                      &nbsp;&nbsp;- View
                    </li>
                  </Link>
                </ul>
              </li>
              <li>
                Components
                <ul>
                  <Link to="/apt/editor_component">
                    <li>
                      &nbsp;&nbsp;- Create
                    </li>
                  </Link>
                </ul>
              </li>
              <li>
                <Link to="/">
                  Scores
                </Link>
              </li>
              <li>
                <Link to="/">
                  Data
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  },
  handleContextChange: function(e) {
    this.getFlux().actions.changePane(e.target.id);
  },
  renderContextListItem: function(item) {
    if (item == this.getStateFromFlux().editorPane) {
      return (
        <li id={item} className="active-item">
          {item}
        </li>
      );
    } else {
      return (
        <li id={item} >
          {item}
        </li>
      );
    }
  },
  renderContent: function() {
		//          <DashboardContextMenu />

    if (this.props.view === "dashboard") {
      return (
        <div className="context-menu">
        </div>
      );
    } else if (this.props.view === "score") {
			//          <ScoreEditContextMenu />

      return (
        <div className="context-menu">
        </div>
      );
    } else if (this.props.view === 'asset') {
			//<AssetContextMenu />

      return (
        <div className="context-menu">
        </div>
      )
    }
    else {
      return (
        <div className="context-menu">
          <div className="editor-menu">
            <ul onClick={this.handleContextChange}>
              {this.renderContextListItem('general')}
              {this.renderContextListItem('chartType')}
              {this.renderContextListItem('data')}
              {this.renderContextListItem('appearance')}
              {this.renderContextListItem('configuration')}
            </ul>
          </div>
        </div>
      );
    }
  },
  render: function() {
    return (
      <div className="apt-sidebar">
        {this.renderTopMenu()}
        {this.renderContent()}
      </div>
    );
  }
});

module.exports = AppSidebar;
