var React = require('react');
var Sidebar = require('react-sidebar');

var SideNav = React.createClass({
  getInitialState: function() {
    return {sidebarOpen: false};
  },

  onSetSidebarOpen: function(open) {
    this.setState({sidebarOpen: open});
  },

  render: function() {
   var sidebarContent = "sidebar content";

    return (
      <Sidebar sidebar={sidebarContent}
               open={this.state.sidebarOpen}
               onSetOpen={this.onSetSidebarOpen}>
        <b>Main content</b>
      </Sidebar>
    );
  }
});

module.exports = SideNav;
