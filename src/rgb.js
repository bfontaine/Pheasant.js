
    /**
     * RGB, e.g. rgb(42, 255, 2)
     **/
    Pheasant.addFormat((function() {

        var re_rgb_int
                = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;

        return {
            name: 'rgb',
            test: re_rgb_int,
            parse: function parseRGB( s ) {
                var vals;

                if ( !re_rgb_int.test( s ) ) { return null; }
            
                re_rgb_int.lastIndex = 0;
                
                vals = re_rgb_int.exec( s ).slice( 1 ).map(function( n ) {
                
                    return parseInt(n, 10);
                
                });

                return vals;

            },
            stringify: function stringifyRGB( c ) {

                if ( !c || !c.getRGB ) { return null; }

                return 'rgb(' + c.getRGB().map(round).join( ',' ) + ')';

            }

        };

    })());

    /**
     * RGB with percentages, e.g. rgb(42%, 100%, 2%)
     **/
    Pheasant.addFormat((function() {

        var re_rgb_perc
                = /^rgb\(\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/;

        return {
            name: 'rgb%',
            test: re_rgb_perc,
            parse: function parseRGBPerc( s ) {
                var vals;

                if ( !re_rgb_perc.test( s ) ) { return null; }
            
                re_rgb_perc.lastIndex = 0;
                
                vals = re_rgb_perc.exec( s ).slice( 1 ).map(function( n, i ) {

                    return parseInt( n, 10 ) * 255;
                
                });

                return vals;

            },
            stringify: function stringifyRGBPerc( c ) {

                if ( !c || !c.getRGB ) { return null; }

                return 'rgb(' + c.getRGB().map(function( n ) {
                    
                    return ( n > 255 ? 100 : n < 0 ? 0 : (0|n)/2.55 ) + '%';
                
                }).join( ',' ) + ')';

            }

        };

    })());

    /**
     * RGBA, e.g. rgba(42, 255, 12, 0.4)
     **/
    Pheasant.addFormat((function() {

        var re_rgba_int
                = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(1|0(?:\.\d+)?)\s*\)$/;

        return {
            name: 'rgba',
            test: re_rgba_int,
            parse: function parseRGBA( s ) {
                var vals;

                if ( !re_rgba_int.test( s ) ) { return null; }
            
                re_rgba_int.lastIndex = 0;
                
                vals = re_rgba_int.exec( s ).slice( 1 ).map(function( n ) {

                    return parseFloat( n, 10 );
                
                });

                return vals;

            },
            stringify: function stringifyRGBA( c ) {

                if ( !c || !c.getRGBA ) { return null; }

                return 'rgba(' + c.getRGBA().map(function( n, i ) {

                    if ( i < 3 ) { return round( n ); }
                    
                    return ( n > 1 ? 1 : n < 0 ? 0 : n );
                
                }).join( ',' ) + ')';

            }

        };

    })());

    /**
     * RGBA with percentages, e.g. rgba(42%, 100%, 3%, 0.4)
     **/
    Pheasant.addFormat((function() {

        var re_rgba_perc
                = /^rgba\(\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(1|0(?:\.\d+)?)\s*\)$/;

        return {
            name: 'rgba%',
            test: re_rgba_perc,
            parse: function parseRGBAPerc( s ) {
                var vals;

                if ( !re_rgba_perc.test( s ) ) { return null; }
            
                re_rgba_perc.lastIndex = 0;
                
                vals = re_rgba_perc.exec( s ).slice( 1 ).map(function( n, i ) {

                    if ( i < 3 ) { return parseInt( n, 10 ) * 255; }
                
                    return parseFloat( n, 10 );
                
                });

                return vals;

            },
            stringify: function stringifyRGBAPerc( c ) {

                if ( !c || !c.getRGBA ) { return null; }

                return 'rgba(' + c.getRGBA().map(function( n, i ) {

                    if ( i < 3 ) { return round( n ) / 2.55 + '%'; }
                    
                    return ( n > 1 ? 1 : n < 0 ? 0 : n );
                
                }).join( ',' ) + ')';

            }

        };

    })());
