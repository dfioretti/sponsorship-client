var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Input = require('react-bootstrap').Input,
		FilterableDataList = require("../common/FilterableDataList.jsx"),
		ReactBsTable = require('react-bootstrap-table'),
		BootstrapTable = ReactBsTable.BootstrapTable,
		Tabs = require('material-ui').Tabs,
		Tab = require('material-ui').Tab,
		StyleIcon = require('react-icons/lib/md/style'),
		TypeIcon = require('react-icons/lib/md/collections'),
		DataIcon = require('react-icons/lib/fa/database'),
		RadioButton = require('material-ui').RadioButton,
		RadioButtonGroup = require('material-ui').RadioButtonGroup,
		AutoComplete = require('material-ui').AutoComplete,
		MenuItem = require('material-ui').MenuItem,
		SetIcon = require('react-icons/lib/md/perm-data-setting'),
		MetricDataTable = require('../common/MetricDataTable.jsx'),
	//	DataView = require('../overview/DataView.jsx'),
		TableHeaderColumn = ReactBsTable.TableHeaderColumn,
		StoreWatchMixin = Fluxxor.StoreWatchMixin;


var ScoreEditorPane = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("ScoreEditorStore")],

  getStateFromFlux: function() {
    return this.getFlux().store("ScoreEditorStore").getState();
  },
	handleChange: function(value) {
		// this is really dumb and it gets triggered by onChange by any watched store
		if (value == 'General') this.getFlux().actions.changeScorePane(value);
		if (value == 'Assets') this.getFlux().actions.changeScorePane(value);
		if (value == 'Configure') this.getFlux().actions.changeScorePane(value);

	},
  render: function() {
		return (
			<Tabs
				value={this.getStateFromFlux().selectedPane}
				onChange={this.handleChange}
				tabItemContainerStyle={{
					backgroundColor: "#3c88d1",
				}}
				inkBarStyle={{
					backgroundColor: "rgb(0, 188, 212)",
				}}
				>
				<Tab
					value="General"
					icon={<TypeIcon />}
					>
					<ScoreGeneralPane />
				</Tab>
				<Tab value="Assets" icon={<SetIcon />}>
					<ScoreAssetsPane />
				</Tab>
				<Tab value="Configure" icon={<DataIcon />}>
					<ScoreConfigurePane />
				</Tab>
			</Tabs>
		);
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
				<MetricDataTable data={this.state.dataPointList} handleSelect={this.handleDataSelect}/>
			);
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
		var val = this.state.selectedNode ? this.state.selectedNode.weight : 100;
    //var val = this.getStateFromFlux().selectedNode.weight;
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
		var radioStyle = {
			display: "inline-block",
			width: "50%",
			textTransform: "uppercase",
			letterSpacing: '1.5px',
			color: "#4a4a4a",
			fontFamily: "Avenir-Medium",
			marginTop: "10px"
		};
		var dataSource = this.getDataSource();
    if (this.getStateFromFlux().selectedNode == null) {
      return (
        <div className="form-content">
          <div className="form-group">
            <h4>Please select an element</h4>
          </div>
        </div>
      );
    } else {
//								menuStyle={{textTransform: "capitalize", maxHeight: "300px", overflowY: "auto"}}
				var defaultSelected = this.state.selectedNode ? this.state.selectedNode.mode : 'value';

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
								<div className="form-group">
									<RadioButtonGroup onChange={this.handleRadioChange} name="nodeType" defaultSelected={defaultSelected}>
										<RadioButton style={radioStyle} value="parent" label="Parent" />
										<RadioButton style={radioStyle} value="value" label="Data" />
									</RadioButtonGroup>
								</div>
            </div>
            <div className="form-group">
              <label>Weight</label>
              <div style={{marginLeft: "25%", marginRight: "25%"}}className='dial-container'>
                <input type='text'
                  value={this.getStateFromFlux().selectedNode.weight}
                  className='dial'
                  onChange={this.handleUpdateWeight}
                  data-width='100px'
                  data-height='100px'
                  data-thickness='0.2'
                  data-fgcolor='#00BCD4'
                />
              </div>
            </div>
            <ScoreEditorModeGroup />
          </div>
        );
    }
  },
	handleItemClick: function(e) {
		/*
		console.log('item clic', e);
		<div className="form-group">
			<AutoComplete
				hintText="Score Metric"
				filter={AutoComplete.caseInsensitiveFilter}
				dataSource={dataSource}
				onUpdateInput={this.handleMenuUpdate}
				/>
		</div>*/
	},
	getDataSource: function() {
		var list = [];
		var imgStyle = {
			height: "35px",
			width: "35px",
			borderRadius: "50%"
		}
		for (var i = 0; i < this.state.dataPointList.length; i++) {
			var item = this.state.dataPointList[i];
			list.push(
				{
					text: item.point.split("_").join(" "),
					value: <MenuItem onChange={this.handleItemClick} id={item.id} primaryText={item.point.split("_").join(" ")} leftIcon={<img style={imgStyle} src={item.icon}/>}/>
				}
			)
		}
		return list;
	},
	handleRadioChange: function(e) {
		this.getFlux().actions.updateNodeMode(e.target.value);
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
	onSelectAll: function(isSelected) {
		console.log("ALL", isSelected);
	},
  render: function() {
		var colFilter = {type: "TextFilter" };
		var data = this.getFlux().store("AssetsStore").getState().assets;
		var selectRowProp = {
			mode: "checkbox",
			clickToSelect: true,
			bgColor: "rgb(0, 188, 212)",
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
