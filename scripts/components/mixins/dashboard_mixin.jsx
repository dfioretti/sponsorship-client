

var DashboardMixin = {
  setupGrid: function() {
    $('.modules-container').shapeshift({
      selector: ".dashboard-module",
      handle: ".drag-handle",
      align: "left",
      minColumns: 2,
      autoHeight: false,
      gutterX: 20,
      gutterY: 20,
      paddingX: 20,
      paddingY: 20
    });

    $('.modules-container').on('ss-drop-complete', function(e, selected) {
      this.updateDashboardState(this.getDashboardState());
    }.bind(this));
  },
  handleChange: function() {
    this.setState({dashboardState: DashboardsStore.getState().current});
  },
  handleToggle: function(values, e) {
    var state;
    if (values.value == "on") {
      state = {value: "off", module: values.module};
      this.updateDashboardUI("off", values.module);
    } else {
      state = {value: "on", module: values.module};
      this.updateDashboardUI("on", values.module);
    }
  },
  updateDashboardUI: function(state, name) {
    if (state == "on") {
      $('.dashboard-module#' + name).show();
    } else {
      $('.dashboard-module#' + name).hide();
    }
    $('.modules-container').trigger('ss-rearrange');
    this.updateDashboardState(this.getDashboardState());
  },
  getDashboardState: function() {
    var dashboardState = {};

    $('.modules-container').children().each(function() {
      var toggle = $(this).is(":visible") ? "on" : "off";
      dashboardState[$(this).attr('id')] = {index: $(this).index(), toggle: toggle};
    });

    var did = DashboardsStore.getState().current.id;
    return {id: did, state: dashboardState};
  },
  updateDashboardState: function(state) {
    DashboardsStore.update(state).then(function(dashboard){
      this.handleChange();
    }.bind(this));
  }
};
module.exports = DashboardMixin;
