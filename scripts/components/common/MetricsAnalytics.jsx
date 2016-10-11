var React = require('react');
var ReactBsTable = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var Row = require('react-bootstrap').Row;
var Toggle = require('material-ui').Toggle;
var Col = require('react-bootstrap').Col;
var Grid = require('react-bootstrap').Grid;
var loki = require('lokijs');
var LokiIndexedAdapter = require('lokijs/src/loki-indexed-adapter');
var idbAdapter = new LokiIndexedAdapter('loki-db');
var DragDropContext = require('react-dnd').DragDropContext;
var HTML5Backend = require('react-dnd-html5-backend');
var DropMetric = require('../editors/DropMetric.jsx');
var TextField = require('material-ui').TextField;
var numberFormat = require('underscore.string/numberFormat');
var DragMetric = require('../editors/DragMetric.jsx');
var Colors = require('../../constants/colors.js');
var RemoveIcon = require('react-icons/lib/md/remove');
var FlatButton = require('material-ui').FlatButton;
var Chip = require('material-ui').Chip;
var titleize = require('underscore.string/titleize');
var Avatar = require('material-ui').Avatar;
var Divider = require('material-ui').Divider;
var uuid = require('node-uuid');
var PlusIcon = require('react-icons/lib/ti/plus');
var MinusIcon = require('react-icons/lib/ti/minus');
var DivideIcon = require('react-icons/lib/ti/divide');
var DeleteIcon = require('react-icons/lib/md/delete');
var MultiplyIcon = require('react-icons/lib/ti/times');
var IconButton = require('material-ui').IconButton;
var ListItem = require('material-ui').ListItem;
var NormalizeIcon = require('react-icons/lib/fa/magic')
var WeightIcon = require('react-icons/lib/fa/balance-scale');
var Badge = require('material-ui').Badge;
var Slider = require('rc-slider');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var StatEngine = require('../../utils/StatEngine.js');

var MetricsAnalytics = React.createClass({
  mixins: [ FluxMixin ],
  getInitialState: function() {
    var stats = new StatEngine();
    var data = stats.getAggregateStats(this.props.scopeProperties, this.props.metricsColl);
    //var data = this.props.metricsColl.find({'entity_key' : 'chicago_bears'});
    var metrics = [];
    var formula = [];
    var formulaWeights = [];
    var formulaToggles = [];
    var name = "";
    console.log('analytics', this.props, this.props.kpiEdit);
    if (this.props.kpiEdit !== null) {
      var kpi = this.props.formulasColl.findOne({'id':this.props.kpiEdit});
      console.log('kpi looked', kpi);
      metrics = kpi.metrics;
      formula = kpi.formula;
      formulaWeights = kpi.formulaWeights;
      formulaToggles = kpi.formulaToggles;
      name = kpi.name;
    }
    return { name: name, data: data, metrics: metrics, formulaWeights: formulaWeights, formulaToggles: formulaToggles, currentInput: -1, formula: formula}
  },
  formatValue: function(cell, row) {
    if (cell < 1) {
      cell = cell * 100;
    }
    return (
      <span>{numberFormat(cell, 0)}</span>
    );
  },
  onRowSelect: function(row, isSelected) {
    if (isSelected) {
      this.setState({
        metrics: this.state.metrics.concat(row.metric)
      });
    } else {
      this.metrics = this.state.metrics;
      var metricToDelete = this.metrics.indexOf(row.metric);
      this.metrics.splice(metricToDelete, 1);
      this.setState({metrics: this.metrics});
    }
  },
  onSelectAll: function(isSelected) {
    console.log('all', isSelected);
  },
  handleMetricDrop: function(side, item, offset) {
    var width = document.getElementById('drop-box').offsetWidth;
    var x = offset.x;
    var middle = width / 2;
    if ( (x + 70) > middle ) {
      this.setState({
        formula: this.state.formula.concat(item.type),
        formulaWeights: this.state.formulaWeights.concat(100),
        formulaToggles: this.state.formulaToggles.concat(true),
        currentInput: this.state.formula.length
      });
    } else {
      this.setState({
        formula: [item.type].concat(this.state.formula),
        formulaWeights: [100].concat(this.state.formulaWeights),
        formulaToggles: [true].concat(this.state.formulaToggles),
        currentInput: this.state.formula.length
      });
    }
  },
  handleMetricSelect: function(index) {
    this.setState({ currentInput: index });
  },
  updateDrag: function() {},
  onSliderChange: function(value) {
    this.formulaWeights = this.state.formulaWeights;
    this.formulaWeights[this.state.currentInput] = value;
    this.setState({ formulaWeights: this.formulaWeights });
  },
  removeInput: function() {
    this.formula = this.state.formula;
    this.formulaWeights = this.state.formulaWeights;
    this.formulaToggles = this.state.formulaToggles;

    this.formulaWeights.splice(this.state.currentInput, 1);
    this.formulaToggles.splice(this.state.currentInput, 1);
    this.formula.splice(this.state.currentInput, 1);
    this.setState({
      formula: this.formula,
      formulaWeights: this.formulaWeights,
      formulaToggles: this.formulaToggles,
      currentInput: -1
    });
  },
  onToggle: function() {
    this.formulaToggles = this.state.formulaToggles;
    this.formulaToggles[this.state.currentInput] = !this.formulaToggles[this.state.currentInput];
    this.setState({ formulaToggles: this.formulaToggles });
  },
  renderFormula: function() {
    var iconSize = 32;
    var iconStyle = {
      cursor: 'move',
      display: 'inline-block'
    }
    return (
      <div>
      <div className="formula-toolbar">
        <Row>
        <Col md={12}>
        {this.state.metrics.map(function(metric) {
          return (
            <DragMetric className="formula-value" id={uuid.v4()} updateDrag={() => this.updateDrag()} dragType="value" text="+" key={uuid.v4()} type={metric}>
              <Chip
                key={uuid.v4()}
                className="formula-value"
                style={{cursor: 'move', marginLeft: 4, marginRight: 4}}
                >
                <Avatar size={10} style={{cursor: 'move' }} src={'/images/' + this.props.metricsColl.findOne({metric: metric }).icon} />
                {titleize(metric.split("_").join(" "))}
              </Chip>
            </DragMetric>
        );
      }.bind(this))}
      </Col>
      </Row>
      </div>

      <div className="formula-builder">
      <Row>
        <div style={{backgroundColor: Colors.MAIN, color: 'white', marginLeft: 15, marginRight: 15, marginTop: 15}} className="title med small-pad center ">Formula</div>
        {this.renderConfig()}
        <Col id="drop-box" md={12}>
          <DropMetric  className="drop-metric" dropType="side" onDrop={(item, offset) => this.handleMetricDrop('formula', item, offset)}>
            {this.state.formula.map(function(f, index) {
              if (['+', '-', '*', '/', '(', ')'].indexOf(f) >= 0) {
                var el = null;
                var size = 32;
                switch (f) {
                  case '+':
                    el = <PlusIcon  key={uuid.v4()} onTouchTap={() => this.handleMetricSelect(index)} size={size}/>
                  break;
                  case '-':
                    el = <MinusIcon key={uuid.v4()} onTouchTap={() => this.handleMetricSelect(index)} size={size} />
                  break;
                  case '/':
                    el = <DivideIcon key={uuid.v4()} onTouchTap={() => this.handleMetricSelect(index)} size={size} />
                  break;
                  case '*':
                    el = <MultiplyIcon  key={uuid.v4()} onTouchTap={() => this.handleMetricSelect(index)} size={size} />
                  break;
                  default:
                    el = <span key={uuid.v4()} onTouchTap={() => this.handleMetricSelect(index)} className="formula-operation">{f}</span>
                }
                //return el;
                return (
                <span key={uuid.v4()} className={(this.state.currentInput === index) ? "formula-selected" : "" }>
                  {el}
                </span>
              );
              } else {
                return (
                  <span key={uuid.v4()} className={(this.state.currentInput === index) ? "formula-selected" : ""}>
                  <Chip
                    key={uuid.v4()}
                    className="formula-value"
                    style={{cursor: 'pointer', margin: 4, display: 'inline-block'}}
                    onTouchTap={() => this.handleMetricSelect(index)}
                    >
                    <Avatar src={'/images/' + this.props.metricsColl.findOne({metric: f }).icon} />
                  {titleize(f.split("_").join(" "))}
                  </Chip>
                </span>
                )
              }
            }.bind(this))}
          </DropMetric>
        </Col>
      </Row>
      </div>
      </div>
    );
  },
  renderConfig: function() {
    var iconSize = 20;
    var iconStyle = {
      cursor: 'move',
      display: 'inline-block',
      color: Colors.DARK_BACKGROUND
    }
    if (this.state.currentInput == -1) return null;
    if (this.state.formula[this.state.currentInput].length == 1) {
      return (
        <Row>
          <Col md={9}></Col>
          <Col md={2}>
            <ListItem
              primaryText="Delete"
              disabled={true}
              onTouchTap={this.removeInput}
              rightIconButton={<IconButton onTouchTap={this.removeInput} style={{color: Colors.RED_BASE}}><RemoveIcon size={20}/></IconButton>}
              leftIcon={<DeleteIcon  />}
              />
          </Col>
          <Col md={1}></Col>
        </Row>
      );
    }
    return (
    <Row>
      <Col md={3} style={{margin: 0}}>
        <ListItem
          primaryText="Normalize"
          disabled={true}
          rightIcon={<Toggle onToggle={this.onToggle} toggled={this.state.formulaToggles[this.state.currentInput]} />}
          leftIcon={<NormalizeIcon />}
          />
      </Col>
      <Col md={4} style={{margin: 0}}>
        <ListItem
          primaryText={
            <Row>
              <Col md={3}>
                Weight
              </Col>
              <Col md={9}>
                <Slider style={{marginTop: 8}} value={this.state.formulaWeights[this.state.currentInput]} onChange={this.onSliderChange} />
              </Col>
            </Row>
          }
          disabled={true}
          leftIcon={<WeightIcon />}
          />
      </Col>
      <Col md={2} >
      <ListItem
        disabled={true}
        primaryText={
          <div>
            <DragMetric key={uuid.v4()} id={uuid.v4()} updateDrag={() => this.updateDrag()} dragType="operation" text="+" key={uuid.v4()} type={"+"}>
              <PlusIcon size={iconSize} style={iconStyle}/>
            </DragMetric>
            <DragMetric key={uuid.v4()} id={uuid.v4()} updateDrag={() => this.updateDrag()} dragType="operation" text="-" key={uuid.v4()} type={"-"}>
              <MinusIcon size={iconSize} style={iconStyle} />
            </DragMetric>
            <DragMetric id={uuid.v4()} key={uuid.v4()} updateDrag={() => this.updateDrag()} dragType="operation" text="/" key={uuid.v4()} type={"/"}>
              <DivideIcon size={iconSize} style={iconStyle} />
            </DragMetric>
            <DragMetric key={uuid.v4()} id={uuid.v4()} updateDrag={() => this.updateDrag()} dragType="operation" text="*" key={uuid.v4()} type={"*"}>
              <MultiplyIcon size={iconSize} style={iconStyle} />
            </DragMetric>
            <DragMetric key={uuid.v4()} id={uuid.v4()} updateDrag={() => this.updateDrag()} dragType="operation" text="(" key={uuid.v4()} type={"("}>
              <span className="formula-operation">(</span>
            </DragMetric>
            <DragMetric key={uuid.v4()} id={uuid.v4()} updateDrag={() => this.updateDrag()} dragType="operation" text=")" key={uuid.v4()} type={")"}>
              <span className="formula-operation">)</span>
            </DragMetric>
          </div>
        }
        />
      </Col>
      <Col md={2} style={{margin: 0}}>
        <ListItem
          primaryText="Delete"
          disabled={true}
          onTouchTap={this.removeInput}
          rightIconButton={<IconButton onTouchTap={this.removeInput} style={{color: Colors.RED_BASE}}><RemoveIcon size={20}/></IconButton>}
          leftIcon={<DeleteIcon  />}
          />
      </Col>
    </Row>
  );
  },
  handleSave: function() {
    console.log('props', this.props.params);
    if (this.props.kpiEdit !== null) {
      var doc = this.props.formulasColl.findOne({id: this.props.kpiEdit});
      doc.formula = this.state.formula;
      doc.name = this.state.name;
      doc.formulaWeights = this.state.formulaWeights;
      doc.formulaToggles = this.state.formulaToggles;
      doc.metrics = this.state.metrics;
      this.props.formulasColl.update(doc);
    } else {
      this.props.formulasColl.insert({
        name: this.state.name,
        id: uuid.v4(),
        formula: this.state.formula,
        context: this.props.contextId,
        formulaWeights: this.state.formulaWeights,
        formulaToggles: this.state.formulaToggles,
        metrics: this.state.metrics
      });
    }
    this.props.handleClose();
  },
  formatSource: function(cell, row) {
    return (
      <div>
        <Avatar size={20} src={'/images/' + this.props.metricsColl.findOne({source: cell}).icon} />
          <span>&nbsp;&nbsp;&nbsp;{cell}</span>
      </div>
    )
  },
  formatMetric: function(cell, row) {
    return (
      <span>{titleize(cell.split("_").join(" "))}</span>
    );
  },
  updateName: function(event) {
    this.setState({
      name: event.target.value
    });
  },
  render: function() {
    var selectRowProp = {
      mode: 'checkbox',
      clickToSelect: true,
      //bgColor: 'rgb(238, 193, 213)',
      bgColor: '#96dee8',
      onSelect: this.onRowSelect,
      onSelectAll: this.onSelectAll
    };
    return (
    <Grid>
      <Row style={{marginTop: 15, marginBottom: 15}}>
        <span className="text-fix dark med">KPI Name:&nbsp;&nbsp;&nbsp;</span><TextField hintText="Enter Name" value={this.state.name} onChange={this.updateName} fullWidth={false} />
      </Row>
      <Row>
      </Row>
      <Row>
          {this.renderFormula()}
      </Row>
      <Row style={{marginTop: 10}}>
        <BootstrapTable
          selectRow={selectRowProp}
          trClassName="formula-table"
          search={true}
          data={this.state.data}
          height="250"
        >
          <TableHeaderColumn
            dataField="id"
            isKey={true}
            hidden={true}
            >
            ID
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="source"
            dataFormat={this.formatSource}
            dataSort={true}
            columnClassName="formula-table-column"
            >
            Source
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="metric"
            dataSort={true}
            dataFormat={this.formatMetric}
            columnClassName="formula-table-column"
            >
            Metric
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="mean"
            dataFormat={this.formatValue}
            columnClassName="formula-table-column"
            dataSort={true}
          >
          Mean
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="min"
            dataFormat={this.formatValue}
            columnClassName="formula-table-column"
            dataSort={true}
          >
          Min
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="max"
            dataFormat={this.formatValue}
            columnClassName="formula-table-column"
            dataSort={true}
          >
          Max
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="median"
            dataFormat={this.formatValue}
            columnClassName="formula-table-column"
            dataSort={true}
          >
          Median
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="mode"
            dataFormat={this.formatValue}
            columnClassName="formula-table-column"
            dataSort={true}
          >
          Mode
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="variance"
            hidden={true}
            dataFormat={this.formatValue}
            columnClassName="formula-table-column"
            dataSort={true}
          >
          Var
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="stdev"
            hidden={true}
            dataFormat={this.formatValue}
            columnClassName="formula-table-column"
            dataSort={true}
          >
          StDev
          </TableHeaderColumn>
        </BootstrapTable>
      </Row>
      <Row style={{marginTop: "20px"}}>
        <Col md={9}>
        </Col>
        <Col md={1}>
          <FlatButton
            label="Cancel"
            primary={false}
            onTouchTap={this.props.handleClose}
            />
        </Col>
        <Col md={1}>
          <FlatButton
            label="Save"
            primary={false}
            onTouchTap={this.handleSave}
            />
        </Col>
      </Row>
      </Grid>
    );
  }
});
//        <span className="text-fix dark small">Inputs:&nbsp;&nbsp;</span>

module.exports = DragDropContext(HTML5Backend)(MetricsAnalytics);
