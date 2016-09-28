getApiRoot = function() {
    var url = location.href.split(':');
    // dev
    if (url.length == 3) {
        console.log("wtf");
        url = location.hostname;
        return "http://" + url + ":4000/";
        //return "" + url[0] + ":" + url[1] + ":4000/";
    } else {
        console.log("wtf2");
        //url = location.href.split('.');
        url = location.hostname;
        return "http://" + url + '/';
        //return "" + url[0] + "teneosponsorship.herokuapp.com/";
    }
};

module.exports = {
    /*
	//API_ROOT: "http://teneo-sponsorship-api.herokuapp.com/"
    API_ROOT = function() {
        var url = location.href.split(':');
        // dev
        if (url.length == 3) {
            return "" + url[0] + ":" + url[1] + ":4000/";
        } else {
            url = location.href.split('.');
            return "" + url[0] + "teneo-sponsorship-api.herokuapp.com/";
        }
    }
    */
    API_ROOT: getApiRoot()
    //API_ROOT: getApiUrl()
    //API_ROOT: (location.href.indexOf('localhost') > -1) ? "http://localhost:4000/" : "https://teneo-sponsorship-api.herokuapp.com/"

};
