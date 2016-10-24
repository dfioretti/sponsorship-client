var React = require('react');
var Row = require('react-bootstrap').Row;
var Colors = require('../../constants/colors.js');
var Col = require('react-bootstrap').Col;
var IconButton = require('material-ui').IconButton;
var HomeIcon = require('react-icons/lib/md/home');
var AddIcon = require('react-icons/lib/md/add');
var AssessIcon = require('react-icons/lib/md/assessment');
var Navigation = require('react-router').Navigation;
var Link = require('react-router').Link;
var IconMenu = require('material-ui').IconMenu;
var MenuItem = require('material-ui').MenuItem;
var Dialog = require('material-ui').Dialog;
var FlatButton = require('material-ui').FlatButton;
var Stepper = require('material-ui').Stepper;
var Step = require('material-ui').Step;
var uuid = require('node-uuid');
var StepLabel = require('material-ui').StepLabel;
var TextField = require('material-ui').TextField;
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var DashboardClient = require('../../clients/dashboard_client.js');



var FixedSide = React.createClass({
	mixins: [ FluxMixin, Navigation ],

	componentWillMount: function() {
		/*
		var home = this.getFlux().store("DashboardHomeStore").getState();
		if (!home.dashboardsLoaded && !home.loading) {
			this.getFlux().actions.loadDashboards();
		}
		*/
	},
	getInitialState: function() {
		return { valueScopes: 1, dialogOpen: false, assessmentName: "" }
	},
	newAssessment: function(ev) {
		this.setState({
			dialogOpen: true
		});
	},
	goHome: function() {
		this.transitionTo('portfolio');
	},
	goScope: function() {
		this.transitionTo('analyze');
	},
	/*
	getStateFromFlux: function() {
		return this.getFlux().store("DashboardHomeStore").getState();
	},
	*/
	renderEmpty: function() {
		return (
			<MenuItem
				style={{fontSize: 10, backgroundColor: Colors.DARK_BACKGROUND, color: Colors.WHITE, textTransform: 'uppercase', letterSpacing: '1.5', fontFamily: 'Avenir-Book'}}
				primaryText={"No Assessments"}
				disabled={true}
				/>
		);
	},
	renderContexts: function(context) {
		return (
			<MenuItem
				style={{fontSize: 10, backgroundColor: Colors.DARK_BACKGROUND, color: Colors.WHITE, textTransform: 'uppercase', letterSpacing: '1.5', fontFamily: "Avenir-Book"}}
				value={context.cid}
				key={context.cid}
				primaryText={context.name}
				/>
		);
	},
	handleClose: function(event) {
		this.setState({
			dialogOpen: false
		});
	},
	handleChange: function(event, value) {
		this.transitionTo('/assessment/' + value);
	},
	handleSave: function(event) {
		var cid = uuid.v4();
		var context = {
			scopeProperties: [],
			layout: [],
			elements: {},
			activeTab: 'scope',
			cid: cid,
			name: this.state.assessmentName
		};
		this.props.contextCollection.insert(context);
		this.transitionTo('/assessment/' + cid);
		/*
		var context = [];
		var layout = [];
		var dashboard = {
			company_id: 5555,
			name: this.state.assessmentName,
			kind: 'context',
			state: {
				context: [],
				layout: [],//new Array(),
				elements: {},
				formulas: [],//new Array(),
				activeTab: 'scope'
			}
		}
		DashboardClient.createDashboard(dashboard, function(data) {
			this.setState({ dialogOpen: false, assessmentName: ''});
			var documentStore = this.getFlux().store("DocumentStore").getState();
			documentStore.contextCollection.insert(data);
			this.getFlux().store("DashboardHomeStore").onContextCreateSuccess({dashboard: data});
			this.transitionTo('/analyze/' + data.id);
		}.bind(this));
		*/
	},
	handleTextUpdate: function(event, value) {
		this.setState({
			assessmentName: value
		});
	},
	render: function() {
		var buttonStyle = {
			color: '#FFFEFF',//'#73879C',//Colors.WHITE,
			width: 70,
			height: 70,
			padding: 0
		}
		var textStyle = {
			textTransform: 'uppercase',
			letterSpacing: '1.5px',
			color: '#FFFEFF', //'#73879C',//Colors.WHITE,
			textAlign: 'center',
			width: '100%',
			marginTop: -10,
			fontSize: 10
		}
		var actions = [
			<FlatButton
				label="Cancel"
				primary={true}
				onTouchTap={this.handleClose}
				/>,
			<FlatButton
				label="Save"
				primary={true}
				onTouchTap={this.handleSave}
				/>
		];
		return (
			<div>
				<Dialog
					title="Create Assessment"
					open={this.state.dialogOpen}
					actions={actions}
					modal={true}
					onRequestClose={this.handleClose}
					>
					<div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
						<Stepper activeStep={0}>
							<Step>
								<StepLabel>Create New Assessment</StepLabel>
							</Step>
							<Step>
								<StepLabel>Define Scope Properties</StepLabel>
							</Step>
							<Step>
								<StepLabel>Visualze Data</StepLabel>
							</Step>
							<Step>
								<StepLabel>Model Analytics</StepLabel>
							</Step>
						</Stepper>
					</div>
					<Row>
						<Col md={1}></Col>
						<Col md={10}>
							<TextField value={this.state.assessmentName} onChange={this.handleTextUpdate} fullWidth={true} hintText="Assessment Name" floatingLabelText="Assessment Name"/>
						</Col>
						<Col md={1}></Col>
					</Row>
				</Dialog>
				<div style={{width: "100%", marginTop: "18px"}}>
					<img style={{display: 'block', margin: 'auto', width: "24px", height: "24px"}}
						src={'/images/login/teneo-white.png'}
						/>
				</div>
				<div style={{width: "100%", marginTop: "40px"}}>
					<IconButton onTouchTap={this.goHome} style={buttonStyle} >
						<HomeIcon size={35} />
					</IconButton>
					<h6 style={textStyle}>Home</h6>
					<IconButton onTouchTap={this.newAssessment} style={buttonStyle} >
						<AddIcon size={35} />
					</IconButton>
					<h6 style={textStyle}>New</h6>
					<IconMenu
						menuStyle={{backgroundColor: Colors.DARK_BACKGROUND}}
						iconButtonElement={<IconButton style={buttonStyle}><AssessIcon size={35} /></IconButton>}
						anchorOrigin={{vertical: 'top', horizontal: 'right'}}
						onChange={this.handleChange}
						>
						{(this.props.contextCollection.find().length > 0) ? this.props.contextCollection.find().map(this.renderContexts, this) : this.renderEmpty()}
					</IconMenu>
					<h6 style={{marginTop: -10, fontSize: 10, color: '#FFFEFF', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1.5'}}>Analyze</h6>
				</div>
			</div>
		);
	}

});

module.exports = FixedSide;
