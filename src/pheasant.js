;(function(ctx, undefined) {

        /**
         * Main object
         **/
    var Pheasant = ctx.Pheasant || {},

        /**
         * Default String format. Used for toString().
         **/
        defaultStringFormat = 'hex6',

        /**
         * (Helper) Normalize a string (lower-case and trim)
         **/
        normalizeString = function( s ) {

            return ( s || '' ).toLocaleLowerCase().trim();

        },

        // match 'rgb(X, Y, Z)' strings
        re_rgb_int = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,
        
        // match 'rgb(X%, Y%, Z%)' strings
        re_rgb_perc = /^rgb\(\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/,

        // match 'rgba(X, Y, Z, A)' strings
        re_rgb_int = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(1|0(?:\.\d+))\s*\)$/,
        
        // match 'rgba(X%, Y%, Z%, A)' strings
        re_rgb_perc = /^rgba\(\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(1|0(?:\.\d+))\s*\)$/,

        /**
         * (helper) Force the given number to be in the 0-255 range.
         **/
        round = function( n ) {

            if ( n > 255 ) { return 255; }
            if ( n < 0 ) { return 0; }

            return Math.round( n );
        
        },

        /**
         * (helper) Return a function which returns the hexadecimal
         * representation of its first argument. @len is used to specify
         * the length of the string output.
         **/
        to_hex = function( len ) {

            if ( len === 2 ) {

                return function( n ) {

                    var h = round( n ).toString( 16 );

                    return h.length === 1 ? '0' + h : h;

                };

            }

            if ( len === 1 ) {

                // truncate
                return function( n ) {

                    var h = round( n ).toString( 16 );
                    
                    return h.length === 1 ? '0' : h.charAt( 0 );

                };

            }


            return function( n ) { return round( n ).toString( 16 ); };
        }

        /**
         * (helper) Return a percentage value for the given integer, between
         * 0 and 255.
         **/
        to_perc = function to_perc( n ) {
            return round( n ) / 255;
        }
        ;


    /**
     * Registered color formats
     **/
    Pheasant.formats = {};

    /**
     * Color constructor
     **/
    Pheasant.Color = function( r, g, b, a ) {

        if (!( this instanceof arguments.callee )) {
            return new arguments.callee( r, g, b, a );
        }

        this.r = +r;
        this.g = +g;
        this.b = +b;
        this.a = a === undefined ? 1 : +a;

    };

    /**
     * Return an array of Red, Green and Blue values.
     **/
    Pheasant.Color.prototype.getRGB = function() {
        return [ this.r, this.g, this.b ];
    };

    /**
     * Return an array of Red, Green, Blue and Alpha values.
     **/
    Pheasant.Color.prototype.getRGBA = function() {
        return [ this.r, this.g, this.b, this.a ];
    };

    /**
     * Return a formatted string of the current color.
     **/
    Pheasant.Color.prototype.toString = function( format ) {

        if (   isNaN( this.r )
            || isNaN( this.g )
            || isNaN( this.b )
            || isNaN( this.a ) ) {

            return null;
       
        }

        var stringifier;

        format = normalizeString( format || defaultStringFormat );

        if (!( format in Pheasant.formats )) {
            format = defaultStringFormat;
        }

        stringifier = Pheasant.formats[ format ].stringify;

        return typeof stringifier === 'function' ? stringifier( this ) : null;
    };


    /**
     * Change the default string output format.
     **/
     Pheasant.setDefaultStringFormat = function setDefaultStringFormat( f ) {
     
         defaultStringFormat = normalizeString( f );
     
     };


    /**
     * Return a `Color` object using the given string, or `null` if it can't
     * be parsed.
     **/
    Pheasant.parse = function parse( s ) {

        var val, fmt, parser;

        for ( fmt in Pheasant.formats ) {
            if ( !Pheasant.formats.hasOwnProperty( fmt ) ) { continue; }

            parser = Pheasant.formats[ fmt ].parse;

            if ( typeof parser === 'function' && (val = parser( s ) )) { 

                return val;

            }

        }

        return null;

    };

    /**
     * Register a new color format.
     * @fmt [Object]: the format. It must be an object,
     * with the following properties:
     *  - name [String]: its name. It should be unique (case-insensitive),
     *    otherwise it may override a previously registered format or
     *    be overrided. It may also be an array of Strings ; each
     *    non-already-bound name will be used for this format.
     *  - parse [Function]: a function which takes a string as its
     *    first argument, and returns a Color object if it can parse
     *    it, or `null` if it can't (e.g. wrong formatting).
     *  - stringify [Function]: reverse of `parse` ; a function which
     *    takes a Color object and return a formatted string. It may
     *    return `null` if it’s not possible to stringify the color,
     *    e.g. there's a NaN value somewhere.
     *  - normalize [Boolean]: optional, default to `true`. If set to
     *    false, the parsed string is not normalized, i.e. the case and
     *    trailing spaces are preserved.
     **/
    Pheasant.addFormat = function addFormat( fmt ) {

        var obj = {
            parse: fmt.parse,
            stringify: fmt.stringify
        }, i, len, names, p;

        if ( !fmt || !fmt.name || (!fmt.parse && !fmt.stringify) ) {

            return null;

        }

        if ( fmt.normalize !== false ) {

            p = obj.parse;

            obj.parse = function( s ) { return p( normalizeString( s ) ); }

        }

        if ( fmt.name.splice && fmt.name.length >= 0 ) { // is an array

            names = fmt.name;

            for ( i=0, len=names.length; i<len; i++ ) {

                // already bounded
                if ( names[ i ] in Pheasant.formats ) { continue; }

                name = normalizeString( names[ i ] );

                Pheasant.formats[ name ] = obj;

            }

            return;

        }

        Pheasant.formats[ normalizeString( fmt.name ) ] = obj;

    }

    ctx.Pheasant = Pheasant;

    /****************************************************************
     * Registering formats                                          *
     ****************************************************************/

    /*
        Check Pheasant#addFormat to see how to add a new format. Most
        of the calls below use an IIFE as a closure to cache some
        useful stuff (e.g. regexes).
    */

    /**
     * CSS/SVG color names, e.g. 'white', 'blue', 'lime', etc.
     **/
    Pheasant.addFormat((function() {
        
        /**
         * Legal CSS colors names
         * http://www.w3.org/TR/2010/PR-css3-color-20101028/#svg-color
         **/
        var cssColorsNames = {
            aliceblue            : [ 240 , 248 , 255 ],
            antiquewhite         : [ 250 , 235 , 215 ],
            aqua                 : [ 0   , 255 , 255 ],
            aquamarine           : [ 127 , 255 , 212 ],
            azure                : [ 240 , 255 , 255 ],
            beige                : [ 245 , 245 , 220 ],
            bisque               : [ 255 , 228 , 196 ],
            black                : [ 0   , 0   , 0   ],
            blanchedalmond       : [ 255 , 235 , 205 ],
            blue                 : [ 0   , 0   , 255 ],
            blueviolet           : [ 138 , 43  , 226 ],
            brown                : [ 165 , 42  , 42  ],
            burlywood            : [ 222 , 184 , 135 ],
            cadetblue            : [ 95  , 158 , 160 ],
            chartreuse           : [ 127 , 255 , 0   ],
            chocolate            : [ 210 , 105 , 30  ],
            coral                : [ 255 , 127 , 80  ],
            cornflowerblue       : [ 100 , 149 , 237 ],
            cornsilk             : [ 255 , 248 , 220 ],
            crimson              : [ 220 , 20  , 60  ],
            cyan                 : [ 0   , 255 , 255 ],
            darkblue             : [ 0   , 0   , 139 ],
            darkcyan             : [ 0   , 139 , 139 ],
            darkgoldenrod        : [ 184 , 134 , 11  ],
            darkgray             : [ 169 , 169 , 169 ],
            darkgreen            : [ 0   , 100 , 0   ],
            darkgrey             : [ 169 , 169 , 169 ],
            darkkhaki            : [ 189 , 183 , 107 ],
            darkmagenta          : [ 139 , 0   , 139 ],
            darkolivegreen       : [ 85  , 107 , 47  ],
            darkorange           : [ 255 , 140 , 0   ],
            darkorchid           : [ 153 , 50  , 204 ],
            darkred              : [ 139 , 0   , 0   ],
            darksalmon           : [ 233 , 150 , 122 ],
            darkseagreen         : [ 143 , 188 , 143 ],
            darkslateblue        : [ 72  , 61  , 139 ],
            darkslategray        : [ 47  , 79  , 79  ],
            darkslategrey        : [ 47  , 79  , 79  ],
            darkturquoise        : [ 0   , 206 , 209 ],
            darkviolet           : [ 148 , 0   , 211 ],
            deeppink             : [ 255 , 20  , 147 ],
            deepskyblue          : [ 0   , 191 , 255 ],
            dimgray              : [ 105 , 105 , 105 ],
            dimgrey              : [ 105 , 105 , 105 ],
            dodgerblue           : [ 30  , 144 , 255 ],
            firebrick            : [ 178 , 34  , 34  ],
            floralwhite          : [ 255 , 250 , 240 ],
            forestgreen          : [ 34  , 139 , 34  ],
            fuchsia              : [ 255 , 0   , 255 ],
            gainsboro            : [ 220 , 220 , 220 ],
            ghostwhite           : [ 248 , 248 , 255 ],
            gold                 : [ 255 , 215 , 0   ],
            goldenrod            : [ 218 , 165 , 32  ],
            gray                 : [ 128 , 128 , 128 ],
            green                : [ 0   , 128 , 0   ],
            greenyellow          : [ 173 , 255 , 47  ],
            grey                 : [ 128 , 128 , 128 ],
            honeydew             : [ 240 , 255 , 240 ],
            hotpink              : [ 255 , 105 , 180 ],
            indianred            : [ 205 , 92  , 92  ],
            indigo               : [ 75  , 0   , 130 ],
            ivory                : [ 255 , 255 , 240 ],
            khaki                : [ 240 , 230 , 140 ],
            lavender             : [ 230 , 230 , 250 ],
            lavenderblush        : [ 255 , 240 , 245 ],
            lawngreen            : [ 124 , 252 , 0   ],
            lemonchiffon         : [ 255 , 250 , 205 ],
            lightblue            : [ 173 , 216 , 230 ],
            lightcoral           : [ 240 , 128 , 128 ],
            lightcyan            : [ 224 , 255 , 255 ],
            lightgoldenrodyellow : [ 250 , 250 , 210 ],
            lightgray            : [ 211 , 211 , 211 ],
            lightgreen           : [ 144 , 238 , 144 ],
            lightgrey            : [ 211 , 211 , 211 ],
            lightpink            : [ 255 , 182 , 193 ],
            lightsalmon          : [ 255 , 160 , 122 ],
            lightseagreen        : [ 32  , 178 , 170 ],
            lightskyblue         : [ 135 , 206 , 250 ],
            lightslategray       : [ 119 , 136 , 153 ],
            lightslategrey       : [ 119 , 136 , 153 ],
            lightsteelblue       : [ 176 , 196 , 222 ],
            lightyellow          : [ 255 , 255 , 224 ],
            lime                 : [ 0   , 255 , 0   ],
            limegreen            : [ 50  , 205 , 50  ],
            linen                : [ 250 , 240 , 230 ],
            magenta              : [ 255 , 0   , 255 ],
            maroon               : [ 128 , 0   , 0   ],
            mediumaquamarine     : [ 102 , 205 , 170 ],
            mediumblue           : [ 0   , 0   , 205 ],
            mediumorchid         : [ 186 , 85  , 211 ],
            mediumpurple         : [ 147 , 112 , 219 ],
            mediumseagreen       : [ 60  , 179 , 113 ],
            mediumslateblue      : [ 123 , 104 , 238 ],
            mediumspringgreen    : [ 0   , 250 , 154 ],
            mediumturquoise      : [ 72  , 209 , 204 ],
            mediumvioletred      : [ 199 , 21  , 133 ],
            midnightblue         : [ 25  , 25  , 112 ],
            mintcream            : [ 245 , 255 , 250 ],
            mistyrose            : [ 255 , 228 , 225 ],
            moccasin             : [ 255 , 228 , 181 ],
            navajowhite          : [ 255 , 222 , 173 ],
            navy                 : [ 0   , 0   , 128 ],
            oldlace              : [ 253 , 245 , 230 ],
            olive                : [ 128 , 128 , 0   ],
            olivedrab            : [ 107 , 142 , 35  ],
            orange               : [ 255 , 165 , 0   ],
            orangered            : [ 255 , 69  , 0   ],
            orchid               : [ 218 , 112 , 214 ],
            palegoldenrod        : [ 238 , 232 , 170 ],
            palegreen            : [ 152 , 251 , 152 ],
            paleturquoise        : [ 175 , 238 , 238 ],
            palevioletred        : [ 219 , 112 , 147 ],
            papayawhip           : [ 255 , 239 , 213 ],
            peachpuff            : [ 255 , 218 , 185 ],
            peru                 : [ 205 , 133 , 63  ],
            pink                 : [ 255 , 192 , 203 ],
            plum                 : [ 221 , 160 , 221 ],
            powderblue           : [ 176 , 224 , 230 ],
            purple               : [ 128 , 0   , 128 ],
            red                  : [ 255 , 0   , 0   ],
            rosybrown            : [ 188 , 143 , 143 ],
            royalblue            : [ 65  , 105 , 225 ],
            saddlebrown          : [ 139 , 69  , 19  ],
            salmon               : [ 250 , 128 , 114 ],
            sandybrown           : [ 244 , 164 , 96  ],
            seagreen             : [ 46  , 139 , 87  ],
            seashell             : [ 255 , 245 , 238 ],
            sienna               : [ 160 , 82  , 45  ],
            silver               : [ 192 , 192 , 192 ],
            skyblue              : [ 135 , 206 , 235 ],
            slateblue            : [ 106 , 90  , 205 ],
            slategray            : [ 112 , 128 , 144 ],
            slategrey            : [ 112 , 128 , 144 ],
            snow                 : [ 255 , 250 , 250 ],
            springgreen          : [ 0   , 255 , 127 ],
            steelblue            : [ 70  , 130 , 180 ],
            tan                  : [ 210 , 180 , 140 ],
            teal                 : [ 0   , 128 , 128 ],
            thistle              : [ 216 , 191 , 216 ],
            tomato               : [ 255 , 99  , 71  ],
            turquoise            : [ 64  , 224 , 208 ],
            violet               : [ 238 , 130 , 238 ],
            wheat                : [ 245 , 222 , 179 ],
            white                : [ 255 , 255 , 255 ],
            whitesmoke           : [ 245 , 245 , 245 ],
            yellow               : [ 255 , 255 , 0   ],
            yellowgreen          : [ 154 , 205 , 50  ]
        };
        
        return {
            name: [ 'colorName', 'colourName' ],
            parse: function( s ) {

                if ( cssColorsNames.hasOwnProperty(s) ) {

                    return Pheasant.Color.apply(null, cssColorsNames[s])

                }

                return null;

            },
            stringify: function( c ) {

                var myVals = c.getRGB().map(round).join( ',' ), name;

                for ( name in cssColorsNames ) {
                    if (!cssColorsNames.hasOwnProperty( name ) ) { continue; }

                    if ( myVals === cssColorsNames[ name ].join( ',' ) ) {
                        return name;
                    }

                }

                return null;

            }
        };

    })());

    /**
     * Hex3, e.g. #XYZ.
     **/
    Pheasant.addFormat((function() {

        var re_hex3 = /^#([0-f])([0-f])([0-f])$/;

        return {
            name: [ 'hex3', 'hexa3' ],
            parse: function parseHex3( s ) {
                var vals;

                if ( !re_hex3.test( s ) ) { return null; }
            
                re_hex3.lastIndex = 0;
                
                vals = re_hex3.exec( s ).slice( 1 ).map(function( n ) {
                
                    return parseInt(n+n, 16);
                
                });

                return Pheasant.Color.apply( null, vals );

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
            parse: function parseHex6( s ) {
                var vals;

                if ( !re_hex6.test( s ) ) { return null; }
            
                re_hex6.lastIndex = 0;
                
                vals = re_hex6.exec( s ).slice( 1 ).map(function( n ) {
                
                    return parseInt(n, 16);
                
                });

                return Pheasant.Color.apply( null, vals );

            },
            stringify: function stringifyHex6( c ) {

                if ( !c || !c.getRGB ) { return null; }

                return '#' + c.getRGB().map( to_hex( 2 ) ).join( '' );

            }

        };

    })());

    /**
     * RGB, e.g. rgb(42, 255, 2)
     **/
    Pheasant.addFormat((function() {

        var re_rgb_int = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;

        return {
            name: 'rgb',
            parse: function parseHex6( s ) {
                var vals;

                if ( !re_rgb_int.test( s ) ) { return null; }
            
                re_rgb_int.lastIndex = 0;
                
                vals = re_rgb_int.exec( s ).slice( 1 ).map(function( n ) {
                
                    return parseInt(n, 10);
                
                });

                return Pheasant.Color.apply( null, vals );

            },
            stringify: function stringifyHex6( c ) {

                if ( !c || !c.getRGB ) { return null; }

                return 'rgb(' + c.getRGB().map(round).join( ',' ) + ')';

            }

        };

    })());

})( typeof module === 'object' ? module.exports : this );
