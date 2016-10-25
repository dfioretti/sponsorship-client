var React = require('react');
var Dialog = require('material-ui').Dialog;
var FloatingActionButton = require('material-ui').FloatingActionButton;
var FlatButton = require('material-ui').FlatButton;
var VisualizationDialog = require('./VisualizationDialog.jsx');
var Grid = require('react-bootstrap').Grid;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var AddIcon = require('react-icons/lib/md/add');
var Colors = require('../../constants/colors.js');
var Fluxxor = require('fluxxor');
var DashboardGrid = require('./DashboardGrid.jsx');
var FluxMixin = Fluxxor.FluxMixin(React);
var uuid = require('node-uuid');

var contextRecord;

var DashboardTab = React.createClass({
    mixins: [FluxMixin],

    getInitialState: function() {
		contextRecord = this.getFlux().store("DocumentStore").getContext(this.props.cid);
		var currentAssets = [];
		var allProperties = this.getFlux().store("DocumentStore").getProperties({});//propertiesColl.find();
		contextRecord.scopeProperties.map(function(p) {
			currentAssets.push(this.getFlux().store("DocumentStore").getProperty({entity_key: p}));
		}.bind(this));
        console.log("current assets", currentAssets);
        return { showError: false, dialogOpen: false, assets: currentAssets}
    },
    closeError: function() {
        this.setState({
            showError: false
        });
    },
    doSave: function(data) {
        var elements = contextRecord.elements;
        var id = uuid.v4();
        elements['key-' + id] = {
            chartType: data.chartType.toLowerCase(),
            properties: data.chipData,
            dataPoints: data.dataChips,
            title: data.chartName
        };
        contextRecord.elements = elements;
        var items = (typeof(contextRecord.items) == 'undefined') ? [] : contextRecord.items; 
        contextRecord.items = items.concat({
            i: 'key-' + id,
            x: items.length * 2 % 12,
            y: Infinity,
            w: 6,
            minH: 4,
            mindW: 4,
            h: 6,
            data: data
        }),
        this.setState({ dialogOpen: false});
        this.getFlux().store("DocumentStore").saveDatabase();
    },
    handleClose: function() {
        this.setState({
            dialogOpen: false
        });
    },
    commitDashboardUpdate: function(layout) {
        contextRecord.items = layout;
        this.getFlux().store("DocumentStore").saveDatabase();
    },
    onAnalyzeAdd: function() {
        if (contextRecord.scopeProperties.length == 0) {
            this.setState({
                showError: true
            });
        } else {
            this.setState({ dialogOpen: true});
        }
    },
    render: function() {
        return (
        <Grid fluid={true}>
	        <Dialog
		        title="Error!"
				open={this.state.showError}
				actions={<FlatButton label="OK" onTouchTap={this.closeError} />}
				>
			    No properties selected, please define a scope!
			</Dialog>
            <Dialog
                title="Visualization"
                modal={true}
                open={this.state.dialogOpen}
                onRequestClose={this.handleClose}
                autoScrollBodyContent={true}
                contentStyle={{width: "75%", height: "900px", maxWidth: 'none'}}
             >
             <VisualizationDialog handleClose={this.handleClose} doSave={this.doSave} assets={this.state.assets} />
             </Dialog>
		    <FloatingActionButton backgroundColor={Colors.SECONDARY} style={{float: 'right', marginTop: -30}} mini={false} onTouchTap={this.onAnalyzeAdd}>
		        <AddIcon size={30} />
			</FloatingActionButton>
			<Row>
		        <Col md={12} style={{marginTop: 10, paddingTop: 0, position: 'absolute'}}>
				    <DashboardGrid persistDashboard={this.commitDashboardUpdate} metricsColl={this.getFlux().store("DocumentStore").getState().metricsColl} elements={contextRecord.elements} items={contextRecord.items} className="layout" rowHeight={50} cols={{lg: 24, md: 18, sm: 12, xs: 10, xxs: 6}} onBreakpointChange={this.onBreakpointChange}  />
				</Col>
			</Row>
	    </Grid>
        );
    }
});

module.exports = DashboardTab;