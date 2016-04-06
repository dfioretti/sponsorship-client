/*
 * Image paths got messed up when changing environments &
 * build tools.  This will serve to resolve issues for now.
 */
var ImageHelper = function(type, path) {
	if (type == 'asset') {
		// this is hacky - but images are fucked up a little..
		if (path.charAt(path.length - 2) == 'n')
			return path;
			
		var id = path.split("/").pop(-1);

		return '/images/properties/' + id;
	}
	if (path.indexOf('images') < 0 ) {
		return '/images' + path;
	}
	return path;
}
module.exports = ImageHelper;
