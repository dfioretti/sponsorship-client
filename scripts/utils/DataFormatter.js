

var DataFormatter = function(val) {
	if (val < 1) val = val * 100;
	val = Math.round(val * 1000) / 1000;// / 1;
  while (/(\d+)(\d{3})/.test(val.toString())){
    val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
  }
	if (val === 1) return 100;
  return val;
};

module.exports = DataFormatter;
