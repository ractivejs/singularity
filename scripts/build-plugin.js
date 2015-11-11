var path = require( 'path' );
var sander = require( 'sander' );
var rollup = require( 'rollup' );
var babel = require( 'rollup-plugin-babel' );

var REPO = 'https://github.com/ractivejs/ractive-plugins';
var pkgSortOrder = 'name description version author contributors main jsnext:main homepage repository bugs files keywords license'.split( ' ' );

module.exports = dir => {
	var resolved = path.resolve( dir );
	var name = path.basename( dir );

	console.error( `building ${name}...` );

	try {
		var plugin = require( path.join( resolved, 'plugin.json' ) );
	} catch ( err ) {
		throw new Error( dir + ' does not have a valid plugin.json file' );
	}

	if ( !plugin.version ) throw new Error( dir + '/plugin.json does not specify a version' );
	if ( !plugin.global ) throw new Error( dir + '/plugin.json does not specify a global export' );

	return sander.rimraf( dir, 'dist' )
		.then( () => {
			return rollup.rollup({
				entry: path.join( resolved, 'src/index.js' ),
				plugins: [ babel() ]
			});
		})
		.then( bundle => {
			return Promise.all([
				// main
				bundle.write({
					dest: path.join( resolved, `dist/${name}.umd.js` ),
					format: 'umd',
					moduleName: plugin.global
				}),

				// jsnext:main
				bundle.write({
					dest: path.join( resolved, `dist/${name}.es6.js` ),
					format: 'es6'
				})
			]);
		})
		.then( () => {
			try {
				var pkg = require( path.join( resolved, 'package.json' ) );
			} catch ( err ) {
				pkg = {};
			}

			// set some defaults...
			pkg.name = name;
			pkg.version = plugin.version;
			pkg.repository = { type: 'git', url: REPO };
			pkg.bugs = { url: REPO };
			pkg.homepage = `http://plugins.ractivejs.org/${name}`;
			pkg.main = `dist/${name}.umd.js`;
			pkg[ 'jsnext:main' ] = `dist/${name}.es6.js`;
			pkg.files = [ 'dist', 'README.md' ];
			pkg.license = 'MIT';
			pkg.keywords = [ 'ractive', 'ractive-plugin' ];

			// but allow overrides
			[ 'description', 'author', 'contributors', 'license', 'files', 'keywords' ].forEach( field => {
				if ( plugin[ field ] ) plugin[ field ] = pkg[ field ];
			});

			// sort fields
			var sorted = {};
			pkgSortOrder
				.concat( Object.keys( pkg ).filter( field => !~pkgSortOrder.indexOf( field ) ) )
				.forEach( field => {
					if ( pkg[ field ] ) sorted[ field ] = pkg[ field ];
				});

			return sander.writeFile( dir, 'package.json', JSON.stringify( sorted, null, '  ' ) );
		});
};
