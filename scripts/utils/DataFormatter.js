

var DataFormatter = function(val) {
	// drop trailing 0 if even
	val = Math.round(val * 1000) / 1000;// / 1;
  while (/(\d+)(\d{3})/.test(val.toString())){
    val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
  }
  return val;
}

module.exports = DataFormatter;
