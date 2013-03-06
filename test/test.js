var Pheasant = require( __dirname + '/../src/pheasant' ).Pheasant,
    chai     = require( 'chai' ),
    
    expect   = chai.expect,
    assert   = chai.assert;

describe( 'Settings', function() {

    it( 'should change the default formatting after a call to .setDefaultStringFormat', function() {

        expect( Pheasant.parse( '#000' ).toString( 'hex3' ) ).to.equal( '#000' );
        Pheasant.setDefaultStringFormat( 'hex6' );
        expect( Pheasant.parse( '#000' ).toString() ).to.equal( '#000000' );
        expect( Pheasant.parse( '#000' ).toString( 'hex3' ) ).to.equal( '#000' );

    });

});

describe( 'Colors parsing', function() {

    beforeEach(function() {

        Pheasant.setDefaultStringFormat( 'hex3' );

    });

    describe( 'CSS/SVG color names', function() {

        it( 'should normalize strings with spaces before', function() {

            expect( Pheasant.parse( '  black' ).toString() ).to.equal( '#000' );
            expect( Pheasant.parse( '   lime' ).toString() ).to.equal( '#0f0' );

        });

        it( 'should normalize strings with spaces after', function() {

            expect( Pheasant.parse( 'black   ' ).toString() ).to.equal( '#000' );
            expect( Pheasant.parse( 'lime    ' ).toString() ).to.equal( '#0f0' );

        });

        it( 'should normalize strings with spaces both before and after', function() {

            expect( Pheasant.parse( ' black   ' ).toString() ).to.equal( '#000' );
            expect( Pheasant.parse( '  lime   ' ).toString() ).to.equal( '#0f0' );

        });

        it( 'should normalize mixed-case strings', function() {

            expect( Pheasant.parse( 'bLaCk' ).toString() ).to.equal( '#000' );
            expect( Pheasant.parse( 'liME' ).toString() ).to.equal( '#0f0' );

        });

        it( 'should handle CSS color names', function() {

            expect( Pheasant.parse( 'black'   ).toString() ).to.equal( '#000' );
            expect( Pheasant.parse( 'lime'    ).toString() ).to.equal( '#0f0' );
            expect( Pheasant.parse( 'red'     ).toString() ).to.equal( '#f00' );
            expect( Pheasant.parse( 'blue'    ).toString() ).to.equal( '#00f' );
            expect( Pheasant.parse( 'white'   ).toString() ).to.equal( '#fff' );
            expect( Pheasant.parse( 'fuchsia' ).toString() ).to.equal( '#f0f' );

        });

    });

});
