const DEFAULTS = {
	duration: 250,
	easing: 'ease-out',
	fade: true,
	from: 0.3,
	to: 1
};

export default function scale ( t, params ) {
	params = t.processParams( params, DEFAULTS );

	const from = `scale(${params.from})`;
	const to = `scale(${params.to})`;

	let targetOpacity, anim = {};

	if ( t.isIntro ) {
		t.setStyle( 'transform', scaleFrom );

		if ( t.fade !== false ) {
			targetOpacity = t.getStyle( 'opacity' );
			t.setStyle( 'opacity', 0 );
		}
	}

	// set defaults
	anim.opacity = t.isIntro ? targetOpacity : 0;

	if ( t.fade !== false ) anim.transform = t.isIntro ? scaleTo : scaleFrom;
	t.animateStyle( anim, params, t.complete );
}
