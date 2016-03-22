var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Input = require('react-bootstrap').Input,
		FilterableDataList = require("../common/FilterableDataList.jsx"),
		ReactBsTable = require('react-bootstrap-table'),
		BootstrapTable = ReactBsTable.BootstrapTable,
	//	DataView = require('../overview/DataView.jsx'),
		TableHeaderColumn = ReactBsTable.TableHeaderColumn,
		StoreWatchMixin = Fluxxor.StoreWatchMixin;


var ScoreEditorPane = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("ScoreEditorStore")],

  getStateFromFlux: function() {
    return this.getFlux().store("ScoreEditorStore").getState();
  },
  render: function() {
    switch(this.getStateFromFlux().selectedPane) {
      case 'General':
        return <ScoreGeneralPane />;
        break;
      case 'Assets':
        return <ScoreAssetsPane />;
        break;
      case 'Configure':
        return <ScoreConfigurePane />;
        break;
    }
  }
});

var ScoreEditorModeGroup = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("ScoreEditorStore")],
  getStateFromFlux: function() {
    return this.getFlux().store("ScoreEditorStore").getState();
  },
  handleOperationChange: function(e) {
    this.getFlux().actions.updateNodeOperation(e.target.selectedOptions[0].id);
  },
  handleDataSelect: function (e) {
    this.getFlux().actions.updateNodeData(e.target.id);
  },
  render: function() {
    if (this.getStateFromFlux().selectedNode.mode === 'parent') {
      return (
        <div className="form-group">
          <label>Operation</label>
          <select value={this.getStateFromFlux().selectedNode.operationValue}
                  className="form-control"
                  onChange={this.handleOperationChange}
          >

          {this.getStateFromFlux().parentOperations.map(function(o) {
            return (
              <option
                key={o.value}
                value={o.value}
                id={o.value}
              >
                {o.name}
              </option>
            );
          }.bind(this))}
          </select>
        </div>
      )

    } else if (this.getStateFromFlux().selectedNode.mode === 'value') {
      return (
        <FilterableDataList dataList={this.getStateFromFlux().dataPointList}
                            handleSelect={this.handleDataSelect} />
      );
    } else {
      return null;
    }
  }
});

var ScoreConfigurePane = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("ScoreEditorStore")],
  getStateFromFlux: function() {
    return this.getFlux().store("ScoreEditorStore").getState();
  },
  handleUpdateName: function(e) {
    this.getFlux().actions.updateNodeName(e.target.value);
  },
  handleUpdateWeight: function(e) {
    this.getFlux().actions.updateNodeWeight(e.target.value);
  },
  componentDidUpdate: function() {
    this.configureKnob();
  },
  handleModeChange: function(e) {
    this.getFlux().actions.updateNodeMode(e.target.id);
  },
  configureKnob: function() {
    var val = this.getStateFromFlux().selectedNode.weight;
    if (!val) { val = 100; }
    $('.dial').val(val).trigger('change');
    $('.dial').knob({
      'change': function(v) {
        flux.actions.updateNodeWeight(Math.round(v));
      }
    });
  },
  componentDidMount: function () {
    this.configureKnob();
  },
  renderPaneContent: function() {
    if (this.getStateFromFlux().selectedNode == null) {
      return (
        <div className="form-content">
          <div className="form-group">
            <h4>Please select an element</h4>
          </div>
        </div>
      );
    } else {
        return (
          <div className="form-content">
            <div className="form-group">
              <label>Name</label>
              <input type="text"
                className="form-control"
                value={this.getStateFromFlux().selectedNode.component}
                onChange={this.handleUpdateName}
              />
            </div>
            <div className="form-group">
              <label>Element Type</label>
              <div>
                <Input
                  type='radio'
                  label='Parent'
                  wrapperClassName='col-md-6'
                  checked={this.getStateFromFlux().selectedNode.mode === 'parent'}
                  id='parent'
                  onChange={this.handleModeChange}
                />
              <Input
                  type='radio'
                  label='Data'
                  id='value'
                  checked={this.getStateFromFlux().selectedNode.mode === 'value'}
                  wrapperClassName='col-md-6'
                  onChange={this.handleModeChange}
                />
            </div>
            </div>
            <div className="form-group">
              <label>Weight</label>
              <div className='dial-container'>
                <input type='text'
                  value={this.getStateFromFlux().selectedNode.weight}
                  className='dial'
                  onChange={this.handleUpdateWeight}
                  data-width='100px'
                  data-height='100px'
                  data-thickness='0.2'
                  data-fgcolor='#EBA068'
                />
              </div>
            </div>
            <ScoreEditorModeGroup />
          </div>
        );
    }
  },
  render: function() {
    return (
      <div className="editor-pane">
        <div className="input-heading">
          Configure Node
        </div>
          {this.renderPaneContent()}
      </div>
    );
  }

});

var ScoreGeneralPane = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("ScoreEditorStore")],
  getStateFromFlux: function() {
    return this.getFlux().store("ScoreEditorStore").getState();
  },
  handleTitleChange: function(e) {
    this.getFlux().actions.updateScoreTitle(e.target.value);
  },
  zoomToFit: function() {
    if (myDiagram) {
      myDiagram.commandHandler.zoomToFit();
    }
  },
  resetLayout: function() {
    reload();
  },
  render: function() {
    return (
      <div className="editor-pane">
        <div className="input-heading">
          General
        </div>
        <div className="form-content">
          <div className="form-group">
            <label>Score Name</label>
            <input type="text"
              value={this.getStateFromFlux().scoreTitle}
              onChange={this.handleTitleChange}
              className="form-control"
            />
          </div>
        <hr />
          <div className="form-group">
            <button onClick={this.zoomToFit} className="btn btn-primary form-control">
              Zoom to Fit
            </button>
          </div>
          <div className="form-group">
            <button onClick={this.resetLayout} className="btn btn-info form-control">
              Reset Layout
            </button>
          </div>
        </div>
      </div>
    );
  }
});


var ScoreAssetsPane = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("ScoreEditorStore")],

  getStateFromFlux: function() {
    return this.getFlux().store("ScoreEditorStore").getState();
  },
	/*
	<BootstrapTable
		data={this.getFlux().store("AssetsStore").getState().assets}
		striped={true}
		height="400"
		searc={true}
	>
		<TableHeaderColumn dataSort={true} dataField="id" isKey={true}>ID</TableHeaderColumn>
	</BootstrapTable>
	*/
	onRowSelect: function(row, isSelected) {
		console.log("SELECTED", row, isSelected);
	},
	onSelectAll(isSelected) {
		console.log("ALL", isSelected);
	},
  render: function() {
		var colFilter = {type: "TextFilter" };
		var data = this.getFlux().store("AssetsStore").getState().assets;
		var selectRowProp = {
			mode: "checkbox",
			clickToSelect: true,
			bgColor: "#50e3c2",
			onSelect: this.onRowSelect,
			onSelectAll: this.onSelectAll
		}
		var scopeOptions = {
			"National": "National",
			"Regional": "Regional"
		};
		var categoryOptions = {
			"Athlete": "Athlete",
			"Musician": "Musician",
			"Sports Team": "Sports Team"
		};
    return (
				<BootstrapTable data={data}
												striped={true}
												hover={true}
												height="650"
												selectRow={selectRowProp}
												condensed={false}
												search={true}
				>
					<TableHeaderColumn hidden={true} dataSort={true} dataField="id" isKey={true}>ID</TableHeaderColumn>
					<TableHeaderColumn filter={colFilter} dataSort={true} dataField="name">Name</TableHeaderColumn>
					<TableHeaderColumn
						dataField="scope"
						filter={{type: "SelectFilter", options: scopeOptions}}>
						Scope
					</TableHeaderColumn>
					<TableHeaderColumn
						filter={{type: "SelectFilter", options: categoryOptions}}
						dataSort={true}
						dataField="category">
						Category
					</TableHeaderColumn>
				</BootstrapTable>
    );
  }
});
module.exports = ScoreEditorPane;
