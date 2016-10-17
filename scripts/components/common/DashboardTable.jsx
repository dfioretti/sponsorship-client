var React = require('react');

var ReactBsTable = require('react-bootstrap-table');
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Grid = require('react-bootstrap').Grid;
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var titleize = require('underscore.string/titleize');
var numberFormat = require('underscore.string/numberFormat');
var IconButton = require('material-ui').IconButton;
var DownloadIcon = require('react-icons/lib/md/file-download');
var TextField = require('material-ui').TextField;
var Colors = require('../../constants/colors.js');

var DashboardTable = React.createClass({

  getInitialState: function() {
    var data = this.props.metricsColl.chain().find().data();
    return { data: data, searchText: "" }
  },
  formatKey: function(cell, row) {
    return (
      <span>{titleize(cell.split("_").join(" "))}</span>
    )
  },
  formatNumer: function(cell, row) {
    if (cell < 0) {
      return (
        <span>{numberFormat(cell, 2)}</span>
      );
    }
    return (
      <span>{numberFormat(cell, 0)}</span>
    );
  },
  handleSearchChange: function(event) {
    this.refs.dashTable.handleSearch(event.target.value);
  },
  downloadCSV: function() {
    console.log('called down');
    this.refs.dashTable.handleExportCSV();
  },
  render: function() {
    return (
      <div>
        <Row>
          <Col md={4} style={{marginLeft: 20}}>
            <TextField  hintText="Search" onChange={this.handleSearchChange}></TextField>
          </Col>
          <Col md={1} mdPush={6}>
            <IconButton style={{color: Colors.MAIN}} onTouchTap={this.downloadCSV}><DownloadIcon style={{color: Colors.MAIN}} size={20}/></IconButton>
          </Col>
        </Row>

      <BootstrapTable
        data={this.state.data}
        ref="dashTable"
        height={"" + (this.props.height - 5)+ ""}
        headerStyle={{textTransform: 'uppercase', letterSpacing: '1.5px'}}
        tableStyle={{borderStyle: 'none'}}
        containerStyle={{borderStyle: 'none'}}
        bodyStyle={{borderStyle: 'none'}}
        >
        <TableHeaderColumn
          dataField="id"
          isKey={true}
          hidden={true}
          >
            ID
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="entity_key"
          dataFormat={this.formatKey}
          dataSort={true}
          >
          Property
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="source"
          dataSort={true}
          >
          Source
        </TableHeaderColumn>
        <TableHeaderColumn
          dataSort={true}
          dataFormat={this.formatKey}
          dataField="metric">
          Metric
        </TableHeaderColumn>
        <TableHeaderColumn
          dataSort={true}
          dataFormat={this.formatNumer}
          dataField="value">
          Value
        </TableHeaderColumn>
      </BootstrapTable>
      </div>
    );
  }

});

module.exports = DashboardTable;
