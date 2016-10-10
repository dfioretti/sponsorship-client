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
	mixins: [ FluxMixin ],

	getInitialState: function() {
		return { nodeToggles: [true], nodeWeights: [100], loaded: false, formulas: [], uuid: uuid.v4(), usedMetrics: [], update: false, loadedMetrics: [], showPopover: false, x: 0, y: 0, currentNode: 0, currentSliderValue: 1 }
	},
	componentWillMount: function() {
		//this.loadScore(this.props);
	},
	componentWillReceiveProps: function(newProps) {
		//this.loadScore(newProps);
	},
	loadScore: function(props) {
		console.log('load score', props);
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
			console.log('keys', nodeList, edgeList);
			nodeIds = _.keys(nodeList);
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
		//var formula = this.getFlux().store("DocumentStore").getFormula({ uuid: uuid });
		this.props.onKpiUpdate(id);
		//console.log('formula is', formula);
		//console.log("event", obj, event, event.target);
	},
	onKpiCheck: function(event, isInputChecked) {
		console.log('kpi check', event, isInputChecked);
		//console.log('on kpi check!');
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
		console.log('kpi check', event, isChecked);
		//console.log('on kpi check!');
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
				//usedMetrics: this.state.usedMetrics.concat(used)
			});
		}
		console.log('check metric', id, name, event, isChecked);
	},
	renderDefinedKpis: function() {
		console.log('calling defined', this.state);
		console.log('huh', this.state.formulasColl, this.props.contextId);
		return (
			this.props.formulasColl.find({context: this.props.contextId }).map(function(kpi) {
				return (
					<ListItem
						primaryText={kpi.name}
						key={kpi.uuid}
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
	/*
	<IconMenu
		anchorOrigin={{horizontal: 'right', vertical: 'top'}}
		targetOrigin={{horizontal: 'right', vertical: 'top'}}
		iconButtonElement={<IconButton><MoreIcon size={20} /></IconButton>}
	>
			<ListItem disabled={true} leftIcon={<NodesIcon />} primaryText="Add To Model" />
			<Divider />
			<MenuItem primaryText="Test 1" />
			<MenuItem primaryText="Test 2" />
	</IconMenu>}
	*/
	//						leftIcon={<IconButton onTouchTap={this.editKpi.bind(this, kpi.name, kpi.id)}><EditIcon size={20}/></IconButton>}
	//						rightIconButton={<IconButton onTouchTap={this.moreIcon} ><MoreIcon size={20}/></IconButton>}


	onAddMetric: function(event) {
		//console.log('clicked on add metric', event);
	},
	renderMetric: function(data) {
		return null;
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
		console.log("built key: ", key);
		this.props.onModelChange(model);
	},
	addChild: function() {
		console.log('calle dadd child', this.state);
		//this.setState({showPopover: false});
		this.addNode(this.state.currentNode, '');
	},
	onToggle: function() {
		this.nodeToggles = this.state.nodeToggles;
		this.nodeToggles[this.state.currentNode] = !this.nodeToggles[this.state.currentNode];
		this.setState({nodeToggles: this.nodeToggles});
	},
	onSliderChange: function(value) {
		this.nodeWeights = this.state.nodeWeights;
		this.nodeWeights[this.state.currentNode] = value;
		//this.setState({nodeWeights: this.nodeWeights});
	},
	onAfterChange: function(value) {
		this.nodeWeights = this.state.nodeWeights;
		this.nodeWeights[this.state.currentNode] = value;
		this.setState({nodeWeights: this.nodeWeights});
	},
	percentFormatter: function(v) {
		return `${v} %`;
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
						primaryText={<RcSlider onAfterChange={this.onAfterChange} tipFormatter={this.percentFormatter} defaultValue={this.state.nodeWeights[this.state.currentNode]} onChange={this.onSliderChange} />}
						></ListItem>
					<ListItem primaryText="Normalize"
						leftIcon={<NormalizeIcon />}
						rightToggle={<Toggle onToggle={this.onToggle} toggled={this.state.nodeToggles[this.state.currentNode]}/>}
						></ListItem>
						<ListItem
							primaryText="Add Child"
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
			//							nestedItems={this.getNestedItems()}
			/*
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
							<Slider onChange={this.onWeightChange.bind(this, this.state.currentNode)} value={nodes.get(this.state.currentNode).weight} style={{maring: 0, padding: 0}} sliderStyle={{margin: 0, padding: 0}}/>
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
					/>
			</List>
			*/

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
			this.onModelChange();
			//this.forceUpdate();
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
			this.setState({showPopover: false});
			var label = "";
			var type = "node";
			var id = 0;
			if (kpi.length > 0) {
				label = this.props.formulasColl.findOne({id: kpi}).name;
				type = "formula";
				id = kpi;
			}
			var color = "#000000";
			var id = nodeCounter;
			nodeCounter = nodeCounter + 1;
			var edgeId = edgeCounter;
			edgeCounter = edgeCounter + 1;
			//var url = generateNode();
			nodes.add({ id: id, weight: 1, normalize: true, type: type, id: id, labelHighlightBold: false, borderWidthSelected: 1, label: label, shape: 'dot', font:{face: 'Avenir-Book', color: color}, color: '#1C5D99'});
			edges.add({
				id: edgeId,
				from: parent,
				to: id
			});
			//nodes.add({id: id, image: url, shape: 'image' });
			nodeIds.push(id);
			this.setState({
				nodeToggles: this.state.nodeToggles.concat(true),
				nodeWeights: this.state.nodeWeights.concat(100)
			});
			// remove from remaining
			//this.onModelChange();
		},
		getNestedItems: function() {
			var items = [];
			this.state.loadedMetrics.map(function(m) {
				console.log('nested', m);
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
			var color = "#000000";
			if (typeof(nodeList) == 'undefined') {
				nodeList = [
					{ id: 0, labelHighlightBold: false, weight: 1, normalize: true, borderWidthSelected: 1, label: 'MODEL', shape: 'circle', font:{face: 'Avenir-Book', color: color}, color: '#1C5D99'}
				];
				edgeList = [];
				nodeIds = [];
				nodeCounter = 1;
				edgeCounter = 0;
			}
			nodes = new vis.DataSet(nodeList);
			edges = new vis.DataSet(edgeList);
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
			//								<Toolbar style={{height: 40}}/>

/*	<Row style={{height: '20%', backgroundColor: 'blue'}}>
		<Col md={12}>
			<div style={{height: '100%'}}>
				<div className="title med small-pad center">Available KPIs</div>
				<div style={{display: 'flex', flexWrap: 'wrap'}}>
					{this.state.loadedMetrics.map(this.renderMetric, this)}
				</div>
			</div>
		</Col>
	</Row>*/
			return (
				<div>
					<Col md={7}>
						<div className="tab-content">
							<Row style={{height: "100%", backgroundColor: 'white'}}>
								<div className="title med small-pad center">Model</div>
								<Divider />
								<Col  md={12} style={{height: 'calc(100% - 40px)'}}>
									<div  id="vis" style={{height: '100%'}}>
									</div>
								</Col>
							</Row>

						</div>
					</Col>
					<Col md={5}>
						<div className="tab-content">
							<div style={{height: '100%', width: "100%"}}>
								<DataBrowser node={(typeof(nodes) !== 'undefined') ? nodes.get(this.state.currentNode) : null } formulasColl={this.props.formulasColl} metricsColl={this.props.metricsColl} scopeProperties={this.props.scopeProperties} currentNode={this.state.currentNode} />
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
