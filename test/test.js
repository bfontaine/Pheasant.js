var src      = process.env.PHEASANT_COV ? 'src-cov' : 'src',
    Pheasant = require( __dirname + '/../' + src + '/pheasant' ).Pheasant
    chai     = require( 'chai' ),
    
    expect   = chai.expect,
    assert   = chai.assert;

describe( 'Settings', function() {

    describe( 'Pheasant.setDefaultStringFormat', function() {

        it( 'should change the default formatting', function() {

            Pheasant.setDefaultStringFormat( 'hex3' );
            expect( Pheasant.parse( '#000' ).toString() ).to.equal( '#000' );
            Pheasant.setDefaultStringFormat( 'hex6' );
            expect( Pheasant.parse( '#000' ).toString() ).to.equal( '#000000' );
            expect( Pheasant.parse( '#000' ).toString( 'hex3' ) ).to.equal( '#000' );

        });

        it( 'should normalize strings with spaces before and/or after', function() {

            Pheasant.setDefaultStringFormat( '  hex3' );
            expect( Pheasant.parse( '#000' ).toString() ).to.equal( '#000' );
            Pheasant.setDefaultStringFormat( ' hex6  ' );
            expect( Pheasant.parse( '#000' ).toString() ).to.equal( '#000000' );

        });

        it( 'should normalize mixed-case strings', function() {

            Pheasant.setDefaultStringFormat( 'hEx3' );
            expect( Pheasant.parse( '#000' ).toString() ).to.equal( '#000' );
            Pheasant.setDefaultStringFormat( 'HEX6' );
            expect( Pheasant.parse( '#000' ).toString() ).to.equal( '#000000' );

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

        it( 'should normalize strings with spaces before and/or after', function() {

            expect( Pheasant.parse( '   lime' ).toString() ).to.equal( '#0f0' );
            expect( Pheasant.parse( 'black   ' ).toString() ).to.equal( '#000' );
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

            expect( Pheasant.parse( 'transparent' ).toString( 'rgba' ) ).to.equal( 'rgba(0,0,0,0)' );

        });

    });

    describe( 'of hexadecimal strings of length 3', function() {

        it( 'should normalize strings with spaces before and/or after', function() {

            expect( Pheasant.parse( '  #abc' ).toString() ).to.equal( '#abc' );
            expect( Pheasant.parse( '#acc   ' ).toString() ).to.equal( '#acc' );
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

        it( 'should normalize strings with spaces before and/or after', function() {

            expect( Pheasant.parse( '  #abcdef' ).toString() ).to.equal( '#ace' );
            expect( Pheasant.parse( '#ab0def   ' ).toString() ).to.equal( '#a0e' );
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

    describe( 'of RGB() strings', function() {

        it( 'should normalize strings with spaces before and/or after', function() {

            expect( Pheasant.parse( '  rgb(0,0,0)' ).toString() ).to.equal( '#000' );
            expect( Pheasant.parse( 'rgb(0,0,255) ' ).toString() ).to.equal( '#00f' );
            expect( Pheasant.parse( ' rgb(0,255,0)   ' ).toString() ).to.equal( '#0f0' );

        });

        it( 'should normalize strings with spaces in them', function() {

            expect( Pheasant.parse( 'rgb(0  ,255 , 0 )' ).toString() ).to.equal( '#0f0' );

        });

        it( 'should normalize mixed-case strings', function() {

            expect( Pheasant.parse( 'RgB(0,0,255)' ).toString() ).to.equal( '#00f' );
            expect( Pheasant.parse( 'RGB(0,0,255)' ).toString() ).to.equal( '#00f' );

        });

        it( 'should handle RGB() strings', function() {

            expect( Pheasant.parse( 'rgb(0,0,0)' ).toString() ).to.equal( '#000' );
            expect( Pheasant.parse( 'rgb(0,255,0)' ).toString() ).to.equal( '#0f0' );

        });

    });

    describe( 'of RGB() strings, with percentages', function() {

        it( 'should normalize strings with spaces before and/or after', function() {

            expect( Pheasant.parse( '  rgb(0%,0%,0%)' ).toString() ).to.equal( '#000' );
            expect( Pheasant.parse( 'rgb(100%,0%,0%)   ' ).toString() ).to.equal( '#f00' );
            expect( Pheasant.parse( ' rgb(0%,100%,0%)   ' ).toString() ).to.equal( '#0f0' );

        });

        it( 'should normalize strings with spaces in them', function() {

            expect( Pheasant.parse( 'rgb(0%  ,100% , 0% )' ).toString() ).to.equal( '#0f0' );

        });

        it( 'should normalize mixed-case strings', function() {

            expect( Pheasant.parse( 'RgB(0%,0%,100%)' ).toString() ).to.equal( '#00f' );
            expect( Pheasant.parse( 'RGB(0%,0%,100%)' ).toString() ).to.equal( '#00f' );

        });

        it( 'should handle RGB() strings with percentages', function() {

            expect( Pheasant.parse( 'rgb(0%,0%,0%)' ).toString() ).to.equal( '#000' );
            expect( Pheasant.parse( 'rgb(0%,100%,0%)' ).toString() ).to.equal( '#0f0' );

        });

    });

    describe( 'of RGBA() strings', function() {

        it( 'should normalize strings with spaces before and/or after', function() {

            expect( Pheasant.parse( '  rgba(0,255,0,1)' ).toString() ).to.equal( '#0f0' );
            expect( Pheasant.parse( 'rgba(255,0,0,1)   ' ).toString() ).to.equal( '#f00' );
            expect( Pheasant.parse( ' rgba(0,255,0,1)   ' ).toString() ).to.equal( '#0f0' );

        });

        it( 'should normalize strings with spaces in them', function() {

            expect( Pheasant.parse( 'rgba(0  ,255 , 0 ,1)' ).toString() ).to.equal( '#0f0' );

        });

        it( 'should normalize mixed-case strings', function() {

            expect( Pheasant.parse( 'rGbA(0,0,255,1)' ).toString() ).to.equal( '#00f' );
            expect( Pheasant.parse( 'RGBA(0,0,255,1)' ).toString() ).to.equal( '#00f' );

        });

        it( 'should parse alpha channels as floats', function() {

            expect( Pheasant.parse( 'rGbA(0,0,255,0.1)' ).toString() ).to.equal( '#00f' );
            expect( Pheasant.parse( 'RGBA(0,0,255,0.9)' ).toString() ).to.equal( '#00f' );
            expect( Pheasant.parse( 'RGBA(0,0,255,0.4)' ).a ).to.equal( 0.4 );

        });

        it( 'should handle rgba() strings', function() {

            expect( Pheasant.parse( 'rgba(0,0,0,1)' ).toString() ).to.equal( '#000' );
            expect( Pheasant.parse( 'rgba(0,255,0,1)' ).toString() ).to.equal( '#0f0' );

        });

    });

    describe( 'of RGBA() strings with percentages', function() {

        it( 'should normalize strings with spaces before and/or after', function() {

            expect( Pheasant.parse( '  rgba(0%,100%,0%,1)' ).toString() ).to.equal( '#0f0' );
            expect( Pheasant.parse( 'rgba(0%,0%,100%,0) ' ).toString() ).to.equal( '#00f' );
            expect( Pheasant.parse( ' rgba(0%,100%,0%,1)   ' ).toString() ).to.equal( '#0f0' );

        });

        it( 'should normalize strings with spaces in them', function() {

            expect( Pheasant.parse( 'rgba(0%  ,100% , 0% ,1)' ).toString() ).to.equal( '#0f0' );

        });

        it( 'should normalize mixed-case strings', function() {

            expect( Pheasant.parse( 'rGbA(0%,0%,100%,1)' ).toString() ).to.equal( '#00f' );
            expect( Pheasant.parse( 'RGBA(0%,0%,100%,1)' ).toString() ).to.equal( '#00f' );

        });

        it( 'should parse alpha channels as floats', function() {

            expect( Pheasant.parse( 'rGbA(0%,0%,100%,0.1)' ).toString() ).to.equal( '#00f' );
            expect( Pheasant.parse( 'RGBA(0%,0%,100%,0.9)' ).toString() ).to.equal( '#00f' );

        });

        it( 'should handle rgba() strings with percentages', function() {

            expect( Pheasant.parse( 'rgba(0%,0%,0%,1)' ).toString() ).to.equal( '#000' );
            expect( Pheasant.parse( 'rgba(0%,100%,0%,1)' ).toString() ).to.equal( '#0f0' );

        });

    });

    describe( 'of HSL() strings', function() {

        it( 'should normalize strings with spaces before and/or after', function() {

            expect( Pheasant.parse( '  hsl(0,100%,50%)' ).toString() ).to.equal( '#f00' );
            expect( Pheasant.parse( 'hsl(0,100%,50%) ' ).toString() ).to.equal( '#f00' );
            expect( Pheasant.parse( '  hsl(0,100%,50%) ' ).toString() ).to.equal( '#f00' );

        });

        it( 'should normalize strings with spaces in them', function() {

            expect( Pheasant.parse( 'hsl( 0 ,  100% , 50%  )' ).toString() ).to.equal( '#f00' );

        });

        it( 'should normalize mixed-case strings', function() {

            expect( Pheasant.parse( 'HSL(0,100%,50%)' ).toString() ).to.equal( '#f00' );

        });

        it( 'should handle hsl() strings', function() {

            Pheasant.setDefaultStringFormat( 'colorname' );

            expect( Pheasant.parse( 'hsl(0,100%,50%)'   ).toString() ).to.equal( 'red' );
            expect( Pheasant.parse( 'hsl(240,100%,50%)' ).toString() ).to.equal( 'blue' );
            expect( Pheasant.parse( 'hsl(360,100%,0%)' ).toString() ).to.equal( 'black' );
            expect( Pheasant.parse( 'hsl(120,100%,25%)' ).toString() ).to.equal( 'green' );
            expect( Pheasant.parse( 'hsl(120,100%,50%)' ).toString() ).to.equal( 'lime' );

        });

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

    describe( 'to CSS/SVG color names', function() {

        beforeEach(function() {

            Pheasant.setDefaultStringFormat( 'colorname' );

        });

        it( 'should normalize colors with values higher than 255', function() {

            expect( new Pheasant.Color( 256, 0, 0 ).toString() ).to.equal( 'red' );
            expect( new Pheasant.Color( Infinity, 0, 4242 ).toString() ).to.equal( 'fuchsia' );

        });

        it( 'should normalize colors with negative values', function() {

            expect( new Pheasant.Color( -1, 0, 0 ).toString() ).to.equal( 'black' );
            expect( new Pheasant.Color( -Infinity, 128, -4242 ).toString() ).to.equal( 'green' );

        });

        it( 'should normalize colors with float values', function() {

            expect( new Pheasant.Color( 0, 127.7, 0 ).toString() ).to.equal( 'green' );

        });

        it( 'should normalize colors with negative float values', function() {

            expect( new Pheasant.Color( 0, -15.99, -1.42 ).toString() ).to.equal( 'black' );

        });

        it( 'should not handle colors with NaN values', function() {

            expect( new Pheasant.Color( 0, NaN, 0 ).toString() ).to.be.null;

        });

        it( 'should return null if there\'s no name for the current color', function() {

            expect( new Pheasant.Color( 1, 1, 1 ).toString() ).to.be.null;

        });

    });

    describe( 'to RGB() format', function() {

        beforeEach(function() {

            Pheasant.setDefaultStringFormat( 'rgb' );

        });

        it( 'should normalize colors with values higher than 255', function() {

            expect( new Pheasant.Color( 256, 0, 0 ).toString() ).to.equal( 'rgb(255,0,0)' );
            expect( new Pheasant.Color( Infinity, 0, 4242 ).toString() ).to.equal( 'rgb(255,0,255)' );

        });

        it( 'should normalize colors with negative values', function() {

            expect( new Pheasant.Color( -1, 0, 0 ).toString() ).to.equal( 'rgb(0,0,0)' );
            expect( new Pheasant.Color( -Infinity, 128, -4242 ).toString() ).to.equal( 'rgb(0,128,0)' );

        });

        it( 'should normalize colors with float values', function() {

            expect( new Pheasant.Color( 0, 127.7, 0 ).toString() ).to.equal( 'rgb(0,128,0)' );

        });

        it( 'should normalize colors with negative float values', function() {

            expect( new Pheasant.Color( 0, -15.99, -1.42 ).toString() ).to.equal( 'rgb(0,0,0)' );

        });

        it( 'should not handle colors with NaN values', function() {

            expect( new Pheasant.Color( 0, NaN, 0 ).toString() ).to.be.null;

        });

    });

    describe( 'to RGB() format, with percentages', function() {

        beforeEach(function() {

            Pheasant.setDefaultStringFormat( 'rgb%' );

        });

        it( 'should normalize colors with values higher than 255', function() {

            expect( new Pheasant.Color( 256, 0, 0 ).toString() ).to.equal( 'rgb(100%,0%,0%)' );
            expect( new Pheasant.Color( Infinity, 0, 4242 ).toString() ).to.equal( 'rgb(100%,0%,100%)' );

        });

        it( 'should normalize colors with negative values', function() {

            expect( new Pheasant.Color( -1, 0, 0 ).toString() ).to.equal( 'rgb(0%,0%,0%)' );
            expect( new Pheasant.Color( -Infinity, 255, -4242 ).toString() ).to.equal( 'rgb(0%,100%,0%)' );

        });

        it( 'should normalize colors with float values', function() {

            expect( new Pheasant.Color( 0, 255.7, 0 ).toString() ).to.equal( 'rgb(0%,100%,0%)' );

        });

        it( 'should normalize colors with negative float values', function() {

            expect( new Pheasant.Color( 0, -15.99, -1.42 ).toString() ).to.equal( 'rgb(0%,0%,0%)' );

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

            expect( new Pheasant.Color( 256, 0, 0, 1 ).toString() ).to.equal( 'rgba(255,0,0,1)' );
            expect( new Pheasant.Color( Infinity, 0, 4242, 0 ).toString() ).to.equal( 'rgba(255,0,255,0)' );

        });

        it( 'should normalize colors with negative values', function() {

            expect( new Pheasant.Color( -1, 0, 0, 0 ).toString() ).to.equal( 'rgba(0,0,0,0)' );
            expect( new Pheasant.Color( -Infinity, 255, -4242, 1 ).toString() ).to.equal( 'rgba(0,255,0,1)' );

        });

        it( 'should normalize colors with float values', function() {

            expect( new Pheasant.Color( 0, 255.7, 0, 0 ).toString() ).to.equal( 'rgba(0,255,0,0)' );

        });

        it( 'should normalize colors with negative float values', function() {

            expect( new Pheasant.Color( 0, -15.99, -1.42, 1 ).toString() ).to.equal( 'rgba(0,0,0,1)' );

        });

        it( 'should normalize alpha channels higher than 1', function() {

            expect( new Pheasant.Color( 0, 0, 0, 42 ).toString() ).to.equal( 'rgba(0,0,0,1)' );
            expect( new Pheasant.Color( 0, 0, 0, 1.2 ).toString() ).to.equal( 'rgba(0,0,0,1)' );

        });

        it( 'should normalize negative alpha channels', function() {

            expect( new Pheasant.Color( 0, 42, 0, -42 ).toString() ).to.equal( 'rgba(0,42,0,0)' );
            expect( new Pheasant.Color( 0, 0, 0, -1.2 ).toString() ).to.equal( 'rgba(0,0,0,0)' );

        });

        it( 'should keep alpha channels between 0 and 1 (non inclusive)', function() {

            expect( new Pheasant.Color( 0, 0, 0, 0.1 ).toString() ).to.equal( 'rgba(0,0,0,0.1)' );
            expect( new Pheasant.Color( 0, 0, 255, 0.6 ).toString() ).to.equal( 'rgba(0,0,255,0.6)' );

        });

        it( 'should not handle colors with NaN values', function() {

            expect( new Pheasant.Color( 0, NaN, 0, 0 ).toString() ).to.be.null;
            expect( new Pheasant.Color( 0, 0, 0, NaN ).toString() ).to.be.null;

        });

    });

    describe( 'to RGBA() format, with percentages', function() {

        beforeEach(function() {

            Pheasant.setDefaultStringFormat( 'rgba%' );

        });

        it( 'should normalize colors with values higher than 255', function() {

            expect( new Pheasant.Color( 256, 0, 0, 1 ).toString() ).to.equal( 'rgba(100%,0%,0%,1)' );
            expect( new Pheasant.Color( Infinity, 0, 4242, 0 ).toString() ).to.equal( 'rgba(100%,0%,100%,0)' );

        });

        it( 'should normalize colors with negative values', function() {

            expect( new Pheasant.Color( -1, 0, 0, 0 ).toString() ).to.equal( 'rgba(0%,0%,0%,0)' );
            expect( new Pheasant.Color( -Infinity, 255, -4242, 1 ).toString() ).to.equal( 'rgba(0%,100%,0%,1)' );

        });

        it( 'should normalize colors with float values', function() {

            expect( new Pheasant.Color( 0, 255.7, 0, 0 ).toString() ).to.equal( 'rgba(0%,100%,0%,0)' );

        });

        it( 'should normalize colors with negative float values', function() {

            expect( new Pheasant.Color( 0, -15.99, -1.42, 1 ).toString() ).to.equal( 'rgba(0%,0%,0%,1)' );

        });

        it( 'should normalize alpha channels higher than 1', function() {

            expect( new Pheasant.Color( 0, 0, 0, 42 ).toString() ).to.equal( 'rgba(0%,0%,0%,1)' );
            expect( new Pheasant.Color( 0, 0, 0, 1.2 ).toString() ).to.equal( 'rgba(0%,0%,0%,1)' );

        });

        it( 'should normalize negative alpha channels', function() {

            expect( new Pheasant.Color( 0, 255, 0, -42 ).toString() ).to.equal( 'rgba(0%,100%,0%,0)' );
            expect( new Pheasant.Color( 0, 0, 0, -1.2 ).toString() ).to.equal( 'rgba(0%,0%,0%,0)' );

        });

        it( 'should keep alpha channels between 0 and 1 (non inclusive)', function() {

            expect( new Pheasant.Color( 0, 0, 0, 0.1 ).toString() ).to.equal( 'rgba(0%,0%,0%,0.1)' );
            expect( new Pheasant.Color( 0, 0, 255, 0.6 ).toString() ).to.equal( 'rgba(0%,0%,100%,0.6)' );

        });

        it( 'should not handle colors with NaN values', function() {

            expect( new Pheasant.Color( 0, NaN, 0, 0 ).toString() ).to.be.null;
            expect( new Pheasant.Color( 0, 0, 0, NaN ).toString() ).to.be.null;

        });

    });

});

describe( 'addFormat', function() {

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

    it( 'should return null if the format has no .parse nor .stringify property', function() {

        expect( Pheasant.addFormat({ name: 'foo' }) ).to.be.null;

    });

    it( 'should return the name of the new format', function() {

        var noop = function(s){};

        expect( Pheasant.addFormat({ name: 'foo', parse: noop }) ).to.equal( 'foo' );
        expect( Pheasant.addFormat({ name: ' bAr  ', parse: noop }) ).to.equal( 'bar' );

    });

});
