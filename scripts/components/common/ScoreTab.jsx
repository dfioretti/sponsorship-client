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
var Dialog = require('material-ui').Dialog;
var MetricsAnalytics  = require('./MetricsAnalytics.jsx');
var TextField = require('material-ui').TextField;


// graph variables
var nodeIds, nodeList, nodes, edgeList, edges, network, options, nodeCounter, edgeCounter, currentNode, nodeToggles, nodeWeights;

var scoreModel;
var scoreRecord;


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
		return { subscoreName: "", editId: null, showSubscoreDialog: false, kpiDialogOpen: false, nodeToggles: [true], nodeWeights: [100], loaded: false, formulas: [], uuid: uuid.v4(), usedMetrics: [], update: false, loadedMetrics: [], showPopover: false, x: 0, y: 0, currentNode: 0, currentSliderValue: 1 }
	},
	editKpi: function(name, id, event) {
		this.setState({
			kpiDialogOpen: true,
			editId: id
		});
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
		return (
			this.getFlux().store("DocumentStore").getState().formulasColl.find({cid: this.props.cid}).map(function(kpi) {
				return (
					<ListItem
						primaryText={kpi.name}
						key={kpi.fid}
						inputStyle={{color: Colors.MAIN}}
						rightIconButton={
							<IconButton onTouchTap={this.editKpi.bind(this, kpi.name, kpi.fid)}><EditIcon size={20}/></IconButton>
						}
						onTouchTap={this.editKpi.bind(this, kpi.name, kpi.fid)}
						leftCheckbox={<Checkbox onCheck={this.onCheckMetric.bind(this, kpi.fid, kpi.name)}/>}
						/>
				);
			}.bind(this))
		)
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
		this.getFlux().store("DocumentStore").saveDatabase();
		this.getFlux().actions.calculateModel(this.props.cid);
		//this.props.onModelChange(model);
	},
	addSubscore: function() {
		this.setState({ showSubscoreDialog: true, subscoreName: "", showPopover: false});
		//this.addNode(this.state.currentNode, this.state.subscoreName);
		//this.showSubscoreDialog({})
		//this.addNode(this.state.currentNode, '');
	},
	onToggle: function() {
		this.nodeToggles = this.state.nodeToggles;
		this.nodeToggles[this.state.currentNode] = !this.nodeToggles[this.state.currentNode];
		nodeToggles[this.state.currentNode] = !nodeToggles[this.state.currentNode];
		scoreModel.nodeToggles = nodeToggles;
		this.onModelChange();
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
		this.onModelChange();
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
				onRequestClose={this.handleClosePopover}
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
						onTouchTap={this.addSubscore}
						>
					</ListItem>
					<ListItem
						primaryText="Add Metric"
						initiallyOpen={false}
						leftIcon={<CalcIcon />}
						primaryTogglesNestedList={true}
						nestedItems={this.state.loadedMetrics.map(function(metric) {
							return (
								<ListItem onTouchTap={this.addNode.bind(this, this.state.currentNode, metric)} key={uuid.v4()} primaryText={this.getFlux().store("DocumentStore").getState().formulasColl.findOne({fid: metric}).name} />
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
		console.log('on weight change');
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
		var label = this.state.subscoreName;
		var type = "node";
		var id = 0;
		var shape = 'diamond';
		if (kpi != null && kpi.length > 0) {
			label = this.getFlux().store("DocumentStore").getState().formulasColl.findOne({fid: kpi}).name;
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
		if (kpi != null && kpi.length > 0) {
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
			var sid = uuid.v4();
			scoreModel.nodeList = scoreModel.nodeList.concat({ id: id, parent: parent, weight: 1, normalize: true, type: type, sid: sid, labelHighlightBold: false, borderWidthSelected: 1, label: label, shape: shape});
			//scoreModel['nodes'].add({ id: id, weight: 1, normalize: true, type: type, fid: kpi, labelHighlightBold: false, borderWidthSelected: 1, label: label, shape: shape});
			nodes.add({ id: id, weight: 1, parent: parent, normalize: true, type: type, fid: kpi, labelHighlightBold: false, side: sid, borderWidthSelected: 1, label: label, shape: shape});
		}
		//font:{face: 'Avenir-Book', color: color}, color: '#1C5D99'});
		edges.add({
			id: edgeId,
			from: parent,
			to: id
		});
		scoreModel.edgeList = scoreModel.edgeList.concat({id: edgeId, from: parent, to: id});
		scoreModel.nodeWeights = scoreModel.nodeWeights.concat(100);
		scoreModel.nodeToggles = scoreModel.nodeToggles.concat(true);
		nodeToggles = nodeToggles.concat(true);
		nodeWeights = nodeWeights.concat(100);
		this.setState({
			nodeToggles: this.state.nodeToggles.concat(true),
			nodeWeights: this.state.nodeWeights.concat(100),
			showPopover: false,
			currentNode: id
		});
		this.getFlux().store("DocumentStore").getState().modelsColl.update(scoreModel);
		this.getFlux().actions.calculateModel(this.props.cid);
		//this.getFlux().store("DocumentStore").getState().modelsColl.update(scoreModel);
		//scoreModel = this.getFlux().store("DocumentStore").g
		//this.props.modelsColl.update(scoreModel);
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
		scoreModel = this.getFlux().store("DocumentStore").getScore(this.props.cid);
		var color = "#ffffff";
		if (scoreModel == null) {
			nodeList = [
				{ id: 0, parent: -1, labelHighlightBold: false, weight: 1, normalize: true, borderWidthSelected: 1, label: 'MODEL', shape: 'circle', font:{face: 'Avenir-Book', color: color, size: 10}, color: '#1C5D99'}
			];
			edgeList = [];
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
		//var modelNodes = new vis.DataSet(modelNodeList);
		//var modelEdges = new vis.DataSet(modelEdgeList);
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

		if (scoreModel == null) {
			scoreModel = {
				id: uuid.v4(),
				cid: this.props.cid,
				nodeList: nodeList,
				edgeList: edgeList,
				modelName: "Property Score Model",
				nodeWeights: [100],
				nodeToggles: [true],
				formulas: this.state.formulas
			}
			this.getFlux().store("DocumentStore").getState().modelsColl.insert(scoreModel);
			scoreModel = this.getFlux().store("DocumentStore").getScore(this.props.cid);
		}
		//scoreModel = this.props.modelsColl.find()[0];
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
		//nodeIds.push(id);
	},
	handleClosePopover: function(event) {
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
	onKpiAdd: function() {
		this.setState({
			kpiDialogOpen: !this.state.kpiDialogOpen,
			editId: null
		});
	},
	handleClose: function() {
		this.setState({
			kpiDialogOpen: false,
			editId: null
		});
	},
	handleTextUpdate: function(event, value) {
		this.setState({ subscoreName: value});
	},
	handleSubscoreClose: function() {
		this.setState({ showSubscoreDialog: false});
	},
	handleSubscoreSave: function() {
		this.addNode(this.state.currentNode, null);

				//this.addNode(this.state.currentNode, this.state.subscoreName);
		this.setState({ showSubscoreDialog: false });
	},
	//scopeProperties={this.state.scopeProperties} contextId={this.props.params.id} kpiEdit={this.state.kpiEdit} metricsColl={this.state.metricsColl} formulasColl={this.state.formulasColl} doKpiSave={this.doKpiSave} handleClose={this.handleKpiClose}/>
	render: function() {
		var actions = [
		<FlatButton
			label="Cancel"
			primary={true}
			onTouchTap={this.handleSubscoreClose}
			/>,
		<FlatButton
			label="Save"
			primary={true}
			onTouchTap={this.handleSubscoreSave}
			/>
		];
		return (
			<div ref={(ref) => this.vis = ref} >
				<Dialog
					modal={true}
					open={this.state.kpiDialogOpen}
					onRequestClose={this.handleKpiClose}
					autoScrollBodyContent={true}
					contentStyle={{height: "95vh", maxWidth: 'none'}}
					>
				<MetricsAnalytics cid={this.props.cid} fid={this.state.editId} handleClose={this.handleClose} />
				</Dialog>
				<Dialog
					title="Create Subscore"
					open={this.state.showSubscoreDialog}
					modal={true}
					actions={actions}
					onRequestClose={this.handleSubscoreClose}
					>
					<Row>
						<Col md={1}></Col>
						<Col md={10}>
							<TextField value={this.state.subscoreName} onChange={this.handleTextUpdate} fullWidth={true} hintText="Subscore Name" floatingLabelText="Subscore Name"/>
						</Col>
						<Col md={1}></Col>
					</Row>
				</Dialog>
				{this.renderPopover()}
				<Col className="tab-col" md={3}>
					<div className="tab-content" style={{backgroundColor: 'white'}}>
						<Row>
							<Col md={12}>
								<div className="title med small-pad center">Custom KPIs</div>
								<Divider />
								<List>
									<ListItem
										leftIcon={<DataIcon style={{color: Colors.MAIN}}/>}
										primaryText="Create KPI"
										key={uuid.v4()}
										secondaryText="Define custom metric"
										disabled={true}
										rightIconButton={<IconButton tooltip="New" tooltipPosition="bottom-left" touch={true} style={{color: Colors.GREEN_BASE}} onTouchTap={this.onKpiAdd}><AddIcon size={20}/></IconButton>}
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
								<DataBrowser node={(typeof(nodes) !== 'undefined') ? nodes.get(this.state.currentNode) : null } cid={this.props.cid} currentNode={this.state.currentNode} />
							</Col>
						</Row>
					</div>
				</Col>
			</div>
		);
	}
});

module.exports = ScoreTab;
