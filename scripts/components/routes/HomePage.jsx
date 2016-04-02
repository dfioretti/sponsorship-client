var React = require('react');
var Card = require('material-ui').Card;
var CardMedia = require('material-ui').CardMedia;
var CardTitle = require('material-ui').CardTitle;
var CardText = require('material-ui').CardText;
var Fluxxor = require('fluxxor');
var GridList = require('material-ui').GridList;
var GridTile = require('material-ui').GridTile;
var Paper = require('material-ui').Paper;
var FlatButton = require('material-ui').FlatButton;

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var HomePage = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("AssetsStore")],

	componentWillMount: function() {
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
					>
					<img style={{height: 75, width: 75, borderRadius: "50%"}} src={asset.image} />
				</GridTile>
			)
		});
		return list;
	},
	render: function() {
		var style = {
  		height: 400,
		  width: 400,
		  margin: 20,
		  textAlign: 'center',
		  display: 'inline-block',
		};
		return (
			<Card>
					<CardMedia
						>
						<img src={"/images/login/login-edit.jpg"} />
					</CardMedia>
					<CardText>
						<div style={{display: 'flex', justifyContent: 'center' }}>
							<FlatButton primary={true} label="LOGIN" />
							<FlatButton label="LEARN MORE" />
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
							cols={20}
							cellHeight={75}
							style={{width: '100%', height: 400, overflowY: 'auto'}}
							>
							{this.getGridIcons()}
						</GridList>
					</CardText>
			</Card>
		)
	}

});

module.exports = HomePage;
