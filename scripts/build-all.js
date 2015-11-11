/*global require, process, __dirname */
var path = require( 'path' );
var sander = require( 'sander' );
var rollup = require( 'rollup' );
var babel = require( 'rollup-plugin-babel' );

process.chdir( path.join( __dirname, '..' ) );

sander.readdirSync( 'plugins' ).reduce( ( promise, name ) => {
	var dir = path.resolve( 'plugins', name );
	var plugin = require( `${dir}/plugin.json` );

	console.log( 'dir', dir )

	return promise
		.then( () => sander.rimraf( dir, 'dist' ) )
		.then( () => {
			return rollup.rollup({
				entry: path.join( dir, 'src/index.js' ),
				plugins: [ babel() ]
			});
		})
		.then( bundle => {
			return Promise.all([
				// main
				bundle.write({
					dest: path.join( dir, `dist/${name}.umd.js` ),
					format: 'umd',
					moduleName: plugin.global
				}),

				// jsnext:main
				bundle.write({
					dest: path.join( dir, `dist/${name}.es6.js` ),
					format: 'es6'
				})
			]);
		});
}, Promise.resolve() )

.catch( err => {
	console.error( err.message );
	console.error( err.stack );
});
