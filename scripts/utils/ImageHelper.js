/*
 * Image paths got messed up when changing environments &
 * build tools.  This will serve to resolve issues for now.
 */
var ImageHelper = function(type, path) {
	console.log("[ImageHelper]", type, path);
	return '/images' + path;
}
module.exports = ImageHelper;
