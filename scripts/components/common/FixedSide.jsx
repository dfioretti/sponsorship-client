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


var FixedSide = React.createClass({
	mixins: [ Navigation ],

	goHome: function() {
		this.transitionTo('portfolio');
	},
	goScope: function() {
		this.transitionTo('analyze');
	},
	renderContexts: function(context) {
		//				<Link style={{color: "white"}} to={'/apt/dashboard/' + d.id}>

		return (
			<li key={context.id}>
				<Link key={context.id} style={{color: "white"}} to={'/analyze/'+ context.id}>{context.name}</Link>
			</li>
		);
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
		return (
			<div>
				<div style={{width: "100%", marginTop: "10px"}}>
					<img style={{display: 'block', margin: 'auto', width: "37px", height: "36px"}}
						src={'/images/login/teneo-white.png'}
						/>
				</div>
				<div style={{width: "100%", marginTop: "40px"}}>
					<IconButton onTouchTap={this.goHome} style={buttonStyle} >
						<HomeIcon size={35} />
					</IconButton>
					<h6 style={textStyle}>Home</h6>
					<IconButton onTouchTap={this.goHome} style={buttonStyle} >
						<AddIcon size={35} />
					</IconButton>
					<h6 style={textStyle}>New</h6>
					<IconButton onTouchTap={this.goScope} style={buttonStyle} >
						<AssessIcon size={35} />
					</IconButton>
					<h6 style={textStyle}>Analyze</h6>
				</div>
				<ul>
					{this.props.contexts.map(this.renderContexts, this)}
				</ul>
			</div>
		);
	}

});

module.exports = FixedSide;
