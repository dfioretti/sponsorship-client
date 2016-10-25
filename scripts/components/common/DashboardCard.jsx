var React = require('react');
var Paper = require('material-ui').Paper;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Colors = require('../../constants/colors.js');

var DashboardCard = React.createClass({
  render: function() {
    var color = "main-card";
    switch (this.props.style) {
      case 1:
        color = Colors.MAIN;//"main-card";
        break;
      case 2:
        color = Colors.SECONDARY;//"second-card";
        break;
      case 3:
        color = Colors.LIGHT_BLUE;//"light-main-card";
        break;
      case 4:
        color = Colors.LIME_GREEN;//"light-second-card"
        break;
    }
    return (
      <Paper style={{backgroundColor: color, padding: 15, margin: "20px -20px 20px 20px"}}>
        <Row>
          <Col md={12}>
          <span className={"text-fix medium thin white"}>{this.props.heading}</span>
          </Col>
        </Row>
        <Row style={{marginTop: 20}}>
          <Col md={7}>
            {this.props.icon}
          </Col>
          <Col md={4}>
            <span className={"text-fix large white"}>{this.props.metric}</span>
          </Col>
          <Col md={1}></Col>
        </Row>
      </Paper>
    )
  }
});

module.exports = DashboardCard;
