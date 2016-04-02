var React = require('react'),
		Card = require('material-ui').Card,
		CardActions = require('material-ui').CardActions,
		Grid = require('react-bootstrap').Grid,
		CardHeader = require('material-ui').CardHeader,
		CardMedia = require('material-ui').CardMedia,
		CardTitle = require('material-ui').CardTitle,
		FlatButton = require('material-ui').FlatButton,
		CardText = require('material-ui').CardText,
		Row = require('react-bootstrap').Row,
		Col = require('react-bootstrap').Col,
		Icon = require('react-materialize').Icon,
		AccountIcon = require('react-icons/lib/md/account-circle'),
		TextField = require('material-ui').TextField;



var LoginPage = React.createClass({
	render: function() {
		var loginStyle = {
			height: "300px",
			width: "300px",
			marginRight: "20px"
			//marginLeft: "25%",
			//marginRight: "25%",
			//marginTop: "300px",
			//padding: "40px"
		}
		return (
			<div className="centered">
				<Grid>
				<Card style={loginStyle}>
					<Row>
						<Col md={2}>
							<AccountIcon style={{height: "30px", width: "30px"}}/>
						</Col>
						<Col md={4}>
							<TextField
								style={{marginRight: "20px"}}
								hintText="Username"
								/>
						</Col>
					</Row>
				</Card>
				</Grid>
			</div>
		)
	}

});


module.exports = LoginPage;
