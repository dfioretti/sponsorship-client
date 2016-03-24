module.exports = {
	//API_ROOT: "http://teneo-sponsorship-api.herokuapp.com/"
	API_ROOT: (location.href.indexOf('localhost') > -1) ? "http://localhost:4000/" : "http://teneo-sponsorship-api.herokuapp.com/"
};
