var React = require('react');
var List = require('material-ui').List;
var ListItem = require('material-ui').ListItem;
var Avatar = require('material-ui').Avatar;
var Divider = require('material-ui').Divider;
var API_ROOT = require('../../constants/environment.js').API_ROOT;
var $ = require('jquery');

var LiveTwitter = React.createClass({
	getInitialState: function() {
		return { tweets: [] }
	},

	componentWillReceiveProps: function(newProps) {
		console.log('new props', newProps);
		//this.loadData();
	},
	componentWillMount: function() {
		//this.loadData();
	},
	loadData: function() {
		console.log('loading data');
		$.ajax({
			type: "GET",
			contentType: "application/json",
			url: API_ROOT + "api/v1/twitter",
			data: { screen_name: this.props.handle },
			success: function(data, status, xhr) {
				console.log('success??');
				this.setState({
					tweets: data
				});
			}.bind(this),
			error: function(xhr, status, error) {
				console.log(status);
				console.log(error);
			}
		});
	},
	render: function() {
		console.log('render', this.props);
		return (
			<List style={{height: 500, overflow: 'scroll'}}>
				{this.props.tweets.map(function(tweet) {
					return (
						<ListItem
							key={tweet.id}
							leftAvatar={<Avatar src={tweet.user.profile_image_url} />}
							selectable={false}
							primaryText={this.props.handle}
							secondaryText={tweet.text}
							/>
					);
				}.bind(this))}
			</List>
		);
	}

});

module.exports = LiveTwitter;
