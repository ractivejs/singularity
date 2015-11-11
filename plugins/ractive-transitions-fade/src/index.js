const DEFAULTS = {
	delay: 0,
	duration: 300,
	easing: 'linear'
};

export default function fade ( t, params ) {
	params = t.processParams( params, DEFAULTS );

	let targetOpacity;

	if ( t.isIntro ) {
		targetOpacity = t.getStyle( 'opacity' );
		t.setStyle( 'opacity', 0 );
	} else {
		targetOpacity = 0;
	}

	t.animateStyle( 'opacity', targetOpacity, params ).then( t.complete );
}
