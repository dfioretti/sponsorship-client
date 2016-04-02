var React = require('react');
var AutoComplete = require('material-ui').AutoComplete;
var MenuItem = require('material-ui').MenuItem;
var SearchIcon = require('react-icons/lib/md/search');
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Paper = require('material-ui').Paper;
var Navigation = require('react-router').Navigation;
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);

var AssetSearch = React.createClass({
	mixins: [Navigation, FluxMixin],

	handleItemSelect: function(item, index) {
		this.getFlux().actions.setBreadcrumb(item.text);
		this.transitionTo('/apt/asset/dashboard/' + item.value.key)
	},

	getAssetList: function() {
		var dataSource = [];
		var imageStyle = {
			height: 30,
			width: 30,
			marginLeft: 2,
			marginRight: 0,
			borderRadius: "50%"
		}
		this.props.assets.forEach(function(asset) {
			dataSource.push(
				{
					text: asset.name,
					value: (
						<MenuItem
							primaryText={<span style={{fontFamily: 'Avenir-Book', fontSize: 13, marginTop: 3, marginLeft: -25, paddingLeft: -25}}>{asset.name}</span>}
							leftIcon={<img style={imageStyle} src={asset.image} />}
							style={{marginLeft: 0}}
							key={asset.id}
							/>
					)
				}
			)
		});
		return dataSource;
	},
	render: function() {
		//				<Paper zDepth={3} rounded={false}>

		return (
			<div className="nav-search">
				<Paper zDepth={3} rounded={false}>
				<Row style={{marginLeft: 0, marginRight: 0}}>
					<Col md={1}>
						<SearchIcon style={{ marginRight: 8, marginLeft: 3, height: 25, width: 25, marginTop: 12}}/>
					</Col>
					<Col md={10}>
						<AutoComplete
							hintText="Find Property"
							style={{fontFamily: 'Avenir-Book', color: 'white'}}
							listStyle={{fontFamily: 'Avenir-Book', color: 'white'}}
							filter={AutoComplete.caseInsensitiveFilter}
							fullWidth={true}
							menuStyle={{ height: 250, color: 'white' }}
							onNewRequest={this.handleItemSelect}
							dataSource={this.getAssetList()}
							/>
					</Col>
				</Row>
				</Paper>
			</div>
		)
	}

});

module.exports = AssetSearch;
