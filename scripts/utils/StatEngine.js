var math = require('mathjs');

function StatEngine(formula) {
	this.formula = formula;
	this.collection = null;
	this.operations = [ '+', '-', '*', '/', '(', ')' ];
}

StatEngine.prototype = {
	setFormula: function(formula) {
		this.formula = formula;
	},
	setCollection: function(collection) {
		this.collection = collection;
	},
	runFormula: function() {
		var entityKey = 'chicago_bears';
		var scope = {};
		var expression = '';
		this.formula.formula.map(function(f) {
			if (f.dragType == 'value') {
				var metric = this.collection.findOne({
					'$and' : [{
						entity_key: entityKey
					},{
						metric: f.text
					}]
				});
				console.log('metric', metric, metric.value);
				scope[f.text] = parseFloat(metric.value);
				//scope[f.text] = this.collection.findOne({ entity_key: entityKey, metric: f.text}).value;
			}
			expression = expression + " " + f.text + " ";
		}.bind(this));
		var result = math.eval(expression, scope);
		console.log('result', result);
		console.log('running formula', expression, scope);
		console.log('in run formula', this.formula, this.collection);
	}
}

module.exports = StatEngine;
