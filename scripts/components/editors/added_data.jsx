var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Link = require('react-router').Link,
		StoreWatchMixin = Fluxxor.StoreWatchMixin;

var AddedDataRow = require('./added_data_row.jsx');

var AddedData = React.createClass({
  mixins: [FluxMixin],

  getStateFromFlux: function() {
    return this.getFlux().store("ComponentEditorStore").getState();
  },
  render: function() {
    var i = 0;
    return (
      <div className="row filter-row editor-data-table">
        {this.getStateFromFlux().data.map(function(item) {
          var entityImage = '/images/' + item.entity.entity_id + '.jpg';
          return (
            <AddedDataRow key={i} id={i++} imageOne={entityImage}
              imageTwo={item.metric.point_image}
              labelOne={item.entity.name}
              labelTwo={item.metric.point.split("_").pop()}
            />
          );
        }.bind(this))}
      </div>
    );
  }
});
module.exports = AddedData;
