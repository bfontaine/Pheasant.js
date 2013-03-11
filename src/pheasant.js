;(function(ctx, undefined) {

    'use strict'

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

            // length 1 -> truncate
            return function( n ) {

                var h = round( n ).toString( 16 );
                
                return h.length === 1 ? '0' : h.charAt( 0 );

            };

        },
        
        /**
         * (helper) convert from HSL to RGB
         * cf http://en.wikipedia.org/wiki/HSL_and_HSV#From_HSL
         **/
        hsl2rgb = function( h, s, l ) {

            var c, h2, x, rgb1, m, rgb;

            // chroma
            c = ( 1 - Math.abs( 2 * l - 1 ) ) * s;
            h2 = h / 60;
            x = c * ( 1 - Math.abs( h2 % 2 - 1 ) );

            rgb1 = [ 0, 0, 0 ];

            /**/ if ( h2 >= 0 && h2 < 1 ) { rgb1 = [ c, x, 0 ]; } 
            else if ( h2 >= 1 && h2 < 2 ) { rgb1 = [ x, c, 0 ]; }
            else if ( h2 >= 2 && h2 < 3 ) { rgb1 = [ 0, c, x ]; }
            else if ( h2 >= 3 && h2 < 4 ) { rgb1 = [ 0, x, c ]; }
            else if ( h2 >= 4 && h2 < 5 ) { rgb1 = [ x, 0, c ]; }
            else if ( h2 >= 5 && h2 < 6 ) { rgb1 = [ c, 0, x ]; }

            m = l - c / 2;

            return rgb1.map(function( n ) { return (n + m) * 255; });

        },
        
        /**
         * (helper) Convert from RGB to HSL
         * cf http://www.easyrgb.com/index.php?X=MATH&H=18#text18
         **/
        rgb2hsl = function( r, g, b ) {

            var h, s, l,
                min, max, delta, l, r2, g2, b2;

            r = r / 255;
            g = g / 255;
            b = b / 255;

            min = Math.min( r, g, b );
            max = Math.max( r, g, b );
            delta = max - min;

            h = s = 0;
            l = ( max + min ) / 2;

            if ( delta !== 0 ) {

                s = delta / ( l < 0.5 ? max + min : 2 - max - min );

                r2 = ( ( max - r ) / 6 + delta / 2 ) / delta;
                g2 = ( ( max - g ) / 6 + delta / 2 ) / delta;
                b2 = ( ( max - b ) / 6 + delta / 2 ) / delta;

                /**/ if ( r === max ) { h = b2 - g2; }
                else if ( g === max ) { h = 1 / 3 + r2 - b2; }
                else if ( b === max ) { h = 2 / 3 + g2 - r2; }

                if ( h < 0 ) { h += 1 }
                if ( h > 1 ) { h -= 1 }
            }

            return [ h * 360, s * 100, l * 100 ].map( Math.round );

        },

        /**
         * Valid range types. See: Pheasant#range.
         **/
        rangeTypes = [ 'string', 'object', 'rgb', 'rgba' ],

        /**
         * (helper) Compare two colors, and return the differences between
         * them, e.g.:
         *      var c1 = new Pheasant.Color( 50, 100, 150 ),
         *          c2 = new Pheasant.Color( 150, 100, 50 ):
         *
         *      cmpColors( c1, c2 ); // [ 100, 0, -100, 0 ]
         **/
        cmpColors = function cmpColors( c1, c2 ) {

            return [
                c2.red - c1.red,
                c2.green - c1.green,
                c2.blue - c1.blue,
                c2.alpha - c1.alpha
            ];

        };


    /**
     * Registered color formats
     **/
    Pheasant.formats = {};


    /**
     * Color constructor
     **/
    Pheasant.Color = function( r, g, b, a ) {

        if (!( this instanceof Pheasant.Color )) {
            return new Pheasant.Color( r, g, b, a );
        }

        if ( typeof r !== 'number' ) { r = 0; }
        if ( typeof g !== 'number' ) { g = 0; }
        if ( typeof b !== 'number' ) { b = 0; }

        this.red   = round( +r );
        this.green = round( +g );
        this.blue  = round( +b );
        this.alpha = a === undefined ? 1 : +a;

    };

    /**
     * Return an array of Red, Green and Blue values.
     **/
    Pheasant.Color.prototype.getRGB = function() {
        return [ this.red, this.green, this.blue ];
    };

    /**
     * Return an array of Red, Green, Blue and Alpha values.
     **/
    Pheasant.Color.prototype.getRGBA = function() {
        return [ this.red, this.green, this.blue, this.alpha ];
    };

    /**
     * Return a formatted string of the current color.
     **/
    Pheasant.Color.prototype.toString = function( format ) {

        var stringifier;

        if (   isNaN( this.red )
            || isNaN( this.green )
            || isNaN( this.blue )
            || isNaN( this.alpha ) ) {

            return null;
       
        }

        if ( arguments.length === 0 ) {

            format = defaultStringFormat;

        } else if (!( format in Pheasant.formats )) {

            return null;

        }

        stringifier = Pheasant.formats[ format ].stringify;

        return typeof stringifier === 'function' ? stringifier( this ) : null;
    };

    /**
     * Return a new Color object, representing the negative of the current
     * color.
     **/
    Pheasant.Color.prototype.negative = function() {

        return new Pheasant.Color(
            255 - this.red,
            255 - this.green,
            255 - this.blue,
            this.alpha
        );

    };

    /**
     * Return a `Color` object using the given string, or `null` if it can't
     * be parsed.
     **/
    Pheasant.parse = function parse( s ) {

        var val, id, fmt, parser;

        for ( id in Pheasant.formats ) {
            if ( !Pheasant.formats.hasOwnProperty( id ) ) { continue; }

            fmt = Pheasant.formats[ id ];

            if ( typeof fmt.test === 'function' && !fmt.test( s ) ) {

                continue;

            }

            parser = fmt.parse;

            if ( typeof parser === 'function' && (val = parser( s ) )) { 

                return val;

            }

        }

        return null;

    };

    /**
     * Convert a color in another format. This is shorter than
     * a call to parse/toString for a one-time conversion.
     * @s [String]: the string to convert
     * @fmt [String]: the name of the format
     **/
    Pheasant.convert = function convert( s, fmt ) {

        var c = Pheasant.parse( s );
        
        return c === null ? null : c.toString( fmt );

    };

    /**
     * Change the default string output format.
     **/
     Pheasant.setDefaultStringFormat = function setDefaultStringFormat( f ) {
     
         defaultStringFormat = normalizeString( f );
     
     };

     /**
      * Guess the string's color format. Return a lowercase string, or `null` if
      * the format is not valid/supported.
      **/
     Pheasant.guessFormat = function guessFormat( s ) {

         var id, fmt;

         if ( '' + s !== s ) { return null; }

         for ( id in Pheasant.formats ) {
            if ( !Pheasant.formats.hasOwnProperty( id ) ) { continue; }

            fmt = Pheasant.formats[ id ];

            if ( fmt.test && fmt.test( s ) ) {

                return id;

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
     *    first argument, and returns an object or an array if it can parse
     *    it, or `null` if it can't (e.g. wrong formatting). The object
     *    should have the following properties:
     *    - red [Number]: an integer between 0 and 255 (default: 0)
     *    - blue [Number]: an integer between 0 and 255 (default: 0)
     *    - green [Number]: an integer between 0 and 255 (default: 0)
     *    - alpha [Number]: a number between 0 and 1 (default: 1)
     *    The function can also return an array of 3 or 4 values, representing
     *    the red, blue, green (and optionally alpha) channels.
     *  - stringify [Function]: reverse of `parse` ; a function which
     *    takes a Color object and return a formatted string. It may
     *    return `null` if it’s not possible to stringify the color,
     *    e.g. there's a NaN value somewhere.
     *  - normalize [Boolean]: optional, default to `true`. If set to
     *    false, the parsed string is not normalized, i.e. the case and
     *    trailing spaces are preserved.
     *  - test [Function]: optional. If defined, it's used to test if a string
     *    is valid in this format. The function takes a string and return a
     *    boolean.
     **/
    Pheasant.addFormat = function addFormat( fmt ) {

        var obj, i, len, name, names, registered_names, p,
            test, t;

        if (   !fmt || !fmt.name
            || (!fmt.parse && !fmt.stringify)
            || fmt.name in Pheasant.formats ) {

            return null;

        }

        // function
        if ( typeof fmt.test === 'function' ) { test = fmt.test; }

        // regex
        else if ( fmt.test && typeof fmt.test.test === 'function' ) {

            test = fmt.test.test.bind( fmt.test );

        }

        obj = {
            parse: function( s ) {

                var color = fmt.parse( s ), alpha;

                if ( !color ) { return null; }

                // array

                if ( color.length >= 0 && color.splice ) {

                    return Pheasant.Color.apply( null, color );

                }

                // object

                alpha = isNaN(color.alpha) ? 1 : color.alpha;

                if (!( 'red'   in color )) { color.red   = 0; }
                if (!( 'green' in color )) { color.green = 0; }
                if (!( 'blue'  in color )) { color.blue  = 0; }

                return new Pheasant.Color(
                    color.red,
                    color.green,
                    color.blue,
                    alpha
                );

            },
            stringify: fmt.stringify,

            test: test
        };

        if ( fmt.normalize !== false ) {

            p = obj.parse;

            obj.parse = function( s ) { return p( normalizeString( s ) ); }

            if ( obj.test ) {

                t = obj.test;
                obj.test  = function( s ) { return t( normalizeString( s ) ); }

            }

        }

        if ( fmt.name.splice && fmt.name.length >= 0 ) { // is an array

            names = fmt.name;
            registered_names = [];

            for ( i=0, len=names.length; i<len; i++ ) {

                // already bounded
                if ( names[ i ] in Pheasant.formats ) { continue; }

                name = normalizeString( names[ i ] );

                Pheasant.formats[ name ] = obj;
                registered_names.push( name )

            }

            return registered_names;

        }

        name = normalizeString( fmt.name )

        Pheasant.formats[ name ] = obj;

        return name;

    };

    /**
     * Create a range of colors. Takes an object, with the following 
     * properties:
     * - from [String]: what color is the range starting from. It must
     *   be a valid color in a supported format. You can also provide a
     *   Pheasant.Color object.
     * - to [String]: what color is the range stopping at. See the `from`
     *   attribute.
     * - length [Number]: Optional (default to 100). The length of the range,
     *   i.e. the number of colors in it, including the starting and the
     *   stopping ones.
     * - type [String]: Optional (default to 'string'). The type of each
     *   value of the range. It must be one of the following:
     *   - 'string': each value is a string describing the color. If both
     *   `from` and `to` are strings of the same format, it'll be used,
     *   unless the `format` attribute is specified. If they're not in the
     *   same format or one of them is a Pheasant.Color object, the default
     *   format will be used, unless the `format` attribute is specified.
     *   - 'object': each value is a Pheasant.Color object.
     *   - 'rgb': each value is an array of red, green and blue channels'
     *     values.
     *   - 'rgba': same as 'rgb', but with alpha channel.
     * - format [String]: Optional. If specified, it must be a valid format
     *   name, which will be used for each color if the `type` attribute is
     *   not specified or set to 'string'.
     * This function returns an array, which may be empty if one of the
     * mandatory attributes is missing or a formatted string cannot be parsed,
     * or the `length` attribute is less than 1.
     **/
    Pheasant.range = function colorRange( opts ) {

        var colorFrom, colorTo, len, type, format, diff,
            _type, i, l, f1, f2;

        if ( !opts || !opts.from || !opts.to || opts.length <= 0 ) {

            return [];

        }

        // defaults
        format = defaultStringFormat;

        // length
        len = typeof opts.length === 'number' ? opts.length : 100;

        // from
        if ( typeof opts.from === 'string' ) {

            colorFrom = Pheasant.parse( opts.from );
            if ( !colorFrom ) { return []; }
            f1 = Pheasant.guessFormat( opts.from );

        } else if ( opts.from.getRGBA ) {

            colorFrom = opts.from;

        } else { return []; }

        // to
        if ( typeof opts.to === 'string' ) {

            colorTo = Pheasant.parse( opts.to );
            if ( !colorTo ) { return []; }
            f2 = Pheasant.guessFormat( opts.to );

        } else if ( opts.to.getRGBA ) {

            colorTo = opts.to;

        } else { return []; }

        // type
        if ( typeof opts.type === 'undefined' ) { type = 'string'; }
        else {

            _type = normalizeString( opts.type );

            for (i = 0, l = rangeTypes.length; i < l; i++) {

                if ( _type === rangeTypes[ i ] ) {

                    type = _type;
                    break;

                }

            }

            if ( !type ) { return []; }

            // GC
            _type = undefined;

        }

        // format
        if ( opts.format ) {

            format = normalizeString( opts.format );

            if (!( format in Pheasant.formats )) { return []; }

        } else if ( f1 && f1 === f2 ) {

            format = f1;

        } else { format = defaultStringFormat; }

        diff = cmpColors( colorFrom, colorTo );

        var rangeVal;

        switch( type ) {

            case 'rgb': rangeVal = function( c ) {
                return c.getRGB(); }; break;
            
            case 'rgba': rangeVal = function( c ) {
                return c.getRGBA(); }; break;
            
            case 'object': rangeVal = function( c ) {
                return c; }; break;
            
            case 'string': rangeVal = function( c ) {
                return c.toString( format ); }; break;

        }

        var rgbaFrom  = colorFrom.getRGBA(),
            rgba      = rgbaFrom,
            rgbaTo    = colorTo.getRGBA(),

            rgbaSteps = diff.map(function( n ) { return n / len; }),
            
            range = [], i,

            // used as the for's step
            step = function() {

                for ( var i = 0; i < 4; i++ ) {

                    rgba[ i ] += rgbaSteps[ i ];

                }

            };


        for( i = 0; i < len; step(), i++) {

            range.push( rangeVal( Pheasant.Color.apply( null, rgba ) ) );

        }

        return range;

    };

    // export
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
        var names = {
            aliceblue            : [ 240 , 248 , 255 , 1 ],
            antiquewhite         : [ 250 , 235 , 215 , 1 ],
            aqua                 : [ 0   , 255 , 255 , 1 ],
            aquamarine           : [ 127 , 255 , 212 , 1 ],
            azure                : [ 240 , 255 , 255 , 1 ],
            beige                : [ 245 , 245 , 220 , 1 ],
            bisque               : [ 255 , 228 , 196 , 1 ],
            black                : [ 0   , 0   , 0   , 1 ],
            blanchedalmond       : [ 255 , 235 , 205 , 1 ],
            blue                 : [ 0   , 0   , 255 , 1 ],
            blueviolet           : [ 138 , 43  , 226 , 1 ],
            brown                : [ 165 , 42  , 42  , 1 ],
            burlywood            : [ 222 , 184 , 135 , 1 ],
            cadetblue            : [ 95  , 158 , 160 , 1 ],
            chartreuse           : [ 127 , 255 , 0   , 1 ],
            chocolate            : [ 210 , 105 , 30  , 1 ],
            coral                : [ 255 , 127 , 80  , 1 ],
            cornflowerblue       : [ 100 , 149 , 237 , 1 ],
            cornsilk             : [ 255 , 248 , 220 , 1 ],
            crimson              : [ 220 , 20  , 60  , 1 ],
            cyan                 : [ 0   , 255 , 255 , 1 ],
            darkblue             : [ 0   , 0   , 139 , 1 ],
            darkcyan             : [ 0   , 139 , 139 , 1 ],
            darkgoldenrod        : [ 184 , 134 , 11  , 1 ],
            darkgray             : [ 169 , 169 , 169 , 1 ],
            darkgreen            : [ 0   , 100 , 0   , 1 ],
            darkgrey             : [ 169 , 169 , 169 , 1 ],
            darkkhaki            : [ 189 , 183 , 107 , 1 ],
            darkmagenta          : [ 139 , 0   , 139 , 1 ],
            darkolivegreen       : [ 85  , 107 , 47  , 1 ],
            darkorange           : [ 255 , 140 , 0   , 1 ],
            darkorchid           : [ 153 , 50  , 204 , 1 ],
            darkred              : [ 139 , 0   , 0   , 1 ],
            darksalmon           : [ 233 , 150 , 122 , 1 ],
            darkseagreen         : [ 143 , 188 , 143 , 1 ],
            darkslateblue        : [ 72  , 61  , 139 , 1 ],
            darkslategray        : [ 47  , 79  , 79  , 1 ],
            darkslategrey        : [ 47  , 79  , 79  , 1 ],
            darkturquoise        : [ 0   , 206 , 209 , 1 ],
            darkviolet           : [ 148 , 0   , 211 , 1 ],
            deeppink             : [ 255 , 20  , 147 , 1 ],
            deepskyblue          : [ 0   , 191 , 255 , 1 ],
            dimgray              : [ 105 , 105 , 105 , 1 ],
            dimgrey              : [ 105 , 105 , 105 , 1 ],
            dodgerblue           : [ 30  , 144 , 255 , 1 ],
            firebrick            : [ 178 , 34  , 34  , 1 ],
            floralwhite          : [ 255 , 250 , 240 , 1 ],
            forestgreen          : [ 34  , 139 , 34  , 1 ],
            fuchsia              : [ 255 , 0   , 255 , 1 ],
            gainsboro            : [ 220 , 220 , 220 , 1 ],
            ghostwhite           : [ 248 , 248 , 255 , 1 ],
            gold                 : [ 255 , 215 , 0   , 1 ],
            goldenrod            : [ 218 , 165 , 32  , 1 ],
            gray                 : [ 128 , 128 , 128 , 1 ],
            green                : [ 0   , 128 , 0   , 1 ],
            greenyellow          : [ 173 , 255 , 47  , 1 ],
            grey                 : [ 128 , 128 , 128 , 1 ],
            honeydew             : [ 240 , 255 , 240 , 1 ],
            hotpink              : [ 255 , 105 , 180 , 1 ],
            indianred            : [ 205 , 92  , 92  , 1 ],
            indigo               : [ 75  , 0   , 130 , 1 ],
            ivory                : [ 255 , 255 , 240 , 1 ],
            khaki                : [ 240 , 230 , 140 , 1 ],
            lavender             : [ 230 , 230 , 250 , 1 ],
            lavenderblush        : [ 255 , 240 , 245 , 1 ],
            lawngreen            : [ 124 , 252 , 0   , 1 ],
            lemonchiffon         : [ 255 , 250 , 205 , 1 ],
            lightblue            : [ 173 , 216 , 230 , 1 ],
            lightcoral           : [ 240 , 128 , 128 , 1 ],
            lightcyan            : [ 224 , 255 , 255 , 1 ],
            lightgoldenrodyellow : [ 250 , 250 , 210 , 1 ],
            lightgray            : [ 211 , 211 , 211 , 1 ],
            lightgreen           : [ 144 , 238 , 144 , 1 ],
            lightgrey            : [ 211 , 211 , 211 , 1 ],
            lightpink            : [ 255 , 182 , 193 , 1 ],
            lightsalmon          : [ 255 , 160 , 122 , 1 ],
            lightseagreen        : [ 32  , 178 , 170 , 1 ],
            lightskyblue         : [ 135 , 206 , 250 , 1 ],
            lightslategray       : [ 119 , 136 , 153 , 1 ],
            lightslategrey       : [ 119 , 136 , 153 , 1 ],
            lightsteelblue       : [ 176 , 196 , 222 , 1 ],
            lightyellow          : [ 255 , 255 , 224 , 1 ],
            lime                 : [ 0   , 255 , 0   , 1 ],
            limegreen            : [ 50  , 205 , 50  , 1 ],
            linen                : [ 250 , 240 , 230 , 1 ],
            magenta              : [ 255 , 0   , 255 , 1 ],
            maroon               : [ 128 , 0   , 0   , 1 ],
            mediumaquamarine     : [ 102 , 205 , 170 , 1 ],
            mediumblue           : [ 0   , 0   , 205 , 1 ],
            mediumorchid         : [ 186 , 85  , 211 , 1 ],
            mediumpurple         : [ 147 , 112 , 219 , 1 ],
            mediumseagreen       : [ 60  , 179 , 113 , 1 ],
            mediumslateblue      : [ 123 , 104 , 238 , 1 ],
            mediumspringgreen    : [ 0   , 250 , 154 , 1 ],
            mediumturquoise      : [ 72  , 209 , 204 , 1 ],
            mediumvioletred      : [ 199 , 21  , 133 , 1 ],
            midnightblue         : [ 25  , 25  , 112 , 1 ],
            mintcream            : [ 245 , 255 , 250 , 1 ],
            mistyrose            : [ 255 , 228 , 225 , 1 ],
            moccasin             : [ 255 , 228 , 181 , 1 ],
            navajowhite          : [ 255 , 222 , 173 , 1 ],
            navy                 : [ 0   , 0   , 128 , 1 ],
            oldlace              : [ 253 , 245 , 230 , 1 ],
            olive                : [ 128 , 128 , 0   , 1 ],
            olivedrab            : [ 107 , 142 , 35  , 1 ],
            orange               : [ 255 , 165 , 0   , 1 ],
            orangered            : [ 255 , 69  , 0   , 1 ],
            orchid               : [ 218 , 112 , 214 , 1 ],
            palegoldenrod        : [ 238 , 232 , 170 , 1 ],
            palegreen            : [ 152 , 251 , 152 , 1 ],
            paleturquoise        : [ 175 , 238 , 238 , 1 ],
            palevioletred        : [ 219 , 112 , 147 , 1 ],
            papayawhip           : [ 255 , 239 , 213 , 1 ],
            peachpuff            : [ 255 , 218 , 185 , 1 ],
            peru                 : [ 205 , 133 , 63  , 1 ],
            pink                 : [ 255 , 192 , 203 , 1 ],
            plum                 : [ 221 , 160 , 221 , 1 ],
            powderblue           : [ 176 , 224 , 230 , 1 ],
            purple               : [ 128 , 0   , 128 , 1 ],
            red                  : [ 255 , 0   , 0   , 1 ],
            rosybrown            : [ 188 , 143 , 143 , 1 ],
            royalblue            : [ 65  , 105 , 225 , 1 ],
            saddlebrown          : [ 139 , 69  , 19  , 1 ],
            salmon               : [ 250 , 128 , 114 , 1 ],
            sandybrown           : [ 244 , 164 , 96  , 1 ],
            seagreen             : [ 46  , 139 , 87  , 1 ],
            seashell             : [ 255 , 245 , 238 , 1 ],
            sienna               : [ 160 , 82  , 45  , 1 ],
            silver               : [ 192 , 192 , 192 , 1 ],
            skyblue              : [ 135 , 206 , 235 , 1 ],
            slateblue            : [ 106 , 90  , 205 , 1 ],
            slategray            : [ 112 , 128 , 144 , 1 ],
            slategrey            : [ 112 , 128 , 144 , 1 ],
            snow                 : [ 255 , 250 , 250 , 1 ],
            springgreen          : [ 0   , 255 , 127 , 1 ],
            steelblue            : [ 70  , 130 , 180 , 1 ],
            tan                  : [ 210 , 180 , 140 , 1 ],
            teal                 : [ 0   , 128 , 128 , 1 ],
            thistle              : [ 216 , 191 , 216 , 1 ],
            tomato               : [ 255 , 99  , 71  , 1 ],
            turquoise            : [ 64  , 224 , 208 , 1 ],
            violet               : [ 238 , 130 , 238 , 1 ],
            wheat                : [ 245 , 222 , 179 , 1 ],
            white                : [ 255 , 255 , 255 , 1 ],
            whitesmoke           : [ 245 , 245 , 245 , 1 ],
            yellow               : [ 255 , 255 , 0   , 1 ],
            yellowgreen          : [ 154 , 205 , 50  , 1 ],

            // bonus
            transparent          : [ 0   , 0   , 0   , 0 ]
        };
        
        return {
            name: [ 'colorName', 'colourName' ],
            test: function( s ) {

                return names.hasOwnProperty( s );

            },
            parse: function( s ) {

                return names.hasOwnProperty(s) ? names[ s ] : null;

            },
            stringify: function( c ) {

                if ( !c || !c.getRGBA ) { return null; }

                var myVals = c.getRGBA().map(round).join( ',' ), name;

                for ( name in names ) {
                    if (!names.hasOwnProperty( name ) ) { continue; }

                    if ( myVals === names[ name ].join( ',' ) ) {
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

    /**
     * RGB, e.g. rgb(42, 255, 2)
     **/
    Pheasant.addFormat((function() {

        var re_rgb_int = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;

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

        var re_rgb_perc = /^rgb\(\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/;

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

        var re_rgba_int = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(1|0(?:\.\d+)?)\s*\)$/;

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

        var re_rgba_perc = /^rgba\(\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(1|0(?:\.\d+)?)\s*\)$/;

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

    /**
     * HSL, e.g. hsl(330, 42%, 12%)
     **/
    Pheasant.addFormat((function() {

        var re_hsl = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/;

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

        var re_hsla = /^hsla\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(1|0(?:\.\d+))?\s*\)$/;

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

})( typeof module === 'object' ? module.exports : this );
