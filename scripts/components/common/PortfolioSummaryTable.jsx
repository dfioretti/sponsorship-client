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
var Avatar = require('material-ui').Avatar;

var PortfolioSummaryTable = React.createClass({
    formatAvatar: function(cell, row) {
        return <Avatar src={cell} size={30} />
    },
    render: function() {
        return (
            <BootstrapTable
                data={this.props.data}
                ref="companyTable"
                height={"275"}
                >
                <TableHeaderColumn
                dataField="id"
                isKey={true}
                hidden={true}
                >
                ID
                </TableHeaderColumn>
                <TableHeaderColumn
                dataField="image_url"
                dataFormat={this.formatAvatar}
                width="40"
                >
                </TableHeaderColumn>
                <TableHeaderColumn
                dataField="name"
                dataSort={true}
                >
                Property
                </TableHeaderColumn>
                <TableHeaderColumn
                dataField="scope"
                dataSort={true}
                >
                Scope
                </TableHeaderColumn>
               <TableHeaderColumn
                dataField="category"
                dataSort={true}
                >
                Category
                </TableHeaderColumn>
                  <TableHeaderColumn
                dataField="subcategory"
                dataSort={true}
                >
                Subcategory
                </TableHeaderColumn>
                    <TableHeaderColumn
                dataField="pretty_renewal"
                dataSort={true}
                >
                Renewal Date
                </TableHeaderColumn>
                    <TableHeaderColumn
                dataField="pretty_term"
                dataSort={true}
                >
                Contract Term
                </TableHeaderColumn>
                <TableHeaderColumn
                dataField="pretty_cost"
                dataSort={true}
                >
                Cost
                </TableHeaderColumn>

               
            </BootstrapTable>
        )
    }
});

module.exports = PortfolioSummaryTable;
