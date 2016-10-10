var React = require('react');
var DragDropContext = require('react-dnd').DragDropContext;
var HTML5Backend = require('react-dnd-html5-backend');
var DropMetric = require('./DropMetric.jsx');
var uuid = require('node-uuid');
var Avatar = require('material-ui').Avatar;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var DragMetric = require('./DragMetric.jsx');
var Chip = require('material-ui').Chip;
var titleize = require('underscore.string/titleize');
var PlusIcon = require('react-icons/lib/ti/plus');
var MinusIcon = require('react-icons/lib/ti/minus');
var DivideIcon = require('react-icons/lib/ti/divide');
var MultiplyIcon = require('react-icons/lib/ti/times');
var Badge = require('material-ui').Badge;
var Slider = require('material-ui').Slider;
var Overlay = require('react-bootstrap').Overlay;
var ReactDOM = require('react-dom');
var Toggle = require('material-ui').Toggle;
var Tooltip = require('react-bootstrap').Tooltip;
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;


var emptyStyle = {
	height: 150,
	width: 50,
	backgroundColor: 'black'
}

var inputWeights;

var FormulaContainer = React.createClass({
	getInitialState: function() {
		return { currentSliderValue: 1, functions: {}, showPopover: false, currentInput: null, popovers: {}, update: false, inputData: [], outputData: [] }
	},
	componentWillMount: function() {
		inputWeights = {};
		this.setState({
			outputData: this.props.outputData
		});
	},
	componentWillReceiveProps: function(nextProps) {
		//var weights = this.state.inputWeights;
		nextProps.inputData.map(function(input) {
			inputWeights[input.key] = (input.weight) ? input.weight : 1;
		}.bind(this));
		var output = nextProps.outputData;
		if (this.state.outputData.length > 0) {
			output = this.state.outputData;
		}
		this.setState({
			inputData: nextProps.inputData,
			outputData: output
			//inputWeights: weights
		});
	},
	handleDrop: function(item) {
		if (this.state.outputData.length > 0) return;
		item['dropId'] = uuid.v4();
		if (typeof(item.key) == 'undefined') {
			item['key'] = uuid.v4();
		}
		this.props.updateOutput(this.state.outputData.concat(item));
		this.setState({
			outputData: this.state.outputData.concat(item)
		});
	},
	handleValueDrop: function(item) {
		//console.log('handle value drop?', item);
	},
	handleNormWeight: function(item) {
		console.log('norm weight for', item);
	},
	renderOutputs: function(data) {
		var style = {
			display: 'inline-block',
			verticalAlign: 'middle'
		}
		var noPad = {
			margin: 0,
			padding: 0,
			cursor: 'not-allowed'
		}
		var tiny = {
			margin: 1,
			padding: 1
		}
		var el = null;
		switch (data.dragType) {
			//var tooltip = <Tooltip placement="top" className="in">test tool tip</Tooltip>;
			/*
			<span className="tooltiptext">
			{titleize(data.point.split("_").join(" "))}
			</span>
			labelStyle={{cursor: 'context-menu'}}

			*/
			case 'value':
			el = (
				<DropMetric title="this is a title" dropType="value" style={style} key={uuid.v4()} onDrop={(item) => this.handleValueDrop(item)}>
					<Chip
						key={data.key}
						title={titleize(data.point.split("_").join(" "))}
						onTouchTap={() => this.handleNormWeight(data.key)}
						onRequestDelete={() => this.handleOutputRequestDelete(data.key)}
						>
						<Avatar size={32} src={data.icon} />
					</Chip>
				</DropMetric>
			);
			break;
			case 'parens':
			var font = {
				fontSize: 50,
				fontWeight: 'bold',
				verticalAlign: 'middle'
			};
			if (data.text == '(') {
				el = (
					<div style={style} key={uuid.v4()}>
						<Chip
							key={data.key}
							style={noPad}
							labelStyle={tiny}
							backgroundColor="transparent"
							onTouchTap={() => this.handleOutputRequestDelete(data.key)}
							>
							<span style={font}>(</span>
						</Chip>
					</div>
				);
			} else {
				el = (
					<div style={style} key={uuid.v4()}>
						<Chip
							key={data.key}
							style={noPad}
							labelStyle={tiny}
							backgroundColor="transparent"
							onTouchTap={() => this.handleOutputRequestDelete(data.key)}
							>
							<span style={font}>)</span>
						</Chip>
					</div>
				);
			}
			break;
			case 'operation':
			switch (data.text) {
				case '+':
				el = (
					<div style={style} key={uuid.v4()}>
						<Chip
							key={data.key}
							style={noPad}
							labelStyle={tiny}
							backgroundColor="transparent"
							onTouchTap={() => this.handleOutputRequestDelete(data.key)}
							>
							<PlusIcon size={32} />
						</Chip>
					</div>
				);
				break;
				case '-':
				el = (
					<div style={style} key={uuid.v4()}>
						<Chip
							key={data.key}
							style={noPad}
							labelStyle={tiny}
							backgroundColor="transparent"
							onTouchTap={() => this.handleOutputRequestDelete(data.key)}
							>
							<MinusIcon size={32} />
						</Chip>
					</div>);
					break;
					case '/':
					el = (
						<div style={style} key={uuid.v4()}>

							<Chip
								key={data.key}
								style={noPad}
								labelStyle={tiny}
								backgroundColor="transparent"
								onTouchTap={() => this.handleOutputRequestDelete(data.key)}
								>
								<DivideIcon size={32} />
							</Chip>
						</div>
					);
					break;
					case '*':
					el = (
						<div style={style} key={uuid.v4()}>

							<Chip
								key={data.key}
								style={noPad}
								labelStyle={tiny}
								backgroundColor="transparent"
								onTouchTap={() => this.handleOutputRequestDelete(data.key)}
								>
								<MultiplyIcon size={32} />
							</Chip>
						</div>
					);
					break;
				}
			};
			return el;
		},
		handlePlaceholderDrop: function(side, item) {
			item['dropId'] = uuid.v4();
			item['key'] = uuid.v4();
			if (side == 'rightHolder') {
				this.props.updateOutput(this.state.outputData.concat(item));
				this.setState({
					outputData: this.state.outputData.concat(item)
				});
			} else {
				this.props.updateOutput([item].concat(this.state.outputData));
				this.setState({
					outputData: [item].concat(this.state.outputData)
				});
			}
		},
		renderTools: function() {
			var style = {
				fontSize: 32,
				verticalAlign: 'middle',
				fontWeight: 'bold',
				paddingLeft: 5,
				paddingRight: 5,
				cursor: 'move'
			};
			var display = {
				display: 'inline-block',
				cursor: 'move'

			};
			return (
				<div>
					<DragMetric style={display} dragType="operation" text="+" key={uuid.v4()} type="+">
						<PlusIcon style={display} size={32} />
					</DragMetric>
					<DragMetric style={display} dragType="operation" text="-" key={uuid.v4()} type="-">
						<MinusIcon style={display} size={32} />
					</DragMetric>
					<DragMetric style={display} dragType="operation" text="*" key={uuid.v4()} type="x">
						<MultiplyIcon style={display} size={32} />
					</DragMetric>
					<DragMetric style={display} dragType="operation" text="/" key={uuid.v4()} type="/">
						<DivideIcon style={display} size={32} />
					</DragMetric>
					<DragMetric style={display} dragType="parens" text="(" type="leftParen" key={uuid.v4()}>
						<span style={style}>(</span>
					</DragMetric>
					<DragMetric style={display} dragType="parens" text=")" type="rightParen" key={uuid.v4()}>
						<span style={style}>)</span>
					</DragMetric>
				</div>
			)
		},
		renderPlaceholder: function(side) {
			var style = {
				display: 'inline-block',
				height: 60,
				width: 75,
				border: "2px dashed rgba(51, 54, 59, 0.1)",
				margin: 5,
				//borderRadius: '50%'
			}
			if (this.state.outputData.length > 0) {
				return (
					<DropMetric dropType={side} style={style} key={uuid.v4()} onDrop={(item) => this.handlePlaceholderDrop(side, item)}>
						<Chip
							backgroundColor="transparent"
							key={uuid.v4()}
							>
							<Avatar
								size={32}
								backgroundColor="transparent"
								/>
						</Chip>
					</DropMetric>
				);
			}
			return null;
		},
		handleRequestDelete: function(key) {
			this.inputData = this.state.inputData;
			var inputToDelete = this.inputData.map((input) => input.key).indexOf(key);
			this.inputData.splice(inputToDelete, 1);
			this.setState({inputData: this.inputData});
		},
		handleOutputRequestDelete: function(key) {
			this.outputData = this.state.outputData;
			var outputToDelete = this.outputData.map((output) => output.key).indexOf(key);
			this.outputData.splice(outputToDelete, 1);
			this.props.updateOutput(this.outputData);
			this.setState({outputData: this.outputData});
		},
		hideOverlay: function(data, event) {
			this.setState({
				showPopover: false,
				currentInput: null
			});
			/*
			var popovers = this.state.popovers;
			if (typeof(popovers[data.key]) === 'undefined') {
			popovers[data.key] = true;
			} else {
			popovers[data.key] = false;
			}
			this.setState({
			popovers: popovers
			});
			*/
		},
		showOverlay: function(event) {
			event.preventDefault();
			console.log('this is show', event, event.nativeEvent, event.currentTarget.id);
			this.props.onSelectInput(event.nativeEvent, event.currentTarget.id);
			/*
			this.inputData = this.state.inputData;
			var popovers = this.state.popovers;
			var toggleState = false;
			if (typeof(popovers[data.key]) !== 'undefined') {
			toggleState = !popovers[data.key];
			}
			popovers[data.key] = toggleState;
			this.setState({
			popovers: popovers
			});
			*/
		},
		onNormalizeToggle: function(formulaInput, event, isToggled) {
			this.inputData = this.state.inputData;
			var inputIndex = this.inputData.map((input) => input.key).indexOf(formulaInput.key);
			this.inputData[inputIndex].normalize = !this.inputData[inputIndex].normalize;
			this.setState({
				inputData: this.inputData
			});
		},
		renderInput: function(data) {
			console.log('render input', data);
			/*
			var showState = this.state.popovers[data.key];
			var show = false;
			if (typeof(showState) === 'undefined') {
			show = true;
			} else {
			show = showState;
			}
			/*
			var weight = 1;
			if (typeof(inputWeights[data.key]) !== 'undefined') {
			weight = inputWeights[data.key];
			}
			*/
			return (
				<DragMetric dragType="value" ref={data.key} style={{padding: 2}} key={uuid.v4()} id={data.key} type={data.type} source={data.source} point={data.metric} metric={data.metric} text={data.metric} icon={data.image} image={data.image}>
					<Chip
						key={data.key}
						style={{margin: 0, cursor: 'move'}}
						id={data.key}
						onRequestDelete={() => this.handleRequestDelete(data.key)}
						onTouchTap={this.showOverlay}
						>
						<Avatar src={data.image} />
						{titleize(data.metric.split("_").join(" "))}
					</Chip>
				</DragMetric>
			);
		},
		onWeightChange: function(event, value) {
			//console.log('event', input, event, value);
			/*
			this.setState({
			currentSliderValue: value
			});
			*/
			this.inputs = this.state.inputData;
			var inputIndex = this.inputs.map((input) => input.key).indexOf(this.state.currentInput.key);
			this.inputs[inputIndex].weight = value;
			this.setState({
				inputData: this.inputs
			});
			inputWeights[this.state.currentInput.key] = value;
			//this.forceUpdate();
			//this.setState({
			//	update: true
			//});
			//this.forceUpdate();
			//console.log('event', event.target, event.target.key);
			/*
			this.inputWeights[formulaInput.key] = value;
			this.inputData = this.state.inputData;
			var inputIndex = this.inputData.map((input) => input.key).indexOf(formulaInput.key);
			this.inputData[inputIndex].weight = value;
			this.setState({
			inputData: this.inputData
			});
			*/
			//console.log('iw is: ', inputWeights, formulaInput, event, value);
			//inputWeights[formulaInput.key] = value;
			//						{this.state.inputData.map(this.renderInput, this)}
			/*
			<span className="med-text" style={{fontSize: 15, fontWeight: 600, paddingBottom: 8}}>Format Data</span>
			<Toggle onToggle={this.onNormalizeToggle.bind(this, data)} style={{margin: 0, padding: 0}} ref={'tog-' + data.key} labelStyle={{fontSize: "12px", textTransform: "uppercase", letterSpacing: "1.5px", fontFamily: "Avenir-Book", color: "rgba(0, 0, 0, 0.6)", fontWeight: "normal"}} label="Normalize" toggled={data.normalize} />
			<span className="med-text">Weight</span>
			<Row>
			<Col md={9}>
			<Slider sliderStyle={{margin: 0, padding: 0}} style={{margin: 0, padding: 0}} value={this.inputWeights[data.key]} key={data.key} id={data.key} onChange={this.onWeightChange.bind(this, data.key)} />
			</Col>
			<Col md={2}>
			{Math.round(this.inputWeights[data.key] * 100, 0)}
			</Col>
			</Row>
			*/
		},
		onDragStop: function() {
			//this.forceUpdate();
		},
		renderOverlay: function() {
			if (this.state.currentInput === null) return;
			return (
				<Overlay
					show={this.state.showPopover}
					onHide={this.hideOverlay}
					rootClose={true}
					placement="top"
					container={this}
					key={uuid.v4()}
					target={() => ReactDOM.findDOMNode(this.refs[this.state.currentInput.key])}
					>
					<div className="chip-pop" style={{
							position: 'absolute',
							backgroundColor: '#EEE',
							boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)',
						}}
						>
						<span className="med-text" style={{fontSize: 15, fontWeight: 600, paddingBottom: 8}}>Format Data</span>
						<Toggle onToggle={this.onNormalizeToggle.bind(this, this.state.currentInput)} style={{margin: 0, padding: 0}}  labelStyle={{fontSize: "12px", textTransform: "uppercase", letterSpacing: "1.5px", fontFamily: "Avenir-Book", color: "rgba(0, 0, 0, 0.6)", fontWeight: "normal"}} label="Normalize" toggled={this.state.currentInput.normalize} />
						<span className="med-text">Weight</span>
						<Row>
							<Col md={9}>
								<Slider sliderStyle={{margin: 0, padding: 0}} style={{margin: 0, padding: 0}} value={inputWeights[this.state.currentInput.key]} onChange={this.onWeightChange} />
							</Col>
							<Col md={2}>
								{Math.round(inputWeights[this.state.currentInput.key] * 100, 0)}
							</Col>
						</Row>
						<div className="pop-arrow"></div>
					</div>
				</Overlay>
			);
		},
		render: function() {
			return (
				<div style={{width: "100%"}}>
					<div style={{height: 200, width: '100%' }}>
						{this.renderTools()}
						<h6 style={{textTransform: "uppercase", letterSpacing: '1.5px'}}>Data</h6>
						{this.state.inputData.map(function(input) {
							return (
								this.renderInput(input)
							);
						}.bind(this))}
					</div>
					<h4 style={{paddingTop: "10px", textTransform: "uppercase", letterSpacing: "1.5px"}}>KPI Formula</h4>
					<DropMetric style={{height: 200, width: '100%', paddingTop: "50px", textAlign: 'center', border: "2px dashed rgba(51, 54, 59, 0.2)"}} dropType="formula" onDrop={(item) => this.handleDrop(item)}>
						{this.renderPlaceholder("leftHolder")}
						{this.state.outputData.map(this.renderOutputs, this)}
						{this.renderPlaceholder("rightHolder")}
					</DropMetric>
				</div>
			);
		}
	});

	module.exports = DragDropContext(HTML5Backend)(FormulaContainer);
	//					{this.renderOverlay()}
