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
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;


var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var HomePage = React.createClass({
	mixins: [FluxMixin, Navigation, StoreWatchMixin("AssetsStore")],

	componentWillMount: function() {
	//	this.getFlux().actions.setCurrentNav("home", null);
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
		for (var i = 0; i < 9; i++ ) {
			list.pop();
		}
		return list;
	},
	handleLogin: function(e) {
		this.transitionTo('/account_login');
	},
	render: function() {
		var style = {
  		height: 300,
		  width: 300,
		  textAlign: 'center',
		  display: 'flex',
			marginTop: 25,
			justifyContent: 'center'
		};
		var headingText = {
			fontSize: 18,
			color: 'white',
			textTransform: 'uppercase',
			marginTop: 25,
			letterSpacing: 2
		}
		var whiteHeading = {
			fontSize: 24,
			textTransform: 'uppercase',
			marginTop: 25,
			color: "#03387a",
			textAlign: 'center',
			letterSpacing: 2
		}
		var subHeadingText = {
			fontSize: 14,
			color: 'white',
			textTransform: 'uppercase',
			marginTop: 25,
			fontFamily: 'Avenir-Book',
			textAlign: 'center',
			letterSpacing: 2
		}
		var subWhite = {
			fontSize: 14,
			color: "#03387a",
			textTransform: 'uppercase',
			marginTop: 25,
			width: 550,
			fontFamily: 'Avenir-Book',
			textAlign: 'center',
			letterSpacing: 2
		}
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
						<div style={{display: 'flex', justifyContent: 'center', paddingTop: 20, paddingBottom: 20 }}>
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
					<CardText style={{backgroundColor: "#03387a"}}>
						<Row>
							<Col style={{display: 'flex', justifyContent: 'center'}} md={4}>
								<h4 style={headingText}>INTERACTIVE SCORE MODELING</h4>
							</Col>
							<Col style={{display: 'flex', justifyContent: 'center'}} md={4}>
								<h4 style={headingText}>DYNAMIC DASHBOARD CONTENT</h4>
							</Col>
							<Col style={{display: 'flex', justifyContent: 'center'}} md={4}>
								<h4 style={headingText}>CUSTOM ANALYTICS AND REPORTING</h4>
							</Col>
						</Row>
						<Row>
							<Col style={{display: 'flex', justifyContent: 'center'}} md={4}>
								<Paper style={style} zDepth={4} circle={true}>
									<img style={{height: 294, width: 294, marginTop: 3, borderRadius: "50%"}}src={"/images/login/score.png"} />
								</Paper>
							</Col>
							<Col style={{display: 'flex', justifyContent: 'center'}} md={4}>
								<Paper style={style} zDepth={4} circle={true}>
									<img style={{height: 294, width: 294, marginTop: 3, borderRadius: "50%"}}src={"/images/login/dashboard.png"} />
								</Paper>
							</Col>
							<Col style={{display: 'flex', justifyContent: 'center'}} md={4}>
								<Paper style={style} zDepth={4} circle={true}>
									<img style={{height: 294, width: 294, marginTop: 3, borderRadius: "50%"}}src={"/images/login/builder.png"} />
								</Paper>
							</Col>
						</Row>
						<Row>
							<Col style={{display: 'flex', justifyContent: 'center'}} md={4}>
								<h4 style={subHeadingText}>Build custom analytical models to evaluate assets based on your business drivers.</h4>
							</Col>
							<Col style={{display: 'flex', justifyContent: 'center'}} md={4}>
								<h4 style={subHeadingText}>Bring real-time data to your fingertips with dynamic dashboards.</h4>
							</Col>
							<Col style={{display: 'flex', justifyContent: 'center'}} md={4}>
								<h4 style={subHeadingText}>Expose new insights with custom charting for effortless asset comparisons.</h4>
							</Col>
						</Row>
					</CardText>

					<CardText style={{paddingBottom: 25 }} >
						<h4 style={whiteHeading}>Build your marketing portfolio and track prospective opportunities</h4>
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

/*
<CardText>
	<Row>
		<Col md={12}>
			<h4 style={whiteHeading}>Powered by exclusive insights and data</h4>
		</Col>
	</Row>
	<Row style={{marginTop: 50}}>
		<Col style={{display: 'flex', justifyContent: 'center'}} md={6}>
				<img style={{ height: 125 }}src={"/images/login/teneo-intel.png"} />
		</Col>
		<Col style={{display: 'flex', justifyContent: 'center'}} md={6}>
				<img style={{ height: 90, marginTop: 17 }}src={"/images/login/first-data.png"} />
		</Col>
	</Row>
	<Row>
		<Col style={{ display: 'flex', justifyContent: 'center'}} md={6}>
			<h4 style={subWhite}>Leverage the power of teneo intelligence's expertise.
				Teneo intelligence monitors the global market of political risk, business markets,
				economic indicators and corporate risk.</h4>
		</Col>
		<Col style={{display: 'flex', justifyContent: 'center'}} md={6}>
			<h4 style={subWhite}>Integrate First Data's national spend data set which
				covers over 800 million card holders to identify and target
				your brand's customers.</h4>
		</Col>
	</Row>
</CardText>
*/

module.exports = HomePage;
