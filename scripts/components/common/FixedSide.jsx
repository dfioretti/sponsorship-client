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


var FixedSide = React.createClass({
	mixins: [ Navigation ],
	getInitialState: function() {
		return { valueScopes: 1 }
	},

	goHome: function() {
		this.transitionTo('portfolio');
	},
	goScope: function() {
		this.transitionTo('analyze');
	},
	renderContexts: function(context) {
		//				<Link style={{color: "white"}} to={'/apt/dashboard/' + d.id}>
		return (
			<MenuItem
				style={{fontSize: 10, backgroundColor: Colors.DARK_BACKGROUND, color: Colors.WHITE, textTransform: 'uppercase', letterSpacing: '1.5', fontFamily: "Avenir-Book"}}
				value={context.id}
				key={context.id}
				primaryText={context.name}
				/>
		);
/*
		return (
			<li key={context.id}>
				<Link key={context.id} style={{color: "white"}} to={'/analyze/'+ context.id}>{context.name}</Link>
			</li>
		);
		*/
	},
	handleChange: function(event, value) {
		console.log("change", event, value);
		this.transitionTo('/analyze/' + value);
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
					<IconButton onTouchTap={this.goHome} style={buttonStyle} >
						<AddIcon size={35} />
					</IconButton>
					<h6 style={textStyle}>New</h6>

					<IconMenu
						menuStyle={{backgroundColor: Colors.DARK_BACKGROUND}}
						iconButtonElement={
							<IconButton style={buttonStyle}><AssessIcon size={35} /></IconButton>
						}
						anchorOrigin={{vertical: 'top', horizontal: 'right'}}
						onChange={this.handleChange}
						>
						{this.props.contexts.map(this.renderContexts, this)}
					</IconMenu>
					<h6 style={{marginTop: -10, fontSize: 10, color: '#FFFEFF', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1.5'}}>Analyze</h6>
				</div>
			</div>
		);
	}

});
/*
<ul>
	{this.props.contexts.map(this.renderContexts, this)}
</ul>
*/

module.exports = FixedSide;
