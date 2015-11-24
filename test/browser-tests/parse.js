import { test } from 'qunit';
import tests from 'samples/parse';

const fnPattern = /(?:^function\s?\(.*\))(\s+){/;

test( 'Mismatched template version causes error', function ( t ) {
	t.throws( function () {
		new Ractive({
			template: {v:'nope',t:[]}
		});
	});
});

tests.forEach( theTest => {
	test( theTest.name, function ( t ) {
		// disable for tests unless explicitly specified
		// we can just test the signatures, so set false
		theTest.options = theTest.options || { csp: false };
		if ( !theTest.options.hasOwnProperty( 'csp' ) ) {
			theTest.options.csp = false;
		}
		if ( theTest.error ) {
			t.throws( () => {
				Ractive.parse( theTest.template, theTest.options );
			}, error => {
				if ( error.name !== 'ParseError' ) {
					throw error;
				}
				t.equal( error.message, theTest.error );
				return true;
			}, 'Expected ParseError' );
		} else {
			const parsed = Ractive.parse( theTest.template, theTest.options );

			if ( parsed.e ) {
				const expectedKeys = Object.keys( theTest.parsed.e );
				t.deepEqual( Object.keys( parsed.e ),  expectedKeys );
				expectedKeys.forEach( key => {
					// this is regex voodoo to normalize function compare in phantomjs
					let actual = parsed.e[ key ].toString().replace( ') \{', ')\{');
					t.equal( actual, theTest.parsed.e[ key ] );
				});

				delete parsed.e;
				delete theTest.parsed.e;
			}

			t.deepEqual( parsed, theTest.parsed );
		}
	});
});
