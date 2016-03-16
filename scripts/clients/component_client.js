var url = {
  COMPONENT_URL: "http://localhost:4000/api/v1/apt/components/",
};

var ComponentClient = {
  getComponents: function(successCallback) {
    $.ajax({
      type: "GET",
      contentType: "application/json",
      url: url.COMPONENT_URL,
      success: function(data) {
        successCallback(data);
      },
      error: function(xhr, status, error) {
        console.log(status);
        console.log(error);
      }
    });
  },
  createComponent: function(component, successCallback) {
    $.ajax({
      type: "POST",
      contentType: "application/json",
      url: url.COMPONENT_URL,
      data: JSON.stringify({ component: component, preview: false }),
      success: function(data) {
        successCallback(data);
      },
      error: function(xhr, status, error) {
        console.log(status);
        console.log(error);
      }
    });
  },
  generatePreviewData: function(component, successCallback) {
    $.ajax({
      type: "POST",
      contentType: "application/json",
      url: url.COMPONENT_URL,
      data: JSON.stringify({ component: component, preview: true }),
      success: function(data) {
        successCallback(data);
      },
      error: function(xhr, status, error) {
        console.log(status);
        console.log(error);
      }
    });
  },
  updateComponent: function(component, successCallback) {
    $.ajax({
      type: "PUT",
      contentType: "application/json",
      url: url.COMPONENT_URL + component.id,
      data: JSON.stringify({ component: component }),
      success: function(data) {
        successCallback(data);
      },
      error: function(xhr, status, error) {
        console.log(status);
        console.log(error)
      }
    });
  },
  viewComponent: function(cid, failure) {
    $.ajax({
      type: "GET",
      contentType: "application/json",
      url: url.COMPONENT_URL + cid,
      success: function(data) {
        successCallback(data);
      },
      error: function(xhr, status, error) {
        console.log(status);
        console.log(error);
      }
    });
  }
};

module.exports = ComponentClient;
