/*global require, process, __dirname */
var path = require( 'path' );
var sander = require( 'sander' );
var buildPlugin = require( './build-plugin' );

process.chdir( path.join( __dirname, '..' ) );

var plugins = process.argv.slice( 2 )
	.filter( name => name !== '--' );

if ( !plugins.length ) {
	plugins = sander.readdirSync( 'plugins' ).map( name => path.join( 'plugins', name ) );
}

plugins.reduce( ( promise, dir ) => {
	return promise.then( () => buildPlugin( dir ) );
}, Promise.resolve() )

.catch( err => {
	console.error( err.message );
	console.error( err.stack );
});
