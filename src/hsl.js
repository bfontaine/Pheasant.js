
    /**
     * HSL, e.g. hsl(330, 42%, 12%)
     **/
    Pheasant.addFormat((function() {

        var re_hsl
                = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/;

        return {
            name: 'hsl',
            test: re_hsl,
            parse: function parseHSL( s ) {

                var vals;

                if ( !re_hsl.test( s ) ) { return null; }
            
                re_hsl.lastIndex = 0;
                
                vals = re_hsl.exec( s ).slice( 1 ).map(function( n ) {

                    return parseInt( n, 10 );
                
                });

                return hsl2rgb( vals[ 0 ], vals[ 1 ] / 100, vals[ 2 ] / 100 );

            },
            stringify: function stringifyHSL( c ) {

                var hsl;

                if ( !c || !c.getRGB ) { return null; }

                hsl = rgb2hsl.apply( null, c.getRGB().map( round ) );

                return 'hsl(' + hsl.map(function( n, i ) {

                    return i > 0 ? n + '%' : n;

                }).join( ',' ) + ')';

            }

        };

    })());

    /**
     * HSLa, e.g. hsla(330, 42%, 12%, 0.45)
     **/
    Pheasant.addFormat((function() {

        var re_hsla
                = /^hsla\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(1|0(?:\.\d+))?\s*\)$/;

        return {
            name: 'hsla',
            test: re_hsla,
            parse: function parseHSLa( s ) {

                var vals, rgb;

                if ( !re_hsla.test( s ) ) { return null; }
            
                re_hsla.lastIndex = 0;
                
                vals = re_hsla.exec( s ).slice( 1 ).map(function( n, i ) {

                    if ( i > 2 ) { return parseFloat( n, 10 ); }

                    return parseInt( n, 10 );
                
                });

                rgb = hsl2rgb( vals[ 0 ], vals[ 1 ] / 100, vals[ 2 ] / 100 );
                rgb.push( vals[ 3 ] ); // alpha

                return rgb;

            },
            stringify: function stringifyHSLa( c ) {

                var hsl;

                if ( !c || !c.getRGB ) { return null; }

                hsl = rgb2hsl.apply( null, c.getRGB().map( round ) );

                hsl.push( c.alpha );

                return 'hsla(' + hsl.map(function( n, i ) {

                    return i === 1 || i === 2 ? n + '%' : n;

                }).join( ',' ) + ')';

            }

        };

    })());
