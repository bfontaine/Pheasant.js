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
        rangeTypes = {
            string : function( c, f ) { return c.toString( f ); },
            object : function( c ) { return c; },
            rgb    : function( c ) { return c.getRGB(); },
            rgba   : function( c ) { return c.getRGBA(); }
        },

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
     * Return a 'Color' object using the given string, or 'null' if it can't
     * be parsed.
     **/
    Pheasant.parse = function parse( s ) {

        var val, id, fmt, parser;

        if ( s && s.getRGBA ) { return s; }

        if ( '' + s !== s ) { return null; } // not a string

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
      * Guess the string's color format. Return a lowercase string, or 'null'
      * if the format is not valid/supported.
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
     *    it, or 'null' if it can't (e.g. wrong formatting). The object
     *    should have the following properties:
     *    - red [Number]: an integer between 0 and 255 (default: 0)
     *    - blue [Number]: an integer between 0 and 255 (default: 0)
     *    - green [Number]: an integer between 0 and 255 (default: 0)
     *    - alpha [Number]: a number between 0 and 1 (default: 1)
     *    The function can also return an array of 3 or 4 values, representing
     *    the red, blue, green (and optionally alpha) channels.
     *  - stringify [Function]: reverse of 'parse' ; a function which
     *    takes a Color object and return a formatted string. It may
     *    return 'null' if it's not possible to stringify the color,
     *    e.g. there's a NaN value somewhere.
     *  - normalize [Boolean]: optional, default to 'true'. If set to
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
                obj.test  = function( s ) {
                    
                    return t( normalizeString( s ) );
                
                };

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
     * - to [String]: what color is the range stopping at. See the 'from'
     *   attribute.
     * - length [Number]: Optional (default to 100). The length of the range,
     *   i.e. the number of colors in it, including the starting and the
     *   stopping ones.
     * - type [String]: Optional (default to 'string'). The type of each
     *   value of the range. It must be one of the following:
     *   - 'string': each value is a string describing the color. If both
     *   'from' and 'to' are strings of the same format, it'll be used,
     *   unless the 'format' attribute is specified. If they're not in the
     *   same format or one of them is a Pheasant.Color object, the default
     *   format will be used, unless the 'format' attribute is specified.
     *   - 'object': each value is a Pheasant.Color object.
     *   - 'rgb': each value is an array of red, green and blue channels'
     *     values.
     *   - 'rgba': same as 'rgb', but with alpha channel.
     * - format [String]: Optional. If specified, it must be a valid format
     *   name, which will be used for each color if the 'type' attribute is
     *   not specified or set to 'string'.
     * This function returns an array, which may be empty if one of the
     * mandatory attributes is missing or a formatted string cannot be parsed,
     * or the 'length' attribute is less than 1.
     **/
    Pheasant.range = function colorRange( opts ) {

        var colorFrom, colorTo, type, format, diff, len, f1, f2;

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

            type = normalizeString( opts.type );

            if (!( type in rangeTypes )) { return []; }

        }

        // format
        if ( opts.format ) {

            format = normalizeString( opts.format );

            if (!( format in Pheasant.formats )) { return []; }

        } else if ( f1 && f1 === f2 ) {

            format = f1;

        } else { format = defaultStringFormat; }

        diff = cmpColors( colorFrom, colorTo );

        var rangeVal = rangeTypes[ type ],

            rgbaFrom  = colorFrom.getRGBA(),
            rgba      = rgbaFrom,
            rgbaTo    = colorTo.getRGBA(),

            rgbaSteps = diff.map(function( n ) { return n / ( len - 1 ); }),
            
            range = [], i,

            // used as the for's step
            step = function() {

                for ( var i = 0; i < 4; i++ ) {

                    rgba[ i ] += rgbaSteps[ i ];

                }

            };

        for( i = 0; i < len; step(), i++) {

            range.push(
                rangeVal( Pheasant.Color.apply( null, rgba ), format )
            );

        }

        return range;

    };

    // export
    ctx.Pheasant = Pheasant;
