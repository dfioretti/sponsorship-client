var _ = require('underscore');
var DataFormatter = require('../../utils/DataFormatter.js');

var ChartTooltipHandler = {
  isTooltip: function (tooltip) {
    var tooltipEl = $(this.refs.chartjsTooltip);

    if (!tooltip) {
        tooltipEl.css({
            opacity: 0
        });
    }

    return tooltip;
  },
  renderTooltip: function (tooltip, tooltipTitle, chartData) {
    if (typeof(tooltip.labels) === 'undefined') return;
    var tooltipEl = $(this.refs.chartjsTooltip);

     var innerHtml = '';
     innerHtml+= '<h6>' + tooltipTitle  + '</h6>';
     for (var i = tooltip.labels.length - 1; i >= 0; i--) {

      // Needed to Handle datapoints with missing values
      var strokeColor = tooltip.legendColors[i].stroke;
      var dataset = _.find(chartData.datasets, function (dataset) {
        return strokeColor === dataset.strokeColor;
      });

      innerHtml += [
        '<div class="chartjs-tooltip-section">',
        ' <span class="chartjs-tooltip-key" style="background-color:' + dataset.strokeColor + '"></span>',
        ' <span class="chartjs-tooltip-value">' + dataset.label + ': ' + DataFormatter(tooltip.labels[i]) + '</span>',
        '<div class="arrow-down"></div>',
        '</div>'
      ].join('');
     }
     tooltipEl.html(innerHtml);
     tooltipEl.css({
         opacity: 1,
         left: (tooltip.x - 65) + 'px',
         top: (tooltip.y - 72) + 'px',
         fontFamily: tooltip.fontFamily,
         fontSize: tooltip.fontSize,
         fontStyle: tooltip.fontStyle,
     });
  }
};
module.exports = ChartTooltipHandler;
