var React = require('react');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var ScopeTab = require('../common/ScopeTab.jsx');
var ScoreTab = require('../common/ScoreTab.jsx');
var DashboardTab = require('../common/DashboardTab.jsx');
var Colors = require('../../constants/colors.js');
var FlatButton = require('material-ui').FlatButton;
var Grid = require('react-bootstrap').Grid;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;


var Assessment = React.createClass({
    mixins: [FluxMixin],
    getInitialState: function() {
        return { activeTab: 'scope' }
    },
    tabChange: function(key, e) {
		this.setState({ activeTab: key });
	},
    renderContent: function() {
        switch(this.state.activeTab) {
            case 'scope':
                return <ScopeTab cid={this.props.params.id} />
            case 'evaluate':
                return <ScoreTab cid={this.props.params.id} />
            default:
                return <DashboardTab cid={this.props.params.id} />
        }
    },
    render: function() {
        var tabStyle = { fontSize: 12, letterSpacing: 1.5 };
		var scopeKey = "scope";
		var colStyle={ backgroundColor: Colors.WHITE, margin: 0, padding: 0 };
		var buttonStyle = { color: "white", width: "100%" };
		var inactiveStyle = { height: 2, backgroundColor: Colors.MAIN, width: "100%" };
		var activeStyle = { height: 2, backgroundColor: Colors.SECONDARY, width: "100%" };
        var labelStyle = { fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', paddingTop: 0 };

        return (
			<div>
				<Row style={{margin: 0, padding: 0}}>
					<div style={{textTransform: 'uppercase', fontSize: 16, fontWeight: 700, letterSpacing: '1.5px', backgroundColor: 'white', paddingTop: 7, paddingBottom: 0, paddingLeft: 20, marginBottom: -1, color: Colors.MAIN}}>{this.state.scopeName}</div>
					<Col style={{backgroundColor: Colors.WHITE, margin: 0, padding: 0}} key={scopeKey}  md={4}>
						<FlatButton rippleColor="transparent" backgroundColor={Colors.WHITE} labelStyle={labelStyle} hoverColor={Colors.WHITE} style={{color: Colors.MAIN, width: "100%", padding: 0, margin: 0, marginTop: 0, height: 30, fontSize: 10}} onTouchTap={this.tabChange.bind(this, scopeKey)} label="Scope" />
						<div style={(this.state.activeTab == 'scope') ? activeStyle : inactiveStyle} />
					</Col>
					<Col md={4} style={colStyle}>
						<FlatButton rippleColor="transparent" backgroundColor={Colors.WHITE} labelStyle={labelStyle} hoverColor={Colors.WHITE} style={{color: Colors.MAIN, padding: 0, margin: 0, height: 30, marginTop: 0, width: "100%"}} onTouchTap={this.tabChange.bind(this, "evaluate")} label="Evaluate" />
						<div style={(this.state.activeTab == 'evaluate') ? activeStyle : inactiveStyle} />
					</Col>
					<Col style={colStyle} md={4}>
						<FlatButton rippleColor="transparent" backgroundColor={Colors.WHITE} labelStyle={labelStyle} hoverColor={Colors.WHITE} style={{color: Colors.MAIN, width: "100%", padding: 0, margin: 0, marginTop: 0, height: 30, fontSize: 10}} onTouchTap={this.tabChange.bind(this, "analyze")} label="Visualize" />
						<div style={(this.state.activeTab == 'visualize') ? activeStyle : inactiveStyle} />
					</Col>
				</Row>
                {this.renderContent()}
			</div>
        );
    }
});

module.exports = Assessment;