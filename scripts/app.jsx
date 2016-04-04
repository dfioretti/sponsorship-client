var React = require('react');
var router = require('./stores/RouteStore.react.jsx').getRouter();
var stores = require('./stores/stores.js');
var actions = require('./actions/actions.js');
var Fluxxor = require('fluxxor');
window.React = React;

/*
var flux = new Fluxxor.Flux(stores, actions);
window.flux = flux;
flux.on("dispatch", function(type, payload) {
  console.log("[Dispatch]", type, payload);
});
*/
if (location.href.indexOf('localhost') > -1) {
  router.run(function (Handler, state) {
    React.render(<Handler />, document.getElementById('app'));
  });
} else {
  router.run(function (Handler, state) {
    React.render(<Handler />, document.getElementById('app'))
  });
}
