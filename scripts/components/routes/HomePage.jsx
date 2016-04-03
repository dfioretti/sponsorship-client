var React = require('react');
var Card = require('material-ui').Card;
var AppBar = require('material-ui').AppBar;
var CardMedia = require('material-ui').CardMedia;
var CardTitle = require('material-ui').CardTitle;
var CardText = require('material-ui').CardText;
var Fluxxor = require('fluxxor');
var GridList = require('material-ui').GridList;
var GridTile = require('material-ui').GridTile;
var Paper = require('material-ui').Paper;
var FlatButton = require('material-ui').FlatButton;
var Navigation = require('react-router').Navigation;
var RaisedButton = require('material-ui').RaisedButton;

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var HomePage = React.createClass({
	mixins: [FluxMixin, Navigation, StoreWatchMixin("AssetsStore")],

	componentWillMount: function() {
		this.getFlux().actions.setCurrentNav("home", null);
		if (!this.state.assetsLoaded && !this.state.loading) {
			this.getFlux().actions.loadAssets();
		}
	},
	getInitialState: function() {
		return {};
	},
	getStateFromFlux: function() {
		return this.getFlux().store("AssetsStore").getState();
	},
	getGridIcons: function() {
		if (typeof(this.state.assets) === 'undefined') return [];
		var list = [];
		this.state.assets.forEach(function(asset) {
			list.push(
				<GridTile
					key={asset.id}
					style={{margin: 5, height: 75, width: 75}}
					>
					<img style={{height: 70, width: 70, borderRadius: "50%"}} src={asset.image} />
				</GridTile>
			)
		});
		return list;
	},
	handleLogin: function(e) {
		console.log("ev", e);
		this.transitionTo('/account_login');
	},
	render: function() {
		var style = {
  		height: 400,
		  width: 400,
		  margin: 20,
		  textAlign: 'center',
		  display: 'inline-block',
		};
		/*
		<AppBar
			title={<span style={{color: '#4a4a4a', textTransform: 'uppercase', letterSpacing: '3px' }}>Teneo</span>}
			style={{ backgroundColor: "white" }}
			showMenuIconButton={false}
			iconElementRight={<RaisedButton labelColor={'white'} backgroundColor={'#03387a'} label="Login"  />}
			/>
		*/
		return (
			<Card>

					<CardMedia
						>
						<img src={"/images/login/login-edit.jpg"} />
					</CardMedia>
					<CardText>
						<div style={{display: 'flex', justifyContent: 'center' }}>
							<RaisedButton
								labelColor={'white'}
								backgroundColor={'#03387a'}
								onMouseUp={this.handleLogin}
								label="LOGIN" />
							&nbsp;&nbsp;&nbsp;
							<RaisedButton
								label="LEARN MORE"
								linkButton={true}
								href="http://teneoholdings.com"
								/>
						</div>
					</CardText>
					<CardText style={{backgroundColor: '#03387a'}}>
						<span style={{marginRight: 200, color: 'white', textTransform: 'uppercase', letterSpacing: '2px', fontSize: 24, width: 300, heigth: 400, marginLeft: 300}}>
							Dynamic dashboard content
						</span>
						<Paper style={style} zDepth={4} circle={true}>
							<img style={{height: 400, width: 400, borderRadius: "50%"}}src={"/images/login/dashboard.png"} />
						</Paper>
					</CardText>
					<CardText>
						<Paper style={style} zDepth={4} circle={true}>
							<img style={{height: 400, width: 400, borderRadius: "50%"}}src={"/images/login/score.png"} />
						</Paper>
						<span style={{textTransform: 'uppercase', letterSpacing: '2px', fontSize: 24, width: 600, heigth: 400, marginLeft: 200}}>
							Interactive Score Modeling
						</span>
					</CardText>

					<CardText>
						<GridList
							cols={18}
							cellHeight={80}
							style={{width: '100%', height: 520, overflowY: 'auto'}}
							>
							{this.getGridIcons()}
						</GridList>
					</CardText>
			</Card>
		)
	}

});

module.exports = HomePage;
