var React = require('react');
var API_ROOT = require("../../constants/environment.js").API_ROOT;
var Avatar = require('material-ui').Avatar;
var List = require('material-ui').List;
var Divider = require('material-ui').Divider;
var ListItem = require('material-ui').ListItem;


var TwitterFeed = React.createClass({
	getInitialState: function() {
		return { tweets: [] }
	},
	componentWillMount: function() {
		this.loadData(this.props);
	},
	componentWillReceiveProps: function(newProps) {
		this.loadData(newProps);
	},
	loadData: function(props) {
		var screen_name = props.screen_name;
		$.ajax({
			type: "GET",
			contentType: "application/json",
			url: API_ROOT + "api/v1/twitter",
			data: { "screen_name": screen_name },
			success: function(data, status, xhr) {
				this.setState({ tweets: data })
			}.bind(this),
			error: function(xhr, status, error) {
				console.log(status);
				console.log(error);
			}
		});
	},
	renderContent: function() {
		return (
			<List style={{height: "270px", color: "#50e3c2", overflowY: "scroll", backgroundColor: "#2d64a5"}}>
				{this.state.tweets.map(function(tweet) {
					return (
						<ListItem
							disabled={true}
							style={{color: "white", fontFamily: "Avenir-Medium" }}
							key={tweet.id}
							primaryText={"@" + tweet.user.screen_name}
							secondaryTextLines={2}
							secondaryText={
								<p>
									<span style={{color: "white"}}>{tweet.text}</span>
								</p>
							}
							leftAvatar={<Avatar src={tweet.user.profile_image_url} />}
							/>
					);
				})}
			</List>
		);
	},
	render: function() {
		return (
			<div className="dashboard-module">
				<div className="top">
					<div className="drag-handle"></div>
					<div className="top-title">Twitter Feed</div>
				</div>
				<div className="main">
					{this.renderContent()}
				</div>
			</div>
		);
	}
});

module.exports = TwitterFeed;
