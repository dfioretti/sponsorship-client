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
var CalcIcon = require('react-icons/lib/fa/calculator');
var NodesIcon = require('react-icons/lib/ti/flow-merge');
var IconButton = require('material-ui').IconButton;
var RcSlider = require('rc-slider');
var AddIcon = require('react-icons/lib/md/add');
var Checkbox = require('material-ui').Checkbox;
var MoreIcon = require('react-icons/lib/md/more-vert');
var IconMenu = require('material-ui').IconMenu;
var Toolbar = require('material-ui').Toolbar;
var ScoreBuilder = require('../editors/ScoreBuilder.jsx');
var Chip = require('material-ui').Chip;
var uuid = require('node-uuid');
var DataBrowser = require('../editors/DataBrowser.jsx');
var Popover = require('material-ui').Popover;
var Paper = require('material-ui').Paper;
var Card = require('material-ui').Card;
var CardTitle = require('material-ui').CardTitle;
var CardHeader = require('material-ui').CardHeader;
var CardText = require('material-ui').CardText;
var Menu = require('material-ui').Menu;
var MenuItem = require('material-ui').MenuItem;
var Toggle = require('material-ui').Toggle;
var Fluxxor = require('fluxxor');
var Colors = require('../../constants/colors.js');
var FluxMixin = Fluxxor.FluxMixin(React);
var Table = require('material-ui').Table;
var TableHeader = require('material-ui').TableHeader;
var TableRow = require('material-ui').TableRow;
var DataIcon = require('react-icons/lib/md/perm-data_setting');
var _ = require('underscore');
var StatEngine = require('../../utils/StatEngine.js');

// graph variables
var nodeIds, nodeList, nodes, edgeList, edges, network, options, nodeCounter, edgeCounter, currentNode, nodeToggles, nodeWeights;

var scoreModel;


function generateNode(name, weight, normalize) {
	var data =
	'<svg xmlns="http://www.w3.org/2000/svg" width="150" height="85">'
	+ '<rect x="0" y="0" width="100%" height="100%" fill="#1C5D99" rx="5" ry="5"></rect>'
	+ '<foreignObject x="15" y="10" width="100%" height="100%">'
	+ '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size: 14px; font-family: Avenir-Book; text-transform: letter-spacing: 1.5px; uppercase; color: white;">'
	+ '<div>' + name +'</div>'
	+ '<div style="font-size: 12px; font-style: italic; padding-top: 10px;">Weight: ' + weight + '</div>'
	+ '<div style="font-size: 12px; font-style: italic; padding-top: 2px;">Normalized: ' + 'Yes' + '</div>'
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
	mixins: [ FluxMixin ],

	getInitialState: function() {
		this.scoreModel = null;
		return { nodeToggles: [true], nodeWeights: [100], loaded: false, formulas: [], uuid: uuid.v4(), usedMetrics: [], update: false, loadedMetrics: [], showPopover: false, x: 0, y: 0, currentNode: 0, currentSliderValue: 1 }
	},
	componentWillMount: function() {
		//this.loadScore(this.props);
	},
	componentWillReceiveProps: function(newProps) {
		//this.loadScore(newProps);
	},
	loadScore: function(props) {

		if (props.models.length > 0) {
			var model = props.models[0];
			var nodeKeys = _.keys(model.nodes['_data']);
			nodeList = [];
			edgeList = [];
			nodeKeys.forEach(function(key) {
				nodeList.push(model.nodes['_data'][key]);
			});
			var edgeKeys = _.keys(model.nodes['_data']);
			edgeKeys.forEach(function(key) {
				var edge = model.edges['_data'][key];
				if (typeof(edge) != 'undefined')
				edgeList.push(model.edges['_data'][key]);
			});
			nodeIds = _.keys(nodeList);
			scoreModel.nodeIds = _.keys(nodeList);
			nodeCounter = _.keys(nodeList).length;
			edgeCounter = _.keys(edgeList).length;
			this.setState({
				uuid: model.key,
				usedMetrics: model.usedMetrics,
				loadedMetrics: model.loadedMetrics,
				update: true
			});
		}
	},
	editKpi: function(name, id, event) {
		this.props.onKpiUpdate(id);
	},
	onKpiCheck: function(event, isInputChecked) {
		if (isInputChecked) {
			this.setState({
				loadedMetrics: this.state.loadedMetrics.concat(event.target.id)
			});
		} else {
			this.loadedMetrics = this.state.loadedMetrics;
			var metricToDelete = this.loadedMetrics.indexOf(event.target.id);
			var used = this.loadedMetrics.splice(metricToDelete, 1);
			this.setState({
				loadedMetrics: this.loadedMetrics,
				usedMetrics: this.state.usedMetrics.concat(used)
			});
		}
		this.onModelChange();
	},
	onCheckMetric: function(id, name, event, isChecked) {
		if (isChecked) {
			this.setState({
				loadedMetrics: this.state.loadedMetrics.concat(id)
			});
		} else {
			this.loadedMetrics = this.state.loadedMetrics;
			var metricToDelete = this.loadedMetrics.indexOf(id);
			var used = this.loadedMetrics.splice(metricToDelete, 1);
			this.setState({
				loadedMetrics: this.loadedMetrics,
			});
		}
	},
	renderDefinedKpis: function() {
		if (typeof(this.props.formulasColl) === 'undefined') return null;
		return (
			this.props.formulasColl.find({context: this.props.contextId }).map(function(kpi) {
				return (
					<ListItem
						primaryText={kpi.name}
						key={kpi.id}
						inputStyle={{color: Colors.MAIN}}
						rightIconButton={
							<IconButton onTouchTap={this.editKpi.bind(this, kpi.name, kpi.id)}><EditIcon size={20}/></IconButton>
						}
						onTouchTap={this.editKpi.bind(this, kpi.name, kpi.id)}
						leftCheckbox={<Checkbox onCheck={this.onCheckMetric.bind(this, kpi.id, kpi.name)}/>}
						/>
				);
			}.bind(this))
		)
	},
	onAddMetric: function(event) {
	},
	renderMetric: function(data) {
		return null;
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
		var model = {
			name: 'model name',
			loadedMetrics: this.state.loadedMetrics,
			nodes: nodes,
			edges: edges,
			key: this.state.uuid,
			nodeSet: nodes.get(),
			edgeSet: edges.get(),
			nodeObject: JSON.stringify(nodes, null, 2),
			edgeObject: JSON.stringify(edges, null, 2),
			usedMetrics: this.state.usedMetrics
		}
		var key = {}
		key[currentNode] = this.state.currentNode;
		this.props.onModelChange(model);
	},
	addChild: function() {
		this.addNode(this.state.currentNode, '');
	},
	onToggle: function() {
		this.nodeToggles = this.state.nodeToggles;
		this.nodeToggles[this.state.currentNode] = !this.nodeToggles[this.state.currentNode];
		nodeToggles[this.state.currentNode] = !nodeToggles[this.state.currentNode];
		scoreModel.nodeToggles = nodeToggles;
		this.setState({nodeToggles: this.nodeToggles});
	},
	onSliderChange: function(value) {
		this.nodeWeights = this.state.nodeWeights;
		this.nodeWeights[this.state.currentNode] = value;
	},
	onAfterChange: function(value) {
		this.nodeWeights = this.state.nodeWeights;
		this.nodeWeights[this.state.currentNode] = value;
		nodeWeights[this.state.currentNode] = value;
		scoreModel.nodeWeights = nodeWeights;//;scoreModel.nodeWeights.concat(value)
		this.setState({nodeWeights: this.nodeWeights});
	},
	percentFormatter: function(v) {
		return `${v} %`;
	},
	renderPopover: function() {
		var popoverStyle = {
			width: 300,
			position: 'absolute',
			zIndex: 9999999,
			top: this.state.y + 'px',
			left: (this.state.x - 150) + 'px',
		}
		if (typeof(nodes) === 'undefined') return null;
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
				<Divider />
				<List>
					<ListItem leftIcon={<SettingsIcon />} disabled={true}>Configure</ListItem>
					<Divider />

					<ListItem leftIcon={<WeightIcon />}
						disabled={true}
						primaryText={<RcSlider onAfterChange={this.onAfterChange} tipFormatter={this.percentFormatter} defaultValue={nodeWeights[this.state.currentNode]} onChange={this.onSliderChange} />}
						></ListItem>
					<ListItem primaryText="Normalize"
						leftIcon={<NormalizeIcon />}
						rightToggle={<Toggle onToggle={this.onToggle} toggled={nodeToggles[this.state.currentNode]}/>}
						></ListItem>
					<ListItem
						primaryText="Add Subscore"
						leftIcon={<NodesIcon />}
						onTouchTap={this.addChild}
						>
					</ListItem>
					<ListItem
						primaryText="Add Metric"
						initiallyOpen={false}
						leftIcon={<CalcIcon />}
						primaryTogglesNestedList={true}
						nestedItems={this.state.loadedMetrics.map(function(metric) {
							return (
								<ListItem onTouchTap={this.addNode.bind(this, this.state.currentNode, metric)} key={uuid.v4()} primaryText={this.props.formulasColl.findOne({id: metric}).name} />
							);
						}.bind(this))}
						>
					</ListItem>
				</List>
			</Popover>
		);
	},
	onNormalizeToggle: function(currentNode, event, isToggled) {
		nodes.update({id: currentNode, normalize: !isToggled});
		this.forceUpdate();
	},
	onWeightChange: function(currentNode, event, value) {
		this.setState({
			currentSliderValue: value
		});
		nodes.update({id: currentNode, weight: value});
		this.onModelChange();
	},
	onCheckChange: function(parent, kpi, event, isInputChecked) {
		if (isInputChecked) {
			this.addNode(parent, kpi);
		} else {
			this.removeNode(parent, kpi);
		}
		this.onModelChange();
	},
	addNode: function(parent, kpi) {
		var label = "";
		var type = "node";
		var id = 0;
		var shape = 'diamond';
		if (kpi.length > 0) {
			label = this.props.formulasColl.findOne({id: kpi}).name;
			type = "formula";
			id = kpi;
			shape = 'dot';
		}
		var color = "#ffffff";//"#000000";
		var id = nodeCounter;
		nodeCounter = nodeCounter + 1;
		var edgeId = edgeCounter;
		edgeCounter = edgeCounter + 1;
		var url = generateNode(label, 100, "Normalize");
		if (kpi.length > 0) {
			nodes.add({ id: id,
				weight: 1,
				normalize: true,
				type: type,
				parent: parent,
				fid: kpi,
				labelHighlightBold: false,
				borderWidthSelected: 1,
				label: label,
				shape: shape,
				//shape: 'image',
				//image: url
			});
			/*
			scoreModel['nodes'].add({
				id: id,
				weight: 1,
				normalize: true,
				type: type,
				fid: kpi,
				labelHighlightBold: false,
				borderWidthSelected: 1,
				label: label,
				shape: shape
				//shape: 'image',
				//image: url
			});*/
			scoreModel['nodeList'] = scoreModel.nodeList.concat({
				id: id,
				weight: 1,
				normalize: true,
				type: type,
				fid: kpi,
				parent: parent,
				labelHighlightBold: false,
				borderWidthSelected: 1,
				shape: shape,
				label: label
				//shape: 'image',
				//image: url
			});
		} else {
			scoreModel.nodeList = scoreModel.nodeList.concat({ id: id, parent: parent, weight: 1, normalize: true, type: type, fid: kpi, labelHighlightBold: false, borderWidthSelected: 1, label: label, shape: shape});
			//scoreModel['nodes'].add({ id: id, weight: 1, normalize: true, type: type, fid: kpi, labelHighlightBold: false, borderWidthSelected: 1, label: label, shape: shape});
			nodes.add({ id: id, weight: 1, parent: parent, normalize: true, type: type, fid: kpi, labelHighlightBold: false, borderWidthSelected: 1, label: label, shape: shape});
		}
		//font:{face: 'Avenir-Book', color: color}, color: '#1C5D99'});
		edges.add({
			id: edgeId,
			from: parent,
			to: id
		});
		/*
		scoreModel['edges'].add({
			id: edgeId,
			from: parent,
			to: id
		});
		*/
		scoreModel.edgeList = scoreModel.edgeList.concat({id: edgeId, from: parent, to: id});
		scoreModel.nodeWeights = scoreModel.nodeWeights.concat(100);
		scoreModel.nodeToggles = scoreModel.nodeToggles.concat(true);
		//nodeIds.push(id);
		//scoreModel.nodeIds = scoreModel.nodeIds.push(id);
		nodeToggles = nodeToggles.concat(true);
		nodeWeights = nodeWeights.concat(100);
		this.setState({
			nodeToggles: this.state.nodeToggles.concat(true),
			nodeWeights: this.state.nodeWeights.concat(100),
			showPopover: false,
			currentNode: id
		});
		this.props.modelsColl.update(scoreModel);
		window.scoreModel = scoreModel;
	},
	getNestedItems: function() {
		var items = [];
		this.state.loadedMetrics.map(function(m) {
			var idx = this.props.formulas.map((kpi) => kpi.id).indexOf(m);
			var kpi = this.props.formulas[idx];
			items.push(<ListItem key={kpi.id} primaryText={kpi.name} style={{fontSize: 12}} leftCheckbox={<Checkbox onCheck={this.onCheckChange.bind(this, this.state.currentNode, kpi.name)}/>} />);
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
		var newModel = true;
		if (this.props.modelsColl.find().length == 0) {
			console.log('no score found');
			// maybe do nothing?
		} else {
			scoreModel = this.props.modelsColl.find()[0];
			console.log('score found', scoreModel);
			newModel = false;
		}
		var color = "#ffffff";//"#000000";
		if (newModel) {
			nodeList = [
				{ id: 0, parent: -1, labelHighlightBold: false, weight: 1, normalize: true, borderWidthSelected: 1, label: 'MODEL', shape: 'circle', font:{face: 'Avenir-Book', color: color, size: 10}, color: '#1C5D99'}
			];
			var modelNodeList = [
				{ id: 0, parent: -1, labelHighlightBold: false, weight: 1, normalize: true, borderWidthSelected: 1, label: 'MODEL', shape: 'circle', font:{face: 'Avenir-Book', color: color, size: 10}, color: '#1C5D99'}
			];
			edgeList = [];
			var modelEdgeList = [];
			nodeIds = [];
			modelNodeIds = [];
			modelNodeCounter = 1;
			modelEdgeCounter = 0;
			nodeCounter = 1;
			edgeCounter = 0;
		} else {
			nodeList = scoreModel.nodeList;
			edgeList = scoreModel.edgeList;
			nodeCounter = scoreModel.nodeList.length;
			edgeCounter = scoreModel.edgeList.length;
		}
		nodes = new vis.DataSet(nodeList);
		edges = new vis.DataSet(edgeList);
		var modelNodes = new vis.DataSet(modelNodeList);
		var modelEdges = new vis.DataSet(modelEdgeList);
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
			else {
			callback(data);
			},*/
			interaction: {
				navigationButtons: false,
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
		network.on("doubleClick", function(params) {
			this.doNodeSelect(params);
		}.bind(this));
		network.on("click", function(params) {
			this.doSetNode(params);
		}.bind(this));
		network.on("deselectNode", function(params) {
			this.doNodeDeselect(params);
		}.bind(this));

		if (newModel) {
			model = {
				modelName: "Property Score",
				nodeWeights: [],
				formulas: [],
				nodeList: nodeList,
				nodes: nodes,
				edgeList: edgeList,
				edges: edges
			}
			scoreModel = {
				id: uuid.v4(),
				//nodeIds: [].concat(nodeIds),
				nodeList: modelNodeList,
				//nodes: modelNodes,
				edgeList: modelEdgeList,
				//edges: modelEdges,
				modelName: "Property Score Model",
				nodeWeights: [100],
				nodeToggles: [true],
				formulas: this.state.formulas
			}
			this.props.modelsColl.insert(scoreModel);
		}
		scoreModel = this.props.modelsColl.find()[0];
		nodeWeights = [].concat(scoreModel.nodeWeights);
		nodeToggles = [].concat(scoreModel.nodeToggles);
		window.scoreModel = scoreModel;
	},
	componentDidMount: function() {
		this.loadScoreTree();
	},
	componentDidUpdate: function(prevProps, prevState) {
		if (!network)
		this.loadScoreTree();
	},
	doSetNode: function(params) {
		if (params.nodes.length == 0) return;
		var node = params.nodes[0];
		this.setState({
			currentNode: node
		});
		currentNode = node;
	},
	doNodeSelect: function(params) {
		if (params.nodes.length == 0) return;
		var node = params.nodes[0];
		var def = network.body.nodes[node];//;[node];
		this.setState({
			showPopover: true,
			currentNode: node,
			x: params.event.pointers[0].pageX,
			y: params.event.pointers[0].pageY,
			currentSliderValue: nodes.get(this.state.currentNode).weight
		});
		currentNode = node;
	},
	handleClick: function(event) {
		var id = counter;
		counter = counter + 1;
		var url = generateNode();
		nodes.add({id: id, image: url, shape: 'image' });
		nodeIds.push(id);
	},
	handleClose: function(event) {
		this.setState({
			showPopover: false
		});
	},
	renderTree: function() {
		return (
			<div>
				<div id="vis" style={{height: 400, backgroundColor: Colors.LIGHT}}></div>
			</div>
		);
	},
	render: function() {

		return (
			<div ref={(ref) => this.vis = ref} >
				{this.renderPopover()}
				<Col className="tab-col" md={3}>
					<div className="tab-content" style={{backgroundColor: 'white'}}>
						<Row>
							<Col md={12}>
								<div className="title med small-pad center">Configure</div>
								<Divider />
								<List>
									<ListItem
										leftIcon={<DataIcon style={{color: Colors.MAIN}}/>}
										primaryText="Create KPI"
										key={uuid.v4()}
										secondaryText="Define custom metric"
										disabled={true}
										rightIconButton={<IconButton tooltip="New" tooltipPosition="bottom-left" touch={true} style={{color: Colors.GREEN_BASE}} onTouchTap={this.props.onKpiAdd}><AddIcon size={20}/></IconButton>}
										/>
									{this.renderDefinedKpis()}
								</List>
							</Col>
						</Row>
					</div>
				</Col>
				<Col className="tab-col" md={9}>
					<div className="tab-content">
						<Row style={{marginTop: -10}}>
							<Col md={12}>
								{this.renderTree()}
							</Col>
						</Row>
						<Row>
							<Col md={12}>
								<DataBrowser modelsColl={this.props.modelsColl} node={(typeof(nodes) !== 'undefined') ? nodes.get(this.state.currentNode) : null } formulasColl={this.props.formulasColl} metricsColl={this.props.metricsColl} scopeProperties={this.props.scopeProperties} currentNode={this.state.currentNode} />
							</Col>
						</Row>
					</div>
				</Col>
			</div>
		);
	}
});

module.exports = ScoreTab;
