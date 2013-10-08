// for tests on Node only
if ( typeof window === 'undefined' ) {

    var build    = process.env.PHEASANT_COV ? 'build-cov' : 'build',
        suffix   = process.env.PHEASANT_MIN ? '.min.js' : '',
        Pheasant = require( __dirname + '/../'
                                + build + '/pheasant' + suffix ),
        chai     = require( 'chai' );

}

var     expect   = chai.expect,
        noop     = function(){};

describe( 'Settings', function() {

    describe( 'Pheasant.setDefaultStringFormat', function() {

        it( 'should change the default formatting', function() {

            Pheasant.setDefaultStringFormat( 'hex3' );
            expect( Pheasant.parse( '#000' ).toString() ).to.equal( '#000' );
            Pheasant.setDefaultStringFormat( 'hex6' );
            expect(
                Pheasant.parse( '#000' ).toString() ).to.equal( '#000000' );
            
            expect(
                Pheasant.parse( '#000' ).toString( 'hex3' )
            ).to.equal( '#000' );

        });

        it( 'should normalize strings with spaces '
          + 'before and/or after', function() {

            Pheasant.setDefaultStringFormat( '  hex3' );
            expect( Pheasant.parse( '#000' ).toString() ).to.equal( '#000' );
            Pheasant.setDefaultStringFormat( ' hex6  ' );
            expect(
                Pheasant.parse( '#000' ).toString() ).to.equal( '#000000' );

        });

        it( 'should normalize mixed-case strings', function() {

            Pheasant.setDefaultStringFormat( 'hEx3' );
            expect( Pheasant.parse( '#000' ).toString() ).to.equal( '#000' );
            Pheasant.setDefaultStringFormat( 'HEX6' );
            expect(
                Pheasant.parse( '#000' ).toString() ).to.equal( '#000000' );

        });

    });

});

describe( 'Parsing', function() {

    beforeEach(function() {

        Pheasant.setDefaultStringFormat( 'hex3' );

    });

    describe( 'of unknown formats', function() {

        it( 'should return null', function() {

            expect( Pheasant.parse( '$&!@' ) ).to.be.null;

        });

    });

    describe( 'of CSS/SVG color names', function() {

        it( 'should normalize strings with spaces '
          + 'before and/or after', function() {

            expect(
                Pheasant.parse( '   lime' ).toString() ).to.equal( '#0f0' );
            expect(
                Pheasant.parse( 'black   ' ).toString() ).to.equal( '#000' );
            expect(
                Pheasant.parse( '  lime   ' ).toString() ).to.equal( '#0f0' );

        });

        it( 'should normalize mixed-case strings', function() {

            expect( Pheasant.parse( 'bLaCk' ).toString() ).to.equal( '#000' );
            expect( Pheasant.parse( 'liME' ).toString() ).to.equal( '#0f0' );

        });

        it( 'should handle CSS color names', function() {

            expect( Pheasant.parse( 'black'   ).toString() ).to.equal('#000');
            expect( Pheasant.parse( 'lime'    ).toString() ).to.equal('#0f0');
            expect( Pheasant.parse( 'red'     ).toString() ).to.equal('#f00');
            expect( Pheasant.parse( 'blue'    ).toString() ).to.equal('#00f');
            expect( Pheasant.parse( 'white'   ).toString() ).to.equal('#fff');
            expect( Pheasant.parse( 'fuchsia' ).toString() ).to.equal('#f0f');

            expect(
                Pheasant.parse( 'transparent' ).toString( 'rgba' )
            ).to.equal( 'rgba(0,0,0,0)' );

        });

    });

    describe( 'of hexadecimal strings of length 3', function() {

        it( 'should normalize strings with spaces '
          + 'before and/or after', function() {

            expect( Pheasant.parse( '  #abc' ).toString() ).to.equal( '#abc' );
            expect(
                Pheasant.parse( '#acc   ' ).toString() ).to.equal( '#acc' );
            expect(
                Pheasant.parse( ' #110    ' ).toString() ).to.equal( '#110' );

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

        it( 'should normalize strings with spaces '
          + 'before and/or after', function() {

            expect(
                Pheasant.parse( '  #abcdef' ).toString() ).to.equal( '#ace' );
            expect(
                Pheasant.parse( '#ab0def   ' ).toString() ).to.equal( '#a0e' );
            expect(
                Pheasant.parse( ' #110ccc  ' ).toString() ).to.equal( '#10c' );

        });

        it( 'should normalize mixed-case strings', function() {

            expect( Pheasant.parse( '#BAAb23' ).toString() ).to.equal('#ba2');
            expect( Pheasant.parse( '#0EdCdD' ).toString() ).to.equal('#0dd');

        });


        it( 'should handle hex6 values', function() {

            expect( Pheasant.parse( '#abcdef' ).toString() ).to.equal('#ace');
            expect( Pheasant.parse( '#123456' ).toString() ).to.equal('#135');
            expect( Pheasant.parse( '#424242' ).toString() ).to.equal('#444');

        });

    });

    describe( 'of RGB() strings', function() {

        it( 'should normalize strings with spaces '
          + 'before and/or after', function() {

            expect(
                Pheasant.parse( '  rgb(0,0,0)' ).toString()
            ).to.equal( '#000' );

            expect(
                Pheasant.parse( 'rgb(0,0,255) ' ).toString()
            ).to.equal( '#00f' );
            
            expect(
                Pheasant.parse( ' rgb(0,255,0)   ' ).toString()
            ).to.equal( '#0f0' );

        });

        it( 'should normalize strings with spaces in them', function() {

            expect(
                Pheasant.parse( 'rgb(0  ,255 , 0 )' ).toString()
            ).to.equal( '#0f0' );

        });

        it( 'should normalize mixed-case strings', function() {

            expect(
                Pheasant.parse( 'RgB(0,0,255)' ).toString()
            ).to.equal( '#00f' );
            
            expect(
                Pheasant.parse( 'RGB(0,0,255)' ).toString()
            ).to.equal( '#00f' );

        });

        it( 'should handle RGB() strings', function() {

            expect(
                Pheasant.parse( 'rgb(0,0,0)' ).toString() ).to.equal( '#000' );
            expect(
                Pheasant.parse( 'rgb(0,255,0)' ).toString()
            ).to.equal( '#0f0' );

        });

    });

    describe( 'of RGB() strings, with percentages', function() {

        it( 'should normalize strings with spaces '
          + 'before and/or after', function() {

            expect(
                Pheasant.parse( '  rgb(0%,0%,0%)' ).toString()
            ).to.equal( '#000' );
            
            expect(
                Pheasant.parse( 'rgb(100%,0%,0%)   ' ).toString()
            ).to.equal( '#f00' );
            
            expect(
                Pheasant.parse( ' rgb(0%,100%,0%)   ' ).toString()
            ).to.equal( '#0f0' );

        });

        it( 'should normalize strings with spaces in them', function() {

            expect(
                Pheasant.parse( 'rgb(0%  ,100% , 0% )' ).toString()
            ).to.equal( '#0f0' );

        });

        it( 'should normalize mixed-case strings', function() {

            expect(
                Pheasant.parse( 'RgB(0%,0%,100%)' ).toString()
            ).to.equal( '#00f' );
            
            expect(
                Pheasant.parse( 'RGB(0%,0%,100%)' ).toString()
            ).to.equal( '#00f' );

        });

        it( 'should handle RGB() strings with percentages', function() {

            expect(
                Pheasant.parse( 'rgb(0%,0%,0%)' ).toString()
            ).to.equal( '#000' );
            
            expect(
                Pheasant.parse( 'rgb(0%,100%,0%)' ).toString()
            ).to.equal( '#0f0' );

        });

    });

    describe( 'of RGBA() strings', function() {

        it( 'should normalize strings with spaces '
          + 'before and/or after', function() {

            expect(
                Pheasant.parse( '  rgba(0,255,0,1)' ).toString()
            ).to.equal( '#0f0' );
            
            expect(
                Pheasant.parse( 'rgba(255,0,0,1)   ' ).toString()
            ).to.equal( '#f00' );
            
            expect(
                Pheasant.parse( ' rgba(0,255,0,1)   ' ).toString()
            ).to.equal( '#0f0' );

        });

        it( 'should normalize strings with spaces in them', function() {

            expect(
                Pheasant.parse( 'rgba(0  ,255 , 0 ,1)' ).toString()
            ).to.equal( '#0f0' );

        });

        it( 'should normalize mixed-case strings', function() {

            expect(
                Pheasant.parse( 'rGbA(0,0,255,1)' ).toString()
            ).to.equal( '#00f' );
            
            expect(
                Pheasant.parse( 'RGBA(0,0,255,1)' ).toString()
            ).to.equal( '#00f' );

        });

        it( 'should parse alpha channels as floats', function() {

            expect(
                Pheasant.parse( 'rGbA(0,0,255,0.1)' ).toString()
            ).to.equal( '#00f' );
            
            expect(
                Pheasant.parse( 'RGBA(0,0,255,0.9)' ).toString()
            ).to.equal( '#00f' );
            
            expect(
                Pheasant.parse( 'RGBA(0,0,255,0.4)' ).alpha ).to.equal( 0.4 );

        });

        it( 'should handle rgba() strings', function() {

            expect(
                Pheasant.parse( 'rgba(0,0,0,1)' ).toString()
            ).to.equal( '#000' );
            
            expect(
                Pheasant.parse( 'rgba(0,255,0,1)' ).toString()
            ).to.equal( '#0f0' );

        });

    });

    describe( 'of RGBA() strings with percentages', function() {

        it( 'should normalize strings with spaces '
          + 'before and/or after', function() {

            expect(
                Pheasant.parse( '  rgba(0%,100%,0%,1)' ).toString()
            ).to.equal( '#0f0' );
            
            expect(
                Pheasant.parse( 'rgba(0%,0%,100%,0) ' ).toString()
            ).to.equal( '#00f' );
            
            expect(
                Pheasant.parse( ' rgba(0%,100%,0%,1)   ' ).toString()
            ).to.equal( '#0f0' );

        });

        it( 'should normalize strings with spaces in them', function() {

            expect(
                Pheasant.parse( 'rgba(0%  ,100% , 0% ,1)' ).toString()
            ).to.equal( '#0f0' );

        });

        it( 'should normalize mixed-case strings', function() {

            expect(
                Pheasant.parse( 'rGbA(0%,0%,100%,1)' ).toString()
            ).to.equal( '#00f' );
            
            expect(
                Pheasant.parse( 'RGBA(0%,0%,100%,1)' ).toString()
            ).to.equal( '#00f' );

        });

        it( 'should parse alpha channels as floats', function() {

            expect(
                Pheasant.parse( 'rGbA(0%,0%,100%,0.1)' ).toString()
            ).to.equal( '#00f' );
            
            expect(
                Pheasant.parse( 'RGBA(0%,0%,100%,0.9)' ).toString()
            ).to.equal( '#00f' );

        });

        it( 'should handle rgba() strings with percentages', function() {

            expect(
                Pheasant.parse( 'rgba(0%,0%,0%,1)' ).toString()
            ).to.equal( '#000' );
            
            expect(
                Pheasant.parse( 'rgba(0%,100%,0%,1)' ).toString()
            ).to.equal( '#0f0' );

        });

    });

    describe( 'of HSL() strings', function() {

        it( 'should normalize strings with spaces '
          + 'before and/or after', function() {

            expect(
                Pheasant.parse( '  hsl(0,100%,50%)' ).toString()
            ).to.equal( '#f00' );
            
            expect(
                Pheasant.parse( 'hsl(0,100%,50%) ' ).toString()
            ).to.equal( '#f00' );
            
            expect(
                Pheasant.parse( '  hsl(0,100%,50%) ' ).toString()
            ).to.equal( '#f00' );

        });

        it( 'should normalize strings with spaces in them', function() {

            expect(
                Pheasant.parse( 'hsl( 0 ,  100% , 50%  )' ).toString()
            ).to.equal( '#f00' );

        });

        it( 'should normalize mixed-case strings', function() {

            expect(
                Pheasant.parse( 'HSL(0,100%,50%)' ).toString()
            ).to.equal( '#f00' );

        });

        it( 'should handle hsl() strings', function() {

            Pheasant.setDefaultStringFormat( 'colorname' );

            expect(
                Pheasant.parse( 'hsl(0,100%,50%)'   ).toString()
            ).to.equal( 'red' );
            
            expect(
                Pheasant.parse( 'hsl(240,100%,50%)' ).toString()
            ).to.equal( 'blue' );
            
            expect(
                Pheasant.parse( 'hsl(360,100%,0%)' ).toString()
            ).to.equal( 'black' );
            
            expect(
                Pheasant.parse( 'hsl(120,100%,25%)' ).toString()
            ).to.equal( 'green' );

            expect(
                Pheasant.parse( 'hsl(120,100%,50%)' ).toString()
            ).to.equal( 'lime' );

        });

    });

    describe( 'of HSLa() strings', function() {

        it( 'should normalize strings with spaces '
          + 'before and/or after', function() {

            expect(
                Pheasant.parse( '  hsla(0,100%,50%,1)' ).toString()
            ).to.equal( '#f00' );
            
            expect(
                Pheasant.parse( 'hsla(0,100%,50%,1) ' ).toString()
            ).to.equal( '#f00' );
            
            expect(
                Pheasant.parse( '  hsla(0,100%,50%,1) ' ).toString()
            ).to.equal( '#f00' );

        });

        it( 'should normalize strings with spaces in them', function() {

            expect(
                Pheasant.parse( 'hsla( 0 ,  100% , 50% ,1 )' ).toString()
            ).to.equal( '#f00' );

        });

        it( 'should normalize mixed-case strings', function() {

            expect(
                Pheasant.parse( 'HSLA(0,100%,50%,1)' ).toString()
            ).to.equal( '#f00' );

        });

        it( 'should handle hsla() strings', function() {

            var hsla_red = 'hsla(0,100%,50%,1)',
                rgba_red = 'rgba(255,0,0,1)';

            Pheasant.setDefaultStringFormat( 'colorname' );

            expect( Pheasant.parse( hsla_red ).toString() ).to.equal( 'red' );
            
            expect(
                Pheasant.parse( 'hsla(240,100%,50%,1)' ).toString()
			).to.equal( 'blue' );

            expect(
                Pheasant.parse( 'hsla(360,100%,0%,1)' ).toString()
			).to.equal( 'black' );
            
            expect(
                Pheasant.parse( 'hsla(120,100%,25%,1)' ).toString()
			).to.equal( 'green' );
            
            expect(
                Pheasant.parse( 'hsla(120,100%,50%,1)' ).toString()
			).to.equal( 'lime' );

            expect(
                Pheasant.parse( hsla_red).toString( 'rgba' )
            ).to.equal( rgba_red );

        });

    });

    it( 'should return null if the argument is not a string '
      + 'nor a Pheasant.Color object', function() {

        expect( Pheasant.parse( undefined ) ).to.be.null;
        expect( Pheasant.parse( null ) ).to.be.null;
        expect( Pheasant.parse( 42 ) ).to.be.null;
        expect( Pheasant.parse( {} ) ).to.be.null;
        expect( Pheasant.parse( [] ) ).to.be.null;
        expect( Pheasant.parse( /foo/ ) ).to.be.null;

    });

    it( 'should return its argument '
      + 'if it\'s a Pheasant.Color object', function() {

        var c = new Pheasant.Color( 0, 1, 2, 3, 0.5 );

        expect( Pheasant.parse( c ) ).to.deep.equal( c );

    });

});

describe( 'Stringifying', function() {

    describe( 'to unknown formats', function () {

        it( 'should return null', function() {

            expect( new Pheasant.Color(0,0,0).toString( '&#!$' ) ).to.be.null;

        });

    });

    describe( 'to Hex3 format (#xyz)', function() {

        beforeEach(function() {

            Pheasant.setDefaultStringFormat( 'hex3' );

        });

        it( 'should normalize colors with values higher than 255', function() {

            expect(
                new Pheasant.Color( 256, 2, 1 ).toString()
            ).to.equal( '#f00' );
            
            expect(
                new Pheasant.Color( Infinity, 2, 4242 ).toString()
            ).to.equal( '#f0f' );

        });

        it( 'should normalize colors with negative values', function() {

            expect(
                new Pheasant.Color( -1, 42, 1 ).toString()
            ).to.equal( '#020' );
            
            expect(
                new Pheasant.Color( -Infinity, 2, -4242 ).toString()
            ).to.equal( '#000' );

        });

        it( 'should normalize colors with float values', function() {

            expect(
                new Pheasant.Color( 0, 15.99, 1.42 ).toString()
            ).to.equal( '#010' );

        });

        it( 'should normalize colors with negative float values', function() {

            expect(
                new Pheasant.Color( 0, -15.99, -1.42 ).toString()
            ).to.equal( '#000' );

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

            expect(
                new Pheasant.Color( 256, 2, 1 ).toString()
            ).to.equal( '#ff0201' );
            
            expect(
                new Pheasant.Color( Infinity, 2, 4242 ).toString()
            ).to.equal( '#ff02ff' );

        });

        it( 'should normalize colors with negative values', function() {

            expect(
                new Pheasant.Color( -1, 42, 1 ).toString()
            ).to.equal( '#002a01' );
            
            expect(
                new Pheasant.Color( -Infinity, 2, -4242 ).toString()
            ).to.equal( '#000200' );

        });

        it( 'should normalize colors with float values', function() {

            expect(
                new Pheasant.Color( 0, 15.99, 1.42 ).toString()
            ).to.equal( '#001001' );

        });

        it( 'should normalize colors with negative float values', function() {

            expect(
                new Pheasant.Color( 0, -15.99, -1.42 ).toString()
            ).to.equal( '#000000' );

        });

        it( 'should not handle colors with NaN values', function() {

            expect( new Pheasant.Color( 0, NaN, 0 ).toString() ).to.be.null;

        });

    });

    describe( 'to CSS/SVG color names', function() {

        beforeEach(function() {

            Pheasant.setDefaultStringFormat( 'colorname' );

        });

        it( 'should normalize colors with values higher than 255', function() {

            expect(
                new Pheasant.Color( 256, 0, 0 ).toString() ).to.equal( 'red' );
            
            expect(
                new Pheasant.Color( Infinity, 0, 4242 ).toString()
            ).to.equal( 'fuchsia' );

        });

        it( 'should normalize colors with negative values', function() {

            expect(
                new Pheasant.Color( -1, 0, 0 ).toString()
            ).to.equal( 'black' );
            
            expect(
                new Pheasant.Color( -Infinity, 128, -4242 ).toString()
            ).to.equal( 'green' );

        });

        it( 'should normalize colors with float values', function() {

            expect(
                new Pheasant.Color( 0, 127.7, 0 ).toString()
            ).to.equal( 'green' );

        });

        it( 'should normalize colors with negative float values', function() {

            expect(
                new Pheasant.Color( 0, -15.99, -1.42 ).toString()
            ).to.equal( 'black' );

        });

        it( 'should not handle colors with NaN values', function() {

            expect( new Pheasant.Color( 0, NaN, 0 ).toString() ).to.be.null;

        });

        it( 'should return null if there\'s no name '
          + 'for the current color', function() {

            expect( new Pheasant.Color( 1, 1, 1 ).toString() ).to.be.null;

        });

    });

    describe( 'to RGB() format', function() {

        beforeEach(function() {

            Pheasant.setDefaultStringFormat( 'rgb' );

        });

        it( 'should normalize colors with values higher than 255', function() {

            expect(
                new Pheasant.Color( 256, 0, 0 ).toString()
            ).to.equal( 'rgb(255,0,0)' );
            
            expect(
                new Pheasant.Color( Infinity, 0, 4242 ).toString()
            ).to.equal( 'rgb(255,0,255)' );

        });

        it( 'should normalize colors with negative values', function() {

            expect(
                new Pheasant.Color( -1, 0, 0 ).toString()
            ).to.equal( 'rgb(0,0,0)' );
            
            expect(
                new Pheasant.Color( -Infinity, 128, -4242 ).toString()
            ).to.equal( 'rgb(0,128,0)' );

        });

        it( 'should normalize colors with float values', function() {

            expect(
                new Pheasant.Color( 0, 127.7, 0 ).toString()
            ).to.equal( 'rgb(0,128,0)' );

        });

        it( 'should normalize colors with negative float values', function() {

            expect(
                new Pheasant.Color( 0, -15.99, -1.42 ).toString()
            ).to.equal( 'rgb(0,0,0)' );

        });

        it( 'should not handle colors with NaN values', function() {

            expect( new Pheasant.Color( 0, NaN, 0 ).toString() ).to.be.null;

        });

    });

    describe( 'to RGB() format with percentages', function() {

        beforeEach(function() {

            Pheasant.setDefaultStringFormat( 'rgb%' );

        });

        it( 'should normalize colors with values higher than 255', function() {

            expect(
                new Pheasant.Color( 256, 0, 0 ).toString()
            ).to.equal( 'rgb(100%,0%,0%)' );
            
            expect(
                new Pheasant.Color( Infinity, 0, 4242 ).toString()
            ).to.equal( 'rgb(100%,0%,100%)' );

        });

        it( 'should normalize colors with negative values', function() {

            expect(
                new Pheasant.Color( -1, 0, 0 ).toString()
            ).to.equal( 'rgb(0%,0%,0%)' );
            
            expect(
                new Pheasant.Color( -Infinity, 255, -4242 ).toString()
            ).to.equal( 'rgb(0%,100%,0%)' );

        });

        it( 'should normalize colors with float values', function() {

            expect(
                new Pheasant.Color( 0, 255.7, 0 ).toString()
            ).to.equal( 'rgb(0%,100%,0%)' );

        });

        it( 'should normalize colors with negative float values', function() {

            expect(
                new Pheasant.Color( 0, -15.99, -1.42 ).toString()
            ).to.equal( 'rgb(0%,0%,0%)' );

        });

        it( 'should not handle colors with NaN values', function() {

            expect( new Pheasant.Color( 0, NaN, 0 ).toString() ).to.be.null;

        });

    });

    describe( 'to RGBA() format', function() {

        beforeEach(function() {

            Pheasant.setDefaultStringFormat( 'rgba' );

        });

        it( 'should normalize colors with values higher than 255', function() {

            expect(
                new Pheasant.Color( 256, 0, 0, 1 ).toString()
            ).to.equal( 'rgba(255,0,0,1)' );
            
            expect(
                new Pheasant.Color( Infinity, 0, 4242, 0 ).toString()
            ).to.equal( 'rgba(255,0,255,0)' );

        });

        it( 'should normalize colors with negative values', function() {

            expect(
                new Pheasant.Color( -1, 0, 0, 0 ).toString()
            ).to.equal( 'rgba(0,0,0,0)' );
            
            expect(
                new Pheasant.Color( -Infinity, 255, -4242, 1 ).toString()
            ).to.equal( 'rgba(0,255,0,1)' );

        });

        it( 'should normalize colors with float values', function() {

            expect(
                new Pheasant.Color( 0, 255.7, 0, 0 ).toString()
            ).to.equal( 'rgba(0,255,0,0)' );

        });

        it( 'should normalize colors with negative float values', function() {

            expect(
                new Pheasant.Color( 0, -15.99, -1.42, 1 ).toString()
            ).to.equal( 'rgba(0,0,0,1)' );

        });

        it( 'should normalize alpha channels higher than 1', function() {

            expect(
                new Pheasant.Color( 0, 0, 0, 42 ).toString()
            ).to.equal( 'rgba(0,0,0,1)' );
            
            expect(
                new Pheasant.Color( 0, 0, 0, 1.2 ).toString()
            ).to.equal( 'rgba(0,0,0,1)' );

        });

        it( 'should normalize negative alpha channels', function() {

            expect(
                new Pheasant.Color( 0, 42, 0, -42 ).toString()
            ).to.equal( 'rgba(0,42,0,0)' );
            
            expect(
                new Pheasant.Color( 0, 0, 0, -1.2 ).toString()
            ).to.equal( 'rgba(0,0,0,0)' );

        });

        it( 'should keep alpha channels '
          + 'between 0 and 1 (non inclusive)', function() {

            expect(
                new Pheasant.Color( 0, 0, 0, 0.1 ).toString()
            ).to.equal( 'rgba(0,0,0,0.1)' );
            
            expect(
                new Pheasant.Color( 0, 0, 255, 0.6 ).toString()
            ).to.equal( 'rgba(0,0,255,0.6)' );

        });

        it( 'should not handle colors with NaN values', function() {

            expect( new Pheasant.Color( 0, NaN, 0, 0 ).toString() ).to.be.null;
            expect( new Pheasant.Color( 0, 0, 0, NaN ).toString() ).to.be.null;

        });

    });

    describe( 'to RGBA() format with percentages', function() {

        beforeEach(function() {

            Pheasant.setDefaultStringFormat( 'rgba%' );

        });

        it( 'should normalize colors with values higher than 255', function() {

            expect(
                new Pheasant.Color( 256, 0, 0, 1 ).toString()
            ).to.equal( 'rgba(100%,0%,0%,1)' );
            
            expect(
                new Pheasant.Color( Infinity, 0, 4242, 0 ).toString()
            ).to.equal( 'rgba(100%,0%,100%,0)' );

        });

        it( 'should normalize colors with negative values', function() {

            expect(
                new Pheasant.Color( -1, 0, 0, 0 ).toString()
            ).to.equal( 'rgba(0%,0%,0%,0)' );
            
            expect(
                new Pheasant.Color( -Infinity, 255, -4242, 1 ).toString()
            ).to.equal( 'rgba(0%,100%,0%,1)' );

        });

        it( 'should normalize colors with float values', function() {

            expect(
                new Pheasant.Color( 0, 255.7, 0, 0 ).toString()
            ).to.equal( 'rgba(0%,100%,0%,0)' );

        });

        it( 'should normalize colors with negative float values', function() {

            expect(
                new Pheasant.Color( 0, -15.99, -1.42, 1 ).toString()
            ).to.equal( 'rgba(0%,0%,0%,1)' );

        });

        it( 'should normalize alpha channels higher than 1', function() {

            expect(
                new Pheasant.Color( 0, 0, 0, 42 ).toString()
            ).to.equal( 'rgba(0%,0%,0%,1)' );
            
            expect(
                new Pheasant.Color( 0, 0, 0, 1.2 ).toString()
            ).to.equal( 'rgba(0%,0%,0%,1)' );

        });

        it( 'should normalize negative alpha channels', function() {

            expect(
                new Pheasant.Color( 0, 255, 0, -42 ).toString()
            ).to.equal( 'rgba(0%,100%,0%,0)' );
            
            expect(
                new Pheasant.Color( 0, 0, 0, -1.2 ).toString()
            ).to.equal( 'rgba(0%,0%,0%,0)' );

        });

        it( 'should keep alpha channels '
          + 'between 0 and 1 (non inclusive)', function() {

            expect(
                new Pheasant.Color( 0, 0, 0, 0.1 ).toString()
            ).to.equal( 'rgba(0%,0%,0%,0.1)' );
            
            expect(
                new Pheasant.Color( 0, 0, 255, 0.6 ).toString()
            ).to.equal( 'rgba(0%,0%,100%,0.6)' );

        });

        it( 'should not handle colors with NaN values', function() {

            expect( new Pheasant.Color( 0, NaN, 0, 0 ).toString() ).to.be.null;
            expect( new Pheasant.Color( 0, 0, 0, NaN ).toString() ).to.be.null;

        });

    });

    describe( 'to HSL() format', function() {

        beforeEach(function() {

            Pheasant.setDefaultStringFormat( 'hsl' );

        });

        it( 'should normalize colors with values higher than 255', function() {

            expect(
                new Pheasant.Color( 256, 0, 0 ).toString()
            ).to.equal( 'hsl(0,100%,50%)' );

        });

        it( 'should normalize colors with negative values', function() {

            expect(
                new Pheasant.Color( 255, -6, 0 ).toString()
            ).to.equal( 'hsl(0,100%,50%)' );

        });

        it( 'should normalize colors with float values', function() {

            expect(
                new Pheasant.Color( 255.2, 0.4, 0 ).toString()
            ).to.equal( 'hsl(0,100%,50%)' );

        });

        it( 'should normalize colors with negative float values', function() {

        expect( Pheasant.parse( [] ) ).to.be.null;
            expect(
                new Pheasant.Color( 255, -42.5, -7 ).toString()
            ).to.equal( 'hsl(0,100%,50%)' );

        });

        it( 'should not handle colors with NaN values', function() {

            expect( new Pheasant.Color( 0, NaN, 0 ).toString() ).to.be.null;

        });

        expect(
            Pheasant.parse( 'hsl(120,100%,50%)' ).toString( 'hsl' )
        ).to.equal( 'hsl(120,100%,50%)' );
        
        expect(
            Pheasant.parse( 'hsl(240,100%,50%)' ).toString( 'hsl' )
        ).to.equal( 'hsl(240,100%,50%)' );

    });

    describe( 'to HSLa() format', function() {

        beforeEach(function() {

            Pheasant.setDefaultStringFormat( 'hsla' );

        });

        it( 'should normalize colors with values higher than 255', function() {

            expect(
                new Pheasant.Color( 256, 0, 0 ).toString()
            ).to.equal( 'hsla(0,100%,50%,1)' );

        });

        it( 'should normalize colors with negative values', function() {

            expect(
                new Pheasant.Color( 255, -6, 0, 0.2 ).toString()
            ).to.equal( 'hsla(0,100%,50%,0.2)' );

        });

        it( 'should normalize colors with float values', function() {

            expect(
                new Pheasant.Color( 255.2, 0.4, 0, 1 ).toString()
            ).to.equal( 'hsla(0,100%,50%,1)' );

        });

        it( 'should normalize colors with negative float values', function() {

            expect(
                new Pheasant.Color( 255, -42.5, -7, 1 ).toString()
            ).to.equal( 'hsla(0,100%,50%,1)' );

        });

        it( 'should not handle colors with NaN values', function() {

            expect(
                new Pheasant.Color( 0, NaN, 0 ).toString()
            ).to.be.null;

        });

        expect(
            Pheasant.parse( 'hsl(120,100%,50%)' ).toString( 'hsla' )
        ).to.equal( 'hsla(120,100%,50%,1)' );
        
        expect(
            Pheasant.parse( 'hsl(240,100%,50%)' ).toString( 'hsla' )
        ).to.equal( 'hsla(240,100%,50%,1)' );

    });

});

describe( '.addFormat', function() {

    var _formats = Pheasant.formats;

    beforeEach(function() {

        Pheasant.formats = [];

    });

    afterEach(function() {

        Pheasant.formats = _formats;

    });

    it( 'should return null if the format is not valid', function() {

        expect( Pheasant.addFormat( 42 ) ).to.be.null;
        expect( Pheasant.addFormat( [] ) ).to.be.null;
        expect( Pheasant.addFormat( 'foo' ) ).to.be.null;
        expect( Pheasant.addFormat( null ) ).to.be.null;
        expect( Pheasant.addFormat( undefined ) ).to.be.null;

    });

    it( 'should return null if the format has no name', function() {

        expect( Pheasant.addFormat({ parse: function(){} }) ).to.be.null;
        expect( Pheasant.addFormat({ stringify: function(){} }) ).to.be.null;

    });

    it( 'should return null '
      + 'if the format has no .parse nor .stringify property', function() {

        expect( Pheasant.addFormat({ name: 'foo' }) ).to.be.null;

    });

    it( 'should return the name(s) of the new format', function() {

        expect(
            Pheasant.addFormat({ name: 'foo', parse: noop })
        ).to.equal( 'foo' );
        
        expect(
            Pheasant.addFormat({ name: [ 'a', 'b' ], parse: noop })
        ).to.deep.equal([ 'a', 'b' ]);

    });

    it( 'should wrap the returned value of .parse '
      + 'in a Color object', function() {
    
        var f1 = { name: 'f1',
                   parse: function(s) { if (s=='1') return { red:1 }; } },
            f2 = { name: 'f2',
                   parse: function(s) { if (s=='2') return { red:1, green:2,
                                                             blue:3 }; } },
            f3 = { name: 'f3',
                   parse: function(s) { if (s=='3') return { red:1, green:2,
                                                     blue:3, alpha: 0.2 }; } },

            f4 = { name: 'f4',
                   parse: function(s) { if (s=='4') return [ 42 ]; } },
            f5 = { name: 'f5',
                   parse: function(s) { if (s=='5')
                                                return [ 42, 2, 3, 0.7 ]; } };


        expect( Pheasant.addFormat(f1) ).to.equal( 'f1' );
        expect( Pheasant.addFormat(f2) ).to.equal( 'f2' );
        expect( Pheasant.addFormat(f3) ).to.equal( 'f3' );
        expect( Pheasant.addFormat(f4) ).to.equal( 'f4' );
        expect( Pheasant.addFormat(f5) ).to.equal( 'f5' );

        expect(Pheasant.parse( '1' ).getRGBA()).to.deep.equal([1, 0, 0, 1]);
        expect(Pheasant.parse( '2' ).getRGBA()).to.deep.equal([1, 2, 3, 1]);
        expect(Pheasant.parse( '3' ).getRGBA()).to.deep.equal([1, 2, 3, 0.2]);
        expect(Pheasant.parse( '4' ).getRGBA()).to.deep.equal([42, 0, 0, 1]);
        expect(Pheasant.parse( '5' ).getRGBA()).to.deep.equal([42, 2, 3, 0.7]);
    
    });

    it( 'should return null '
      + 'if the format\'s name is already taken', function() {

        var f1 = { name: 'f1', parse: function(){} },
            f2 = { name: 'f1', parse: function(){} };

        expect( Pheasant.addFormat( f1 ) ).to.equal( 'f1' );
        expect( Pheasant.addFormat( f2 ) ).to.be.null;

    });

    it( 'should return an array of the format\' names '
      + 'if they\'re all available', function() {

        var names = [ 'a', 'b', 'c' ];

        expect(
            Pheasant.addFormat({ name: names, parse: noop })
        ).to.deep.equal( names );

    });

    it( 'should return an array of the available format\' names '
      + 'if they\'re not all available', function() {

        expect(
            Pheasant.addFormat({ name: 'a', parse: noop }) ).to.equal( 'a' );
        
        expect(
            Pheasant.addFormat({ name: [ 'a', 'b' ], parse: noop })
        ).to.deep.equal([ 'b' ]);

    });

    it( 'should return an empty array '
      + 'if no format\' names is available', function() {

        expect(
            Pheasant.addFormat({ name: [ 'a', 'b', 'c' ], parse: noop })
        ).to.deep.equal([ 'a', 'b', 'c' ]);
        
        expect(
            Pheasant.addFormat({ name: [ 'a', 'b' ], parse: noop })
        ).to.deep.equal( [] );

    });

    it( 'should not normalize the string to parse '
      + 'if .normalize is false', function() {
    
        var ref = '  fOObAR ',
            f   = {
            name: 'foo',
            parse: function( s ) { expect( s ).to.equal( ref ); return {}; },
            normalize: false
        };

        expect( Pheasant.addFormat( f ) ).to.equal( 'foo' );

        Pheasant.parse( ref );
    
    });

    it( 'should use the .test attribute '
      + 'if it\'s a function', function ( done ) {

        var ref = 's',
            f = {
            name: 'f',
            test: function( s ) { expect( s ).to.equal( ref );
                                  done(); },
            parse: noop
        };

        Pheasant.addFormat( f );
        Pheasant.parse( ref );

    });

    it( 'should use the .test attribute if it\'s a regex', function () {

        var ref = 's',
            re  = /foo/,
            f = {
            test: re,
            parse: noop
        };

        re.test = function( s ) { expect( s ).to.equal( ref ); return true; };

        Pheasant.parse( ref );

    });

    it( 'should not use the .parse function '
      + 'if .test is a function which return false', function() {

        var f = {
            name: 'f',
            test: function() { return false; },
            parse: function() { expect( true ).to.be.false; }
        };

        Pheasant.addFormat( f );
        Pheasant.parse( 's' );

    });

    it( 'should not use the .parse function '
      + 'if .test is a regex which don\'t match the given string', function() {

        var f = {
            name: 'f',
            test: /t/,
            parse: function() { expect( true ).to.be.false; }
        };

        Pheasant.addFormat( f );
        Pheasant.parse( 's' );

    });

});

describe( '.convert', function() {

    it( 'should return null '
      + 'if the string is not a supported color format', function() {

        expect( Pheasant.convert( '&$#*', 'hex3' ) ).to.be.null;

    });

    it( 'should return null if the format is not supported', function() {

        expect( Pheasant.convert( '&$#*', 'hex42' ) ).to.be.null;

    });

});

describe( '.range', function() {

    it( 'should return an empty array '
      + 'if the argument is not an object', function() {

        expect( Pheasant.range( 42 ) ).to.deep.equal( [] );
        expect( Pheasant.range( /foo/ ) ).to.deep.equal( [] );
        expect( Pheasant.range( null ) ).to.deep.equal( [] );
        expect( Pheasant.range( undefined ) ).to.deep.equal( [] );

    });
       
    it( 'should return an empty array '
      + 'if its object has no `from` and `to` attributes', function() {

        expect( Pheasant.range({ from: '#fff' }) ).to.deep.equal( [] );
        expect( Pheasant.range({ to: '#fff' }) ).to.deep.equal( [] );

    });
       
    it( 'should return an empty array '
      + 'if its object has a negative length', function() {

        expect(
            Pheasant.range({ from: '#fff', to: '#fff', length:-1 })
        ).to.deep.equal( [] );

    });
       
    it( 'should return an empty array '
      + 'if its object\'s length is zero', function() {

        expect(
            Pheasant.range({ from: '#fff', to: '#fff', length:0 })
        ).to.deep.equal( [] );

    });
       
    it( 'should return an empty array '
      + 'if `from` is not a string nor a Color object', function() {

        expect( Pheasant.range({ from: 42, to: '#fff' }) ).to.deep.equal( [] );
        expect( Pheasant.range({ from: {}, to: '#fff' }) ).to.deep.equal( [] );

    });
       
    it( 'should return an empty array '
      + 'if `to` is not a string nor a Color object', function() {

        expect( Pheasant.range({ from: '#fff', to: 42 }) ).to.deep.equal( [] );
        expect( Pheasant.range({ from: '#fff', to: {} }) ).to.deep.equal( [] );

    });

    it( 'should default the length to 100', function() {

        expect(
            Pheasant.range({ from: '#fff', to: '#000' }).length
        ).to.equal( 100 );

    });

    it( 'should use the `length` attribute '
      + 'for the size of the range', function() {

        expect(
            Pheasant.range({ from: '#fff', to: '#000', length: 5 }).length
        ).to.equal( 5 );
        
        expect(
            Pheasant.range({ from: '#fff', to: '#ffe', length: 7 }).length
        ).to.equal( 7 );
        
        expect(
            Pheasant.range({ from: '#fff', to: '#fff', length: 3 }).length
        ).to.equal( 3 );

    });

    it( 'should accept Pheasant.Color objects '
      + 'for from/to attributes', function() {

        var c1 = new Pheasant.Color( 42, 13, 243, 0.2 ),
            c2 = new Pheasant.Color( 65, 5, 231, 0.8 );

        expect( Pheasant.range({
            from: c1, to: '#000', length: 5 }) ).not.to.be.null;
        
        expect( Pheasant.range({
            from: '#000', to: c2, length: 5 }) ).not.to.be.null;
        
        expect( Pheasant.range({
            from: c1, to: c2, length: 5 }) ).not.to.be.null;

    });

    it( 'should use the default format '
      + 'if the format is unspecified', function() {

        var r;

        Pheasant.setDefaultStringFormat( 'hex3' );

        r = Pheasant.range({ from: '#fff', to: 'rgb(12,12,12)', length: 5 });

        expect( Pheasant.guessFormat( r[ 0 ] ) ).to.equal( 'hex3' );

    });

    it( 'should use the format of both from/to strings '
      + 'if they are the same', function() {

        var r;

        r = Pheasant.range({ from: '#fff', to: '#eee', length: 5 });
        expect( Pheasant.guessFormat( r[ 0 ] ) ).to.equal( 'hex3' );

        r = Pheasant.range({ from: '#abcdef', to: '#fbacbb', length: 5 });
        expect( Pheasant.guessFormat( r[ 0 ] ) ).to.equal( 'hex6' );

        r = Pheasant.range({
            from: 'rgb(42,42,1)', to: 'rgb(42,42,2)', length: 5
        });
        expect( Pheasant.guessFormat( r[ 0 ] ) ).to.equal( 'rgb' );

    });

    it( 'should return an empty array '
      + 'if the given format is unsupported', function() {

        expect( Pheasant.range({
            from: '#fff', to: '#fff', format: '&@$#' }) ).to.deep.equal( [] );

    });

    it( 'should return an empty array '
      + 'if the given type is not valid', function() {

        expect( Pheasant.range({
            from: '#fff', to: '#fff', type: '&@$#'
        }) ).to.deep.equal( [] );

    });

    it( 'should return an array of Pheasant.Color object '
      + 'if the type is \'object\'', function() {

        expect( Pheasant.range({
            from: '#fff', to: '#fff', type: 'object', length: 2
        })[0] ).to.respondTo( 'getRGB' );

    });

    it( 'should return an array of RGB arrays '
      + 'if the type is \'rgb\'', function() {

        expect( Pheasant.range({
            from: '#fff', to: '#fff', type: 'rgb', length: 2
        })[0] ).to.deep.equal([ 255, 255, 255 ]);

    });

    it( 'should return an array of RGBA arrays '
      + 'if the type is \'rgba\'', function() {

        expect( Pheasant.range({
            from: '#fff', to: '#fff', type: 'rgba', length: 2
        })[0] ).to.deep.equal([ 255, 255, 255, 1 ]);

    });

    expect( Pheasant.range({
        from: '#000',
        to: '#000',
        type: 'rgb',
        length: 3
    }) ).to.deep.equal([ [ 0, 0, 0 ], [ 0, 0, 0 ], [ 0, 0, 0 ] ]);

    expect( Pheasant.range({
        from: '#010101',
        to: '#000',
        type: 'rgb',
        length: 3
    })[2] ).to.deep.equal([ 0, 0, 0 ]);

    expect( Pheasant.range({
        from: '#abc',
        to: '#123',
        length: 3
    })[2] ).to.equal( '#123' );

});

describe( '.guessFormat', function() {

    it( 'should return `null` if its argument is not a string', function() {

        expect( Pheasant.guessFormat( 42 ) ).to.be.null;
        expect( Pheasant.guessFormat( {} ) ).to.be.null;
        expect( Pheasant.guessFormat( [] ) ).to.be.null;
        expect( Pheasant.guessFormat( /foo/ ) ).to.be.null;

    });

    it( 'should return `null` '
      + 'if the string is not in a valid format', function() {

        expect( Pheasant.guessFormat( '&$@' ) ).to.be.null;

    });

    expect( Pheasant.guessFormat( '#333' ) ).to.equal( 'hex3' );
    expect( Pheasant.guessFormat( '#ABCDEF' ) ).to.equal( 'hex6' );
    expect( Pheasant.guessFormat( 'rgb(0,0,0)' ) ).to.equal( 'rgb' );
    expect( Pheasant.guessFormat( 'rgba(0,0,0,0)' ) ).to.equal( 'rgba' );
    expect( Pheasant.guessFormat( 'rgb(0%,0%,0%)' ) ).to.equal( 'rgb%' );
    expect( Pheasant.guessFormat( 'rgba(0%,0%,0%,1)' ) ).to.equal( 'rgba%' );
    expect( Pheasant.guessFormat( 'hsl(0,0%,0%)' ) ).to.equal( 'hsl' );
    expect( Pheasant.guessFormat( 'hsla(0,0%,0%,1)' ) ).to.equal( 'hsla' );
    expect( Pheasant.guessFormat( 'red' ) ).to.equal( 'colorname' );

});

describe( 'Color objects', function() {

    it( 'can be created with an array', function() {
        var c1 = new Pheasant.Color([42, 210, 0]),
            c2 = new Pheasant.Color( 42, 210, 0 );
        expect( c1 ).to.deep.equal( c2 );
    });

    it( 'can be created without the `new` keyword', function() {

        var c1 = new Pheasant.Color( 1, 2, 3, 0.4 ),
            c2 =     Pheasant.Color( 1, 2, 3, 0.4 );

        expect( c2 ).to.deep.equal( c1 );

    });

    it( 'should have a .getRGB() method', function() {
        expect(new Pheasant.Color().getRGB).to.be.a('function');
    });

    it( 'should have a .getRGBA() method', function() {
        expect(new Pheasant.Color().getRGBA).to.be.a('function');
    });

    it( 'should have a .getHSL() method', function() {
        expect(new Pheasant.Color().getHSL).to.be.a('function');
    });

    it( 'should have a .getHSV() method', function() {
        expect(new Pheasant.Color().getHSV).to.be.a('function');
    });

    it( 'should have a .getHSB() method', function() {
        expect(new Pheasant.Color().getHSV).to.be.a('function');
    });

    it( 'should default red/green/blue values to 0', function() {

        var c = new Pheasant.Color();

        expect( c.getRGB() ).to.deep.equal([ 0, 0, 0 ]);

    });

    it( 'should default alpha values to 1', function() {

        var c = new Pheasant.Color();

        expect( c.getRGBA() ).to.deep.equal([ 0, 0, 0, 1 ]);

    });

    describe( '.getRGB', function() {
        it( 'should return the values given to the constructor', function() {
            var r = 1, g = 2, b = 3;
            expect(new Pheasant.Color(r, g, b).getRGB()).to.deep.equal([ r, g, b ]);
        })
    });

    describe( '.getRGBA', function() {
        it( 'should return the values given to the constructor', function() {
            var r = 1, g = 2, b = 3, o = 0.6;
            expect(new Pheasant.Color(r, g, b, o).getRGBA()).to.deep.equal([ r, g, b, o ]);
        })
    });

    describe( '.getHSL', function() {
        it( 'should be preserved by the parsing', function() {
            expect( Pheasant.parse( 'hsl(0,100%,50%)' ).getHSL() ).to.deep.equal([ 0, 100, 50 ]);
            expect( Pheasant.parse( 'hsl(120,25%,20%)' ).getHSL() ).to.deep.equal([ 120, 25, 20 ]);
            expect( Pheasant.parse( 'hsl(0,0%,0%)' ).getHSL() ).to.deep.equal([ 0, 0, 0 ]);
            expect( Pheasant.parse( 'hsl(42,42%,42%)' ).getHSL() ).to.deep.equal([ 42, 42, 42 ]);
        });
    });

    describe( '.getHSV', function() {
        it( 'should return HSV values as integers', function() {
            expect( Pheasant.parse( 'hsl(0,100%,50%)' ).getHSV() ).to.deep.equal([ 0, 100, 100 ]);
            expect( Pheasant.parse( 'hsl(120,25%,20%)' ).getHSV() ).to.deep.equal([ 120, 40, 25 ]);
            expect( Pheasant.parse( 'hsl(40,50%,60%)' ).getHSV() ).to.deep.equal([ 40, 50, 80 ]);
        });
    });

    describe( '.getHSB', function() {
        it( 'should do the same as .getHSV', function() {
            var c1 = new Pheasant.Color(42, 7, 245, 0.7),
                c2 = new Pheasant.Color(255, 0, 0);
            expect( c1.getHSB() ).to.deep.equal( c1.getHSV() );
            expect( c2.getHSB() ).to.deep.equal( c2.getHSV() );
        });
    });

    describe( '.negative', function() {

        it( 'should be a function', function() {

            expect( new Pheasant.Color().negative ).to.be.a( 'function' );

        });

        it( 'should be return a new Color object', function() {

            var c1 = new Pheasant.Color( 0, 0, 0 ),
                c2 = c1.negative(),
                c3 = c2.negative();

            expect( c2 ).to.not.equal( c1 );
            expect( c3 ).to.not.equal( c1 );

        });

        it( 'should return the negative color of the current one', function() {

            var c1 = new Pheasant.Color( 55, 55, 55 ),
                c2 = c1.negative(),
                c3 = c2.negative();

            expect( c2.getRGB() ).to.deep.equal([ 200, 200, 200 ]);
            expect( c3 ).to.deep.equal( c1 );

        });

        it( 'should not change the alpha channel value', function() {

            var c1 = new Pheasant.Color( 42, 17, 25 ),
                c2 = c1.negative();

            expect( c2.alpha ).to.equal( c1.alpha );

        });

    });

    describe( '.brightness', function() {

        it( 'should return 0 if the color is black', function() {
            var black = new Pheasant.Color( 0, 0, 0 );
            expect(black.brightness()).to.equal( 0 );
        });

        it( 'should return 255 if the color is white', function() {
            var white = new Pheasant.Color( 255, 255, 255 );
            expect(white.brightness()).to.equal( 255 );
        });

        it( 'should return 38 if the color is dark brown', function() {
            var darkbrown = new Pheasant.Color( 60, 30, 20 );
            expect(darkbrown.brightness()).to.equal( 38 );
        });

        it( 'should return 200 if the color is light blue', function() {
            var lightblue = new Pheasant.Color( 180, 200, 255 );
            expect(lightblue.brightness()).to.equal( 200 );
        });

    });

    describe( '.isDarkerThan', function() {

        it( 'should return `false` '
          + 'if the other color is an invalid string', function() {

            var c1 = new Pheasant.Color( 255, 255, 255 );

            expect( c1.isDarkerThan( '&$*#' ) ).to.be.false;

        });

        it( 'should parse its argument if it\'s a string', function() {

            var c1 = new Pheasant.Color( 0, 0, 0 );

            expect( c1.isDarkerThan( '#fff' ) ).to.be.true;
            expect( c1.isDarkerThan( '#abcdef' ) ).to.be.true;
            expect( c1.isDarkerThan( 'rgba( 1, 1, 1, 1 )' ) ).to.be.true;
            expect( c1.isDarkerThan( 'rgb( 0, 0, 0 )' ) ).to.be.false;

        });

        it( 'should return `false` if its argument is not a string '
          + 'nor a Pheasant.Color object', function() {

            var c1 = new Pheasant.Color( 0, 0, 0 );

            expect( c1.isDarkerThan( null ) ).to.be.false;
            expect( c1.isDarkerThan( undefined ) ).to.be.false;
            expect( c1.isDarkerThan( 42 ) ).to.be.false;
            expect( c1.isDarkerThan( [] ) ).to.be.false;
            expect( c1.isDarkerThan( /foo/ ) ).to.be.false;

        });

        it( 'should return `false` '
          + 'if the other color has the same R/G/B values', function() {

            var c1 = new Pheasant.Color( 0, 0, 0 ),
                c2 = new Pheasant.Color( 0, 0, 0 );

            expect( c1.isDarkerThan( c2 ) ).to.be.false;

        });

        expect( Pheasant.parse( '#123' ).isDarkerThan( '#124' ) ).to.be.true;
        expect( Pheasant.parse( '#123' ).isDarkerThan( '#123' ) ).to.be.false;
        expect( Pheasant.parse( '#123' ).isDarkerThan( '#122' ) ).to.be.false;

    });

    describe( '.isLighterThan', function() {

        it( 'should return `false` '
          + 'if the other color is an invalid string', function() {

            var c1 = new Pheasant.Color( 255, 255, 255 );

            expect( c1.isLighterThan( '&$*#' ) ).to.be.false;

        });

        it( 'should parse its argument if it\'s a string', function() {

            var c1 = new Pheasant.Color( 255, 255, 255 );

            expect( c1.isLighterThan( '#fff' ) ).to.be.false;
            expect( c1.isLighterThan( '#abcdef' ) ).to.be.true;
            expect( c1.isLighterThan( 'rgba( 1, 1, 1, 1 )' ) ).to.be.true;
            expect( c1.isLighterThan( 'rgb( 0, 0, 0 )' ) ).to.be.true;

        });

        it( 'should return `false` if its argument is not a string '
          + 'nor a Pheasant.Color object', function() {

            var c1 = new Pheasant.Color( 0, 0, 0 );

            expect( c1.isLighterThan( null ) ).to.be.false;
            expect( c1.isLighterThan( undefined ) ).to.be.false;
            expect( c1.isLighterThan( 42 ) ).to.be.false;
            expect( c1.isLighterThan( [] ) ).to.be.false;
            expect( c1.isLighterThan( /foo/ ) ).to.be.false;

        });

        it( 'should return `false` '
          + 'if the other color has the same R/G/B values', function() {

            var c1 = new Pheasant.Color( 0, 0, 0 ),
                c2 = new Pheasant.Color( 0, 0, 0 );

            expect( c1.isLighterThan( c2 ) ).to.be.false;

        });

        expect( Pheasant.parse( '#123' ).isLighterThan( '#124' ) ).to.be.false;
        expect( Pheasant.parse( '#123' ).isLighterThan( '#123' ) ).to.be.false;
        expect( Pheasant.parse( '#123' ).isLighterThan( '#122' ) ).to.be.true;

    });

    describe( '.eq', function() {

        it( 'should return `false` '
          + 'if the other color is an invalid string', function() {

            var c1 = new Pheasant.Color( 255, 255, 255 );

            expect( c1.eq( '&$*#' ) ).to.be.false;

        });

        it( 'should parse its argument if it\'s a string', function() {

            var c1 = new Pheasant.Color( 0, 0, 0 );

            expect( c1.eq( '#000' ) ).to.be.true;
            expect( c1.eq( '#abcdef' ) ).to.be.false;
            expect( c1.eq( 'rgba( 1, 1, 1, 1 )' ) ).to.be.false;
            expect( c1.eq( 'rgb( 0, 0, 0 )' ) ).to.be.true;

        });

        it( 'should return `false` if its argument is not a string '
          + 'nor a Pheasant.Color object', function() {

            var c1 = new Pheasant.Color( 0, 0, 0 );

            expect( c1.eq( null ) ).to.be.false;
            expect( c1.eq( undefined ) ).to.be.false;
            expect( c1.eq( 42 ) ).to.be.false;
            expect( c1.eq( [] ) ).to.be.false;
            expect( c1.eq( /foo/ ) ).to.be.false;

        });

        it( 'should return `true` '
          + 'if the other color has the same R/G/B/a values', function() {

            var c1 = new Pheasant.Color( 42, 1, 0, 0.2 ),
                c2 = new Pheasant.Color( 42, 1, 0, 0.2 );

            expect( c1.eq( c2 ) ).to.be.true;

        });

        expect( Pheasant.parse( '#123' ).eq( '#124' ) ).to.be.false;
        expect( Pheasant.parse( '#123' ).eq( '#123' ) ).to.be.true;
        expect( Pheasant.parse( '#123' ).eq( '#122' ) ).to.be.false;

    });

    describe( '.brightnessContrast', function() {

        it( 'should return undefined if the given object is not a valid color', function() {
            var c = new Pheasant.Color( 25, 100, 123 );

            expect( c.brightnessContrast(null) ).to.be.undefined;
            expect( c.brightnessContrast('foobar') ).to.be.undefined;
            expect( c.brightnessContrast(function(){}) ).to.be.undefined;
        });

        it( 'should return 0 if the two colors are the same', function() {
            var c1 = new Pheasant.Color( 42, 35, 201 ),
                c2 = new Pheasant.Color( 42, 35, 201 );

            expect( c1.brightnessContrast( c2 ) ).to.be.equal( 0 );
        });

        it( 'should return 255 if the two colors are black & white', function() {
            var b = new Pheasant.Color(   0,   0,   0 ),
                w = new Pheasant.Color( 255, 255, 255 );

            expect( b.brightnessContrast( w ) ).to.be.equal( 255 );
            expect( w.brightnessContrast( b ) ).to.be.equal( 255 );
        });

        it( 'should accept colors as strings', function() {
            var darkbrown = new Pheasant.Color( 60, 30, 20 ),
                lightblue = new Pheasant.Color( 'lightblue' );

            expect( lightblue.brightnessContrast( darkbrown ) ).to.be.equal( 38 );
            expect( darkbrown.brightnessContrast( lightblue ) ).to.be.equal( 38 );
        });

        it( 'should not take care of the alpha channel value', function() {
            // Here, colors are 100% transparent, thus completely unreadable,
            // but the brightness difference doesn't take that into account (we
            // may change this in a future release.
            var green     = new Pheasant.Color( 100, 255, 100, 0 ),
                darkbrown = new Pheasant.Color(  60,  30,  20, 0 );

            expect( darkbrown.brightnessContrast( green ) ).to.be.equal( 153 );
            expect( green.brightnessContrast( darkbrown ) ).to.be.equal( 153 );
        });

    });

    describe( '.hueContrast', function() {

        it( 'should return undefined if the given object is not a valid color', function() {
            var c = new Pheasant.Color( 25, 100, 123 );

            expect( c.hueContrast(null) ).to.be.undefined;
            expect( c.hueContrast('foobar') ).to.be.undefined;
            expect( c.hueContrast(function(){}) ).to.be.undefined;
        });

        it( 'should return 0 if the two colors are the same', function() {
            var c1 = new Pheasant.Color( 25, 100, 123 ),
                c2 = new Pheasant.Color( 25, 100, 123 );

            expect( c1.hueContrast( c2 ) ).to.be.equal( 0 );
            expect( c2.hueContrast( c1 ) ).to.be.equal( 0 );
        });

        it( 'should return 765 if the two colors are black & white', function() {
            var b = new Pheasant.Color(   0,   0,   0 ),
                w = new Pheasant.Color( 255, 255, 255 );

            expect( b.hueContrast( w ) ).to.be.equal( 765 );
            expect( w.hueContrast( b ) ).to.be.equal( 765 );
        });

    });
});
