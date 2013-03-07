var Pheasant = require( __dirname + '/../src/pheasant' ).Pheasant,
    chai     = require( 'chai' ),
    
    expect   = chai.expect,
    assert   = chai.assert;

describe( 'Settings', function() {

    describe( 'Pheasant.setDefaultStringFormat', function() {

        it( 'should change the default formatting', function() {

            expect( Pheasant.parse( '#000' ).toString( 'hex3' ) ).to.equal( '#000' );
            Pheasant.setDefaultStringFormat( 'hex6' );
            expect( Pheasant.parse( '#000' ).toString() ).to.equal( '#000000' );
            expect( Pheasant.parse( '#000' ).toString( 'hex3' ) ).to.equal( '#000' );

        });

    });

});

describe( 'Parsing', function() {

    beforeEach(function() {

        Pheasant.setDefaultStringFormat( 'hex3' );

    });

    describe( 'of CSS/SVG color names', function() {

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

    describe( 'of hexadecimal strings of length 3', function() {

        it( 'should normalize strings with spaces before', function() {

            expect( Pheasant.parse( '  #abc' ).toString() ).to.equal( '#abc' );

        });

        it( 'should normalize strings with spaces after', function() {

            expect( Pheasant.parse( '#acc   ' ).toString() ).to.equal( '#acc' );

        });

        it( 'should normalize strings with spaces both before and after', function() {

            expect( Pheasant.parse( '  #0ce   ' ).toString() ).to.equal( '#0ce' );
            expect( Pheasant.parse( ' #110    ' ).toString() ).to.equal( '#110' );

        });

        it( 'should normalize mixed-case strings', function() {

            expect( Pheasant.parse( '#AAA' ).toString() ).to.equal( '#aaa' );
            expect( Pheasant.parse( '#0Ed' ).toString() ).to.equal( '#0ed' );

        });


        it( 'should handle hex3 values', function() {

            expect( Pheasant.parse( '#aaa' ).toString() ).to.equal( '#aaa' );
            expect( Pheasant.parse( '#fff' ).toString() ).to.equal( '#fff' );
            expect( Pheasant.parse( '#012' ).toString() ).to.equal( '#012' );

        });

    });

    describe( 'of hexadecimal strings of length 6', function() {

        it( 'should normalize strings with spaces before', function() {

            expect( Pheasant.parse( '  #abcdef' ).toString() ).to.equal( '#ace' );

        });

        it( 'should normalize strings with spaces after', function() {

            expect( Pheasant.parse( '#ab0def   ' ).toString() ).to.equal( '#a0e' );

        });

        it( 'should normalize strings with spaces both before and after', function() {

            expect( Pheasant.parse( '  #a0a0fe   ' ).toString() ).to.equal( '#aaf' );
            expect( Pheasant.parse( ' #110ccc    ' ).toString() ).to.equal( '#10c' );

        });

        it( 'should normalize mixed-case strings', function() {

            expect( Pheasant.parse( '#BAAb23' ).toString() ).to.equal( '#ba2' );
            expect( Pheasant.parse( '#0EdCdD' ).toString() ).to.equal( '#0dd' );

        });


        it( 'should handle hex6 values', function() {

            expect( Pheasant.parse( '#abcdef' ).toString() ).to.equal( '#ace' );
            expect( Pheasant.parse( '#123456' ).toString() ).to.equal( '#135' );
            expect( Pheasant.parse( '#424242' ).toString() ).to.equal( '#444' );

        });

    });

});

describe( 'Stringifying', function() {

    describe( 'to Hex3 format (#xyz)', function() {

        beforeEach(function() {

            Pheasant.setDefaultStringFormat( 'hex3' );

        });

        it( 'should normalize colors with values higher than 255', function() {

            expect( new Pheasant.Color( 256, 2, 1 ).toString() ).to.equal( '#f00' );
            expect( new Pheasant.Color( Infinity, 2, 4242 ).toString() ).to.equal( '#f0f' );

        });

        it( 'should normalize colors with negative values', function() {

            expect( new Pheasant.Color( -1, 42, 1 ).toString() ).to.equal( '#020' );
            expect( new Pheasant.Color( -Infinity, 2, -4242 ).toString() ).to.equal( '#000' );

        });

        it( 'should normalize colors with float values', function() {

            expect( new Pheasant.Color( 0, 15.99, 1.42 ).toString() ).to.equal( '#010' );

        });

        it( 'should normalize colors with negative float values', function() {

            expect( new Pheasant.Color( 0, -15.99, -1.42 ).toString() ).to.equal( '#000' );

        });

        it( 'should not handle colors with NaN values', function() {

            expect( new Pheasant.Color( 0, NaN, 0 ).toString() ).to.be.null;

        });

    });

    describe( 'to Hex6 format (#abcdef)', function() {

        beforeEach(function() {

            Pheasant.setDefaultStringFormat( 'hex6' );

        });

        it( 'should normalize colors with values higher than 255', function() {

            expect( new Pheasant.Color( 256, 2, 1 ).toString() ).to.equal( '#ff0201' );
            expect( new Pheasant.Color( Infinity, 2, 4242 ).toString() ).to.equal( '#ff02ff' );

        });

        it( 'should normalize colors with negative values', function() {

            expect( new Pheasant.Color( -1, 42, 1 ).toString() ).to.equal( '#002a01' );
            expect( new Pheasant.Color( -Infinity, 2, -4242 ).toString() ).to.equal( '#000200' );

        });

        it( 'should normalize colors with float values', function() {

            expect( new Pheasant.Color( 0, 15.99, 1.42 ).toString() ).to.equal( '#001001' );

        });

        it( 'should normalize colors with negative float values', function() {

            expect( new Pheasant.Color( 0, -15.99, -1.42 ).toString() ).to.equal( '#000000' );

        });

        it( 'should not handle colors with NaN values', function() {

            expect( new Pheasant.Color( 0, NaN, 0 ).toString() ).to.be.null;

        });

    });

});
