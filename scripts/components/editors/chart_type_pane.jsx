var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Link = require('react-router').Link,
		LineIcon = require('react-icons/lib/fa/line-chart');
		BarIcon = require('react-icons/lib/fa/bar-chart');
		PieIcon = require('react-icons/lib/fa/pie-chart');
		DIcon = require('react-icons/lib/fa/circle-o-notch');
		ListIcon = require('react-icons/lib/fa/list-ul');
		MuiThemeProvider = require('material-ui').MuiThemeProvider;
		//cyan500 = require('material-ui/lib/styles/colors').cyan500;
		getMuiTheme = require('material-ui/lib/styles').getMuiTheme;
		//require('material-ui').getMuiTheme;
		SelectField = require('material-ui').SelectField;
		MenuItem = require('material-ui').MenuItem;
		ScoreIcon = require('react-icons/lib/fa/calculator');
		StoreWatchMixin = Fluxxor.StoreWatchMixin;

var ChartTypePane = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("ComponentEditorStore")],

  getStateFromFlux: function() {
    return this.getFlux().store("ComponentEditorStore").getState();
  },
  handleChartTypeChange: function(e, i, v) {
		console.log(e);
    //this.getFlux().actions.updateType(e.target.value);
		this.getFlux().actions.updateType(v);
    this.getFlux().actions.generatePreviewData(this.getFlux().store("ComponentEditorStore").getObject());
  },
	renderChartImage: function() {
		var style = {
			fontSize: 300,
			display: 'flex',
			margin: 0,
			padding: 0,
			justifyContent: 'center',
			paddingLeft: "75px",
			color: "#03387a"
		}
		switch (this.getStateFromFlux().view) {
			case 'barChart':
				return <BarIcon style={style}/>
				break;
			case 'lineChart':
				return <LineIcon style={style}/>
				break;
			case 'pieChart':
				return <PieIcon style={style}/>
				break;
			case 'doughnutChart':
				return <DIcon style={style}/>
				break;
			case 'dataList':
				return <ListIcon style={style}/>
				break;
			case 'scoreView':
				return <ScoreIcon style={style} />
				break;
			}
	},
  render: function() {
    var chartTypes = [{ id: 'lineChart', name: 'Line Chart' },
                      { id: 'barChart', name: "Bar Chart" },
                      { id: 'pieChart', name: "Pie Chart" },
                      { id: 'doughnutChart', name: "Doughnut Chart" },
                      { id: 'dataList', name: "Data List" },
											{ id: 'scoreView', name: "Score View" },
                    ];
    var typeList = [];
    chartTypes.map(function(item) {
      typeList.push(<option key={item.id} value={item.id}>{item.name}</option>);
    }.bind(this));
    var chartImage = BarIcon;
    if (this.getStateFromFlux().view === 'barChart') {
			chartImage = BarIcon;
    }
		/*
		            <select onChange={this.handleChartTypeChange} value={this.getStateFromFlux().view}>
		              {typeList}
		            </select>*/
		var muiTheme = getMuiTheme({
			palette: {
				textColor: 'blue'
			}
		});

    return (

        <div className="">
					<br /><br />
						<label style={{textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: 16}}>Chart Type</label>
						<br />
						<SelectField
							value={this.state.view}
							style={{color: "green"}}
							fullWidth={true}
							selectFieldRoot={{selectedMenuItemStyle: {color: "green"}}}
							onChange={this.handleChartTypeChange}
							>
							<MenuItem  value={'lineChart'} id={'lineChart'} primaryText={"Line Chart"} />
							<MenuItem value={'barChart'} id={'barChart'} primaryText={"Bar Chart"} />
							<MenuItem value={'pieChart'} id={'pieChart'} primaryText={"Pie Chart"} />
							<MenuItem value={'doughnutChart'} id={'doughnutChart'} primaryText={"Doughnut Chart"} />
							<MenuItem value={'dataList'} id={'dataList'} primaryText={"Data List"} />
							<MenuItem value={'scoreView'} id={'scoreView'} primaryText={"Score View"} />
						</SelectField>
						{this.renderChartImage()}
      </div>
    );
  }
});

module.exports = ChartTypePane;
