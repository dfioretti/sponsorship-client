var dashboard_url = {
  DASH_URL: "http://localhost:4000/api/v1/apt/dashboards/",
};
var DashboardClient = {
  getDashboards: function(successCallback){
    $.ajax({
      type: "GET",
      contentType: "application/json",
      url: dashboard_url.DASH_URL,
      success: function(data) {
        successCallback(data);
      },
      error: function(xhr, status, error) {
        console.log(status);
        console.log(error);
      }
    });
  },
  createDashboard: function(dashboard, successCallback) {
    $.ajax({
      type: "POST",
      contentType: "application/json",
      url: dashboard_url.DASH_URL,
      data: JSON.stringify({ dashboard: dashboard}),
      success: function(data) {
        successCallback(data);
      },
      error: function(xhr, status, error) {
        console.log(status);
        console.log(error);
      }
    });
  },
  updateDashboard: function(dashboard, successCallback) {
    $.ajax({
      type: "PUT",
      contentType: "application/json",
      url: dashboard_url.DASH_URL + dashboard.id,
      data: JSON.stringify({ dashboard: dashboard }),
      success: function(data) {
        successCallback(data);
      },
      error: function(xhr, status, error) {
        console.log(status);
        console.log(error);
      }
    });
  }
}
module.exports = DashboardClient;
