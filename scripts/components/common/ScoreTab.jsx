var React = require('react');
var Divider = require('material-ui').Divider;
var Slider = require('material-ui').Slider;
var Grid = require('react-bootstrap').Grid;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var FlatButton = require('material-ui').FlatButton;
var SettingsIcon = require('react-icons/lib/md/settings');
var List = require('material-ui').List;
var ListItem = require('material-ui').ListItem;
var EditIcon = require('react-icons/lib/md/edit');
var NormalizeIcon = require('react-icons/lib/fa/magic')
var WeightIcon = require('react-icons/lib/fa/balance-scale');
var AddChild = require('react-icons/lib/fa/plus-square');
var NodesIcon = require('react-icons/lib/ti/flow-merge');
var IconButton = require('material-ui').IconButton;
var AddIcon = require('react-icons/lib/md/add');
var Checkbox = require('material-ui').Checkbox;
var Toolbar = require('material-ui').Toolbar;
var ScoreBuilder = require('../editors/ScoreBuilder.jsx');
var Chip = require('material-ui').Chip;
var uuid = require('node-uuid');
var Popover = require('material-ui').Popover;
var Paper = require('material-ui').Paper;
var Card = require('material-ui').Card;
var CardTitle = require('material-ui').CardTitle;
var CardHeader = require('material-ui').CardHeader;
var CardText = require('material-ui').CardText;
var Menu = require('material-ui').Menu;
var MenuItem = require('material-ui').MenuItem;
var Toggle = require('material-ui').Toggle;

// graph variables
var nodeIds, nodeList, nodes, edgeList, edges, network, options, nodeCounter, edgeCounter, currentNode;

function generateNode() {
	var data =
	'<svg xmlns="http://www.w3.org/2000/svg" width="390" height="65">'
	+ '<rect x="0" y="0" width="100%" height="100%" fill="#7890A7" stroke-width="20" stroke="#ffffff"></rect>'
	+ '<foreignObject x="15" y="10" width="100%" height="100%">'
	+ '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size: 40px">'
	+ '<em>TEST</em>'
	+ '</div>'
	+ '</foreignObject>'
	+ '</svg>';
	var DOMURL = window.URL || window.webkitURL || window;
	var img = new Image();
	var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
	var url = DOMURL.createObjectURL(svg);

	return url;
}


var ScoreTab = React.createClass({
	getInitialState: function() {
		return { loadedMetrics: [], showPopover: false, x: 0, y: 0, currentNode: 0, currentSliderValue: 1 }
	},
	editKpi: function(obj, event) {
		//console.log("event", obj, event, event.target);
	},
	onKpiCheck: function(event, isInputChecked) {
		//console.log('on kpi check!');
		if (isInputChecked) {
			this.setState({
				loadedMetrics: this.state.loadedMetrics.concat(event.target.id)
			});
		} else {
			this.loadedMetrics = this.state.loadedMetrics;
			var metricToDelete = this.loadedMetrics.indexOf(event.target.id);
			this.loadedMetrics.splice(metricToDelete, 1);
			this.setState({
				loadedMetrics: this.loadedMetrics
			});
		}
	},
	renderDefinedKpis: function() {
		return (
			this.props.formulas.map(function(kpi) {
				return (
					<ListItem
						primaryText={kpi.name}
						key={kpi.uuid}
						leftCheckbox={<Checkbox id={kpi.uuid} onCheck={this.onKpiCheck}/>}
						rightIconButton={<IconButton onTouchTap={this.editKpi.bind(this, kpi.name)}><EditIcon size={20}/></IconButton>}
						/>
				);
			}.bind(this))
		)
	},
	onAddMetric: function(event) {
		//console.log('clicked on add metric', event);
	},
	renderMetric: function(data) {
		//console.log('rnder metric', data, this.props.formulas);
		var idx = this.props.formulas.map((kpi) => kpi.uuid).indexOf(data);
		var kpi = this.props.formulas[idx];
		return (
			<Chip
				key={kpi.uuid}
				style={{margin: 4}}
				id={kpi.uuid}
				>
				{kpi.name}
			</Chip>
		);
	},
	onModelChange: function() {
		console.log('tab model change');
		var model = {
			name: 'model name',
			loadedMetrics: this.state.loadedMetrics,
			nodes: nodes,
			edges: edges
		}
		var key = {}
		key[currentNode] = this.state.currentNode;
		console.log("built key: ", key);
		//this.props.onModelChange(data);
	},
	renderPopover: function() {
		var popoverStyle = {
			//height: 200,
			width: 300,
			position: 'absolute',
			zIndex: 9999999,
			top: this.state.y + 'px',
			left: (this.state.x - 150) + 'px',
			//marginBottom: this.state.y,
			//marginRight: this.state.x,
			//backgroundColor: 'green'
		}
		if (typeof(nodes) === 'undefined') return null;
		console.log('uh', network, nodes, edges);
		console.log('nodes', nodes);
		console.log('wtf', nodes.get(this.state.currentNode));
		var currentObject = nodes.get(this.state.currentNode);
		return (
			<Popover
				open={this.state.showPopover}
				style={popoverStyle}
				anchorEl={this.vis}
				key={uuid.v4()}
				anchorOrigin={{horizontal: 'left', vertical: 'top'}}
				targetOrigin={{horizontal: 'left', vertical: 'top'}}
				onRequestClose={this.handleClose}
				animation={Popover.PopoverAnimationVertical}
				>
				<div className="title med small-pad center">Configure</div>
				<Divider />
				<List>
					<ListItem
						primaryText="Normalize"
						disabled={true}
						rightToggle={<Toggle onToggle={this.onNormalizeToggle.bind(this, this.state.currentNode)} toggled={nodes.get(this.state.currentNode).normalize} />}
						leftIcon={<NormalizeIcon />}
						/>
						<ListItem
							primaryText={
							<Row>
									<Col md={9}>
										<Slider onChange={this.onWeightChange.bind(this, this.state.currentNode)} value={nodes.get(this.state.currentNode).weight} step={0.05} style={{maring: 0, padding: 0}} sliderStyle={{margin: 0, padding: 0}}/>
									</Col>
									<Col md={2}>
										{Math.round(nodes.get(this.state.currentNode).weight * 100, 0)}
									</Col>
									<Col md={1}></Col>
							</Row>}
							leftIcon={<WeightIcon />}
							disabled={true}
							/>
						<ListItem
							primaryText="Children"
							initiallyOpen={false}
							primaryToglesNestedList={true}
							disabled={true}
							leftIcon={<NodesIcon />}
							nestedItems={this.getNestedItems()}
							/>
				</List>
			</Popover>
		);
		//value={nodes.get(this.state.currentNode).weight
	},
	onNormalizeToggle: function(currentNode, event, isToggled) {
		/*
		this.setState({
			doUpdate: true
		});
		*/
		nodes.update({id: currentNode, normalize: !isToggled});
		this.forceUpdate();
	},
	onWeightChange: function(currentNode, event, value) {
		console.log('chage', currentNode, event, value);
		this.setState({
			currentSliderValue: value
		});
		nodes.update({id: currentNode, weight: value});
		//this.forceUpdate();
	},
	onCheckChange: function(parent, kpi, event, isInputChecked) {
		if (isInputChecked) {
			this.addNode(parent, kpi);
		} else {
			this.removeNode(parent, kpi);
		}
	},
	addNode: function(parent, kpi) {
		var id = nodeCounter;
		nodeCounter = nodeCounter + 1;
		var edgeId = edgeCounter;
		edgeCounter = edgeCounter + 1;
		//var url = generateNode();
		nodes.add({ id: id, weight: 1, normalize: true, labelHighlightBold: false, borderWidthSelected: 1, label: kpi, shape: 'circle', font:{face: 'Avenir-Book', color: '#FFFFFF'}, color: '#1C5D99'});
		edges.add({
			id: edgeId,
			from: parent,
			to: id
		});
		//nodes.add({id: id, image: url, shape: 'image' });
		nodeIds.push(id);
		// remove from remaining
		//this.onModelChange();
	},
	getNestedItems: function() {
		var items = [];
		this.state.loadedMetrics.map(function(m) {
			var idx = this.props.formulas.map((kpi) => kpi.uuid).indexOf(m);
			var kpi = this.props.formulas[idx];
			items.push(<ListItem key={kpi.uuid} primaryText={kpi.name} style={{fontSize: 12}} leftCheckbox={<Checkbox onCheck={this.onCheckChange.bind(this, this.state.currentNode, kpi.name)}/>} />);
		}.bind(this));
		return items;
	},
	doNodeDeselect: function(params) {
		this.setState({
			showPopover: false,
			currentNode: null
		});
	},
	loadScoreTree: function() {
		nodeList = [
			{ id: 0, labelHighlightBold: false, weight: 1, normalize: true, borderWidthSelected: 1, label: 'MODEL', shape: 'circle', font:{face: 'Avenir-Book', color: '#FFFFFF'}, color: '#1C5D99'}
		];
		nodes = new vis.DataSet(nodeList);
		edgeList = [];
		edges = new vis.DataSet(edgeList);
		nodeIds = [];
		nodeCounter = 1;
		edgeCounter = 0;
		currentNode = 0;
		var container = document.getElementById('vis');

		options = {
			layout: {
				hierarchical: {
					blockShifting: true,
					direction: 'UD',
					sortMethod: 'directed'
				}
			},
			/*
			manipulation: {
				addEdge: function(data, callback) {
					if (data.from == data.to) {
						var r = confirm("Do you want to connect the node to itself?");
						if (r == true) {
							callback(data);
						}
					}
					else {
						callback(data);
					}
				}
			},*/
			interaction: {
				navigationButtons: true,
				keyboard: false
			},
			edges: {
				smooth: {
					forceDirection: 'none'
				}
			}
		};
		var data = {
			nodes: nodes,
			edges: edges
		}
		network = new vis.Network(container, data, options);
		network.on("click", function(params) {
			this.doNodeSelect(params);
		}.bind(this));
		network.on("deselectNode", function(params) {
			this.doNodeDeselect(params);
		}.bind(this));
	},
	componentDidMount: function() {
		this.loadScoreTree();
	},
	componentDidUpdate: function(prevProps, prevState) {
		//if (this.props.formulas.length == prevProps.formulas.length) return;
		if (!network)
		this.loadScoreTree();
	},
	doNodeSelect: function(params) {
		//console.log(params);
		//console.log('nodes', nodes, network);
		if (params.nodes.length == 0) return;

		var node = params.nodes[0];
		//console.log('the node', node, params);
		//console.log('network', network.body.nodes);
		var def = network.body.nodes[node];//;[node];
		//console.log('found', node, def);
		//console.log('x', params.pointer.DOM.x);
		//console.log('y', params.pointer.DOM.y);
		//console.log('network', network);
		this.setState({
			showPopover: true,
			currentNode: node,
			x: params.event.pointers[0].pageX,
			y: params.event.pointers[0].pageY,
			currentSliderValue: nodes.get(this.state.currentNode).weight

			//currentSliderValue: nodes.get()
			//x: def.body.view.translation.x,
			//y: def.body.view.translation.y
			//x: params.pointer.DOM.x,
			//y: params.pointer.DOM.y
		});
		currentNode = node;
		this.onModelChange();
		//console.log('doign node select!', params);
	},
	handleClick: function(event) {
		//var id = uuid.v4();
		var id = counter;
		counter = counter + 1;
		var url = generateNode();
		nodes.add({id: id, image: url, shape: 'image' });
		nodeIds.push(id);
		//console.log('handle click!', event);
	},
	handleClose: function(event) {
		this.setState({
			showPopover: false
		});
	},
	renderTree: function() {
		return (
			<div>
				<Col md={7}>
					<div className="tab-content">
						<Row style={{height: "80%", backgroundColor: 'white'}}>
							<Col  md={12} style={{height: '100%'}}>
								<div  id="vis" style={{height: '100%'}}>
								</div>
							</Col>
						</Row>
						<Row style={{height: '20%', backgroundColor: 'blue'}}>
							<Col md={12}>
								<div style={{height: '100%'}}>
									<div className="title med small-pad center">Available KPIs</div>
									<div style={{display: 'flex', flexWrap: 'wrap'}}>
										{this.state.loadedMetrics.map(this.renderMetric, this)}
									</div>
								</div>
							</Col>
						</Row>
					</div>
				</Col>
				<Col md={5}>
					<div className="tab-content">
						<div style={{height: '100%', width: "100%", backgroundColor: 'green'}}>
							this is the editor
						</div>
					</div>
				</Col>
			</div>
		);
	},
	render: function() {
		return (
			<div ref={(ref) => this.vis = ref} >
				{this.renderPopover()}
				<Col className="tab-col" md={3}>
					<div className="tab-content">
						<div className="title med small-pad center">Metrics</div>
						<Row>
							<Col md={1}></Col>
							<Col md={4}>
								<FlatButton onTouchTap={this.props.onKpiAdd} label="Add" />
							</Col>
						</Row>
						<Row>
							<Col md={12}>
								<List>
									{this.renderDefinedKpis()}
								</List>
							</Col>
						</Row>
					</div>
				</Col>
				<Col md={9}>
					{this.renderTree()}
				</Col>
			</div>
		);
	}
	/*
	<div>
	<div id="score-vis"
	style={{width: 600, height: 400, border: "1px solid lightgray"}}
	>
	</div>
	<button onClick={this.addNode}>add</button>
	</div>
	<ScoreBuilder loadedMetrics={this.state.loadedMetrics} kpis={this.props.formulas} />

	*/
});

module.exports = ScoreTab;
