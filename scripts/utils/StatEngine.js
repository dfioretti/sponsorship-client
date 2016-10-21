var math = require('mathjs');
var ss = require('simple-statistics');
var uuid = require('node-uuid');
var _ = require('underscore');

function StatEngine() {
	this.formula = null;
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
	
	rank: function(metric, list) {
		list.sort();
		return ( ( list.indexOf( metric ) + 1 ) / list.length );
	},
	getAggregateStats: function(properties, metricsColl) {
		var ret = [];
		var metrics = metricsColl.chain().find({entity_key: properties[0]}).data();
		console.log('metrics', metrics);
		metrics.map(function(met) {
			var result = metricsColl.chain().find({
				'$and' : [ { metric: met.metric }, { entity_key: { '$in' : properties } } ]
			}).simplesort("value").data();
			console.log('result', result);
			var values = [];
			result.map(function(r) {
				values.push(r.value);
			});
			var data = {
				min: ss.minSorted(values),
				max: ss.maxSorted(values),
				mean: ss.mean(values),
				median: ss.medianSorted(values),
				mode: ss.modeSorted(values),
				variance: ss.variance(values),
				stdev: ss.standardDeviation(values),
				metric: met.metric,
				icon: met.icon,
				source: met.source,
				id: uuid.v4()
			};
			ret.push(data);
		});
		console.log('aggretate', ret);
		return ret;
	},
	buildTreeNode: function(node, norm, weight) {
		return {
			id: node.id,
			parent: node.parent,
			children: [],
			weight: weight / 100.0,
			fid: node.fid,
			type: node.type
		};
	},
	buildScoreTree: function(model) {
		var treeNodes = [];
		var rootNode = null;

		model.nodeList.map(function(n, i) {
			if (n.id == 0) {
				rootNode = this.buildTreeNode(n, model.nodeToggles[i], model.nodeWeights[i]);
			} else {
				treeNodes.push(this.buildTreeNode(n, model.nodeToggles[i], model.nodeWeights[i]));
			}
		}.bind(this));

		var nodeList = { 0: rootNode };
		treeNodes.map(function(n) {
			nodeList[n['id']] = n;
			nodeList[n['parent']]['children'].push(nodeList[n['id']]);
		});
		return rootNode;
	},
	scoreNode: function(node, data) {
		if (node.parent == -1) {
			console.log('at the root');
		} else if (node.children.length == 0) {
			this.calculateModelFormula(node, data);
		} else {
			this.calculateSubscore(node, data);
		}
		return data;
	},
	calculateModelFormula: function(node, data) {
		console.log('in calculate model formula', node, data);
		var formula = this.calculateFormula(node.fid, this.formulasColl, this.properties, this.metricsColl);
		console.log('testing 123', formula);
	},
	calculateSubscore: function(node, data) {
		console.log('in claulate subscore', node, data);
	},
	traverse: function(node, data) {
		node.children.map(function(c) {
			this.traverse(c, data);
		}.bind(this));
		data = this.scoreNode(node, data);
	},
	calculateModel: function(formulasColl, metricsColl, properties, modelsColl) {
		this.formulasColl = formulasColl;
		this.metricsColl = metricsColl;
		this.properties = properties;

		console.log('called calcluate', modelsColl);
		var model = modelsColl.find()[0];
		console.log('model is', model);
		var tree = this.buildScoreTree(model);
		this.traverse(tree, {});
	},
	calculateFormula: function(formulaId, formulaColl, properties, metricsColl) {
		if (typeof(formulaColl) === 'undefined') return [];
		var kpi = formulaColl.findOne({ id: formulaId });
		var formulaData = {};
		var scopes = {};
		var variables = {};

		if (kpi == null) return {};
		properties.map(function(property) {
			scopes[property] = {};
			variables[property] = {};
		});
		// load KPI Stats
		kpi.formula.map(function(item, index) {
			var result;
			if (item.length != 1) {
				result = metricsColl.chain().find({
					'$and' : [ { metric: item }, { entity_key: { '$in' : properties } } ]
				}).simplesort("value").data();

				var values = [];
				var inputs = {};
				result.map(function(r) {
					var val = parseFloat(r.value);
					values.push(val);
					scopes[r.entity_key][r.metric] = { 'value' : val };
				});

				var stdev = ss.standardDeviation(values);
				var mean = ss.mean(values);
				var zScores = [];
				// compute z-scores
				_.keys(scopes).map(function(ek) {
					var zScore = ss.zScore(scopes[ek][item]['value'], mean, stdev);
					scopes[ek][item]['z-score'] = zScore;
					zScores.push(zScore);
				});

				// compute rankings
				_.keys(scopes).map(function(ek) {
					var rank = this.rank(scopes[ek][item]['z-score'], zScores)
					scopes[ek][item]['rank'] = rank;
					scopes[ek][item]['weight'] = kpi.formulaWeights[index];
					scopes[ek][item]['raw_weight'] = math.round(kpi.formulaWeights[index] * scopes[ek][item]['value'], 2);
					scopes[ek][item]['rank_weight'] = math.round(kpi.formulaWeights[index] * rank, 2);
					if (kpi.formulaToggles[index]) {
						variables[ek][item] = scopes[ek][item]['rank_weight'];
					} else {
						variables[ek][item] = scopes[ek][item]['raw_weight'];
					}
				}.bind(this));

				// stats
				var data = {
					min: ss.minSorted(values),
					max: ss.maxSorted(values),
					mean: ss.mean(values),
					median: ss.medianSorted(values),
					mode: ss.modeSorted(values),
					variance: ss.variance(values),
					stdev: ss.standardDeviation(values),
				};
				formulaData[item] = data;
			}
		}.bind(this));

		var expression = kpi.formula.join(" ");
		var formulaValues = [];
		_.keys(variables).map(function(key) {
			var result = math.eval(expression, variables[key]);
			scopes[key][kpi.name] = { value: math.round(result, 2)};
			formulaValues.push(math.round(result, 2));
		});
		stdev = ss.standardDeviation(formulaValues);
		mean = ss.mean(formulaValues);
		zScores = [];
		_.keys(variables).map(function(ek) {
			var zScore = ss.zScore(scopes[ek][kpi.name]['value'], mean, stdev);
			scopes[ek][kpi.name]['z-score'] = zScore;
			zScores.push(zScore);
		});

		_.keys(scopes).map(function(ek) {
			var rank = this.rank(scopes[ek][kpi.name]['z-score'], zScores)
			scopes[ek][kpi.name]['rank'] = rank;
			scopes[ek][kpi.name]['weight'] = 100;//kpi.formulaWeights[index];
			scopes[ek][kpi.name]['raw_weight'] = math.round(100 * scopes[ek][kpi.name]['value'], 2);
			scopes[ek][kpi.name]['rank_weight'] = math.round(100 * rank, 2);
		}.bind(this));

		var ret = [];
		var obj = {};
		_.keys(scopes).map(function(key) {
			_.keys(scopes[key]).map(function(met) {
				if (true) { // exclude the formula
					var obj = {};
					obj['metric'] = met;
					obj['entity_key'] = key;
					_.keys(scopes[key][met]).map(function(val) {
						obj[val] = scopes[key][met][val];
					});
					obj['id'] = uuid.v4();
					ret.push(obj);
				}
			});
		});
		var ret2 = [];
		_.keys(formulaData).map(function(met) {
			var obj = {};
			obj['metric'] = met;
			obj['id'] = uuid.v4();
			_.keys(formulaData[met]).map(function(v) {
				obj[v] = formulaData[met][v];
			});
			ret2.push(obj);
		});
		kpi['stats'] = ret;
		formulaColl.update(kpi);
		return { data: ret, stats: ret2 };
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
