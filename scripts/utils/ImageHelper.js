/*
 * Image paths got messed up when changing environments &
 * build tools.  This will serve to resolve issues for now.
 */
var ImageHelper = function(type, path) {
	if (path.indexOf('images') < 0 ) {
		return '/images' + path;
	}
	return path;
}
module.exports = ImageHelper;
