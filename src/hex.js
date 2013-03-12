
    /**
     * Hex3, e.g. #XYZ.
     **/
    Pheasant.addFormat((function() {

        var re_hex3 = /^#([0-f])([0-f])([0-f])$/;

        return {
            name: [ 'hex3', 'hexa3' ],
            test: re_hex3,
            parse: function parseHex3( s ) {
                var vals;

                if ( !re_hex3.test( s ) ) { return null; }
            
                re_hex3.lastIndex = 0;
                
                vals = re_hex3.exec( s ).slice( 1 ).map(function( n ) {
                
                    return parseInt(n+n, 16);
                
                });

                return vals;

            },
            stringify: function stringifyHex3( c ) {

                if ( !c || !c.getRGB ) { return null; }

                return '#' + c.getRGB().map( to_hex( 1 ) ).join( '' );

            }

        };

    })());

    /**
     * Hex6, e.g. #ABCDEF.
     **/
    Pheasant.addFormat((function() {

        var re_hex6 = /^#([0-f]{2})([0-f]{2})([0-f]{2})$/;

        return {
            name: [ 'hex6', 'hexa6' ],
            test: re_hex6,
            parse: function parseHex6( s ) {
                var vals;

                if ( !re_hex6.test( s ) ) { return null; }
            
                re_hex6.lastIndex = 0;
                
                vals = re_hex6.exec( s ).slice( 1 ).map(function( n ) {
                
                    return parseInt(n, 16);
                
                });

                return vals;

            },
            stringify: function stringifyHex6( c ) {

                if ( !c || !c.getRGB ) { return null; }

                return '#' + c.getRGB().map( to_hex( 2 ) ).join( '' );

            }

        };

    })());
