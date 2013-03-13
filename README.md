# Pheasant.js

[![Build Status](https://travis-ci.org/bfontaine/Pheasant.js.png)](https://travis-ci.org/bfontaine/Pheasant.js)

**Pheasant.js** makes colors manipulations easy.

## Install

### Server-side (Node)

```sh
npm install pheasant
```

Then use:

```js
var Pheasant = require( 'pheasant' ).Pheasant;
```

### Client-side

Include the `build/pheasant.min.js` file in your page. There’s no dependency,
only 15ko of pure JavaScript (4.3ko gzip’d).


## Usage

Pheasant expose one object, `Pheasant`. It has the following methods:

### .parse

This function return a `Pheasant.Color` object of the parsed string, or null if it
can’t be parsed (see the support table below for the supported formats).

```js
Pheasant.parse( 'red' ); // red
Pheasant.parse( '#0F0' ); // green
Pheasant.parse( '#0000FF' ); // blue
Pheasant.parse( 'rgb(128, 128, 128)' ); // gray
Pheasant.parse( 'rgb(10%, 10%, 10%, 0.3)' ); // transparent gray
Pheasant.parse( 'rgba(255, 192, 203, 0.5)' ); // transparent pink
Pheasant.parse( 'hsl(240, 100%, 50%)' ); // blue
Pheasant.parse( 'hsla(120, 100%, 25%, 1)' ); // green
```

### .convert

This function takes two arguments, the first is the string to parse and the second
is the identifier of the format to convert to.

```js
Pheasant.parse( 'pink' ).toString( 'rgba' ); // 'rgba(255,192,203,1)'
Pheasant.convert( 'pink', 'rgba' ); // 'rgba(255,192,203,1)'
```

### .guessFormat

This function takes one argument, a string, and return the first identifier
of its format, if it’s a supported one. It returns `null` if it can’t guess
the format.

```js
Pheasant.guessFormat( '#ccc' ); // 'hex3'
Pheasant.guessFormat( '#cccbbb' ); // 'hex6'
Pheasant.guessFormat( '#cccb' ); // null
```


### .range

This function takes an object as its argument, and return a range of colors. The
object must have the following properties:

- `from`: The color to start the range with. It can be a valid color string, or a
  `Pheasant.Color` object.
- `to`: The color to end the range with. As `from`, it can be a valid color
  string, or a `Pheasant.Color` object.

Additionally, the object can have the following optional properties:

- `length`: the length of the range (default to 100).
- `type`: the type of the range values. It must be one of the following:
    - `'string'` (default): Each value is a string describing the color. If you
      provide a `format` attribute, it’ll be used. If it’s not provided and if the
      two colors (`from` and `to`) both are strings of the same format, this is
      the one which will be used. If none of theses conditions are met, the
      default format will be used.
    - `'object'`: Each value is a `Pheasant.Color` object.
    - `'rgb'`: Each value is an array of three numbers, the red, green and blue
      channels.
    - `'rgba'`: Same as `'rgb'`, but with the alpha channel.
- `format`: this attribute is used only if the `type` is not provided or is set
  to `'string'`. It defines the format used for the colors strings.

This function return an empty array if `from` and/or `to` are missing, and/or if the
length is lesser or equal to zero, and/or if the `type` attribute is not valid, and/or
the `format` attribute is not valid, and/or `from` (or `to`) is a string which
cannot be parsed. Some values in the range may be null if you choose the
`colorName` format, since some values don’t have a name (e.g. `rgba(1, 1, 1)`).

```js
// [ '#fff', '#fff', '#fff' ]
Pheasant.range({ from: '#fff', to: '#fff', length: 3 });

// ["#abc", "#89a", "#568", "#345", "#123"]
Pheasant.range({ from: '#ABC', to: '#123', length: 5 });

// ["#40bf40", "#3ca13c", "#378337", "#336633", "#2e482e", "#2a2a2a"]
Pheasant.range({
    from: 'hsl(120, 50%, 50%)',
    to: 'rgb(42, 42, 42)',
    length: 6,
    format: 'hex6'
});
```


## Color objects

You can create a `Color` object using the following constructor:

```js
var color = new Pheasant.Color( red, green, blue, alpha );
```
`alpha` is optional (default to 1), and `red`, `green` and `blue` should be
integers between 0 and 255.

`Color` objects has four attributes, `.red`, `.green`, `.blue` and `.alpha`.
They also have two convenient methods: `.getRGB()` and `.getRGBA()`, which
return an array of `.red`, `.green` and `.blue` properties, plus the `.alpha`
one for `.getRGBA()`.

```js
Pheasant.parse( 'navy' ).blue; // 128
```

### .toString

You can use the `.toString()` method to convert colors to the format you want.
Without argument, it convert the color to the default format (`#ABCDEF`). You
can specify the format you want as a string. See the format identifiers below.

```js
Pheasant.parse( 'red' ).toString(); // '#f00'
Pheasant.parse( '#00F' ).toString( 'colorName' ); // 'blue'
var c = Pheasant.parse( 'rgb(245, 245, 220)' );
c.toString( 'colorName' ); // 'beige'
c.toString( 'hsl' ); // 'hsl(60,56%,91%)'
```

Since it may be painful to write `Pheasant.parse( 'foo' ).toString( 'bar' )` for
a one-time conversion, Pheasant has a method for that: `.convert`.

### .negative

This method returns a new object representing the negative of the current color.
It preserves the alpha channel.

```
var c1 = new Pheasant.color( 42, 42, 42 ),
    c2 = c1.negative();

c2.getRGB(); // [ 213, 213, 213 ]

Pheasant.parse( 'white' ).negative().toString( 'colorName' ); // 'black'
```

### .isDarkerThan

This method test if the color is darker than another color. You can pass it a
`Color` object or a string.

```js
Pheasant.parse( '#fff' ).isDarkerThan( '#eee' ); // false
Pheasant.parse( 'red' ).isDarkerThan( '#FAFAFA' ); // true
```

### .isLighterThan

This method test if the color is lighter than another color. You can pass it a
`Color` object or a string.

```js
Pheasant.parse( '#fff' ).isLighterThan( '#eee' ); // true
Pheasant.parse( 'red' ).isLighterThan( '#FAFAFA' ); // false
```

### .eq

This method test the equality between this color and another. You can pass it a
`Color` object or a string.

```js
Pheasant.parse( '#000' ).eq( 'rgba( 0, 0, 0)' ); // true
```

## Color Formats

### Built-in Support

All standard CSS/SVG colors formats are supported.

| Format      | Parsing | Stringifying | Identifiers               |
|-------------|:-------:|:------------:|---------------------------|
| #ABC        | ✔       | ✔            | `hex3`, `hexa3`           |
| #ABCDEF     | ✔       | ✔            | `hex6`, `hexa4`           |
| color names | ✔       | ✔            | `colorName`, `colourName` |
| hsl()       | ✔       | ✔            | `hsl`                     |
| hsla()      | ✔       | ✔            | `hsla`                    |
| rgb()\*     | ✔       | ✔            | `rgb`                     |
| rgba()\*    | ✔       | ✔            | `rgba`                    |


Format identifiers are case-insensitive.

(\*): The `rgb()` and `rgba()` formats also support percentages values, like
`rgb(20%, 10%, 45%)` and `rgba(35%, 0%, 100%, 0.2)`. If you want to force
percentages in the output, append `%` to each identifier: `rgb%` and `rgba%`.

### Setting the default output format

The default ouput format (for `toString`) is `hex6`. You can change it with
`Pheasant.setDefaultStringFormat()`:

```js
Pheasant.parse( 'lightgreen' ).toString(); // '#90ee90'
Pheasant.setDefaultStringFormat( 'rgb' );
Pheasant.parse( 'lightgreen' ).toString(); // 'rgb(144,238,144)'
```

### Adding a format

You can add a new format with `Pheasant.addFormat()`. This method takes one
argument, an object with the following properties:

- `name`: the identifier(s) of the format. Must be a string (one identifier) or
  an array of strings (multiple identifiers).
- `parse`: a function which convert a string in your format to a color
  object. It must return an object with the following, optional, properties:
  - `red`: the red channel (integer between 0 and 255)
  - `blue`: the blue channel (integer between 0 and 255)
  - `green`: the green channel (integer between 0 and 255)
  - `alpha`: the alpha channel (float between 0 and 1)
  If it can’t parse the string, it must return `null`. If the returned value is
  not null, it’ll be wrapped in a `Pheasant.Color` object.
- `stringify`: a function wich convert a `Pheasant.Color` object to a string of
  your format. It must return null if it can’t stringify the color (e.g.:
  there’s `NaN` values in it).
- `normalize`: Optional. If set to `false`, the parsed string won’t be
  normalized before being passed to your `.parse` function (the normalizing
  process force the string to lowercase and remove trailing spaces).
- `test`: Optional. If it’s a function, it’ll be used to test whether a string
  is valid in this format or not. If it’s a regex, its `.test` method will be
  used. This attribute is used by the `.guessFormat` function.

The object must provide the `parse` and/or `stringify` attributes, and must
provide the `name` attribute.

When a string is passed to `Pheasant.parse`, it tries to parse it with every
available format. If no format can parse it (i.e. they all return `null`), it
returns `null`.

The `Pheasant.addFormat()` method return either:
- `null` if your format has only one name and it’s already taken
- the name of your format if it’s available
- an array of strings if your format has multiple names. Only the available
  names are returned

This means that if you try to register a new format with the identifier `hex3`
(already taken), it won’t be registered and the call will return `null`. If you
try with `HEX3`, that’s the same since format identifiers are case-insensitive.
If your format has two names, `hex3` and `hex_3`, it will only be bound to
`hex_3`, since `hex3` is not available.

If you want to clear all the available formats, use the `Pheasant.formats`
object:

```js
Pheasant.formats = {};
```

### Example

Say you want to add a custom color format, which represent colors like that:
`custom:<blue>/<red>/<green>`. It doesn’t support the alpha channel, and
blue/red/green values are integer between 0 and 255. Here is how you can add
this format:

```js
Pheasant.addFormat((function() {

    // this regex match your format
    var custom_re = /custom:(\d{1,3})\/(\d{1,3})\/(\d{1,3})/;

    return {

        name: 'custom', // the name
        test: custom_re, // this is used to test if a string is valid in your format
        parse: function( s ) {
            // parse the string

            custom_re.lastIndex = 0;

            var brg = custom_re.exec( s );

            return { blue: +brg[1], red: +brg[2], green: +brg[3] };

        },

        stringify: function( c ) {
            // stringify a Color object

            return 'custom:' + c.blue + '/' + c.red + '/' + c.green;

        }

    };

})());
```

You can now try your format:

```js
Pheasant.guessFormat( 'custom:42/18/255' ); // 'custom'
Pheasant.parse( 'custom:1/2/3' ).getRGB(); // [ 2, 3, 1 ]
Pheasant.convert( '#ABC', 'custom' ); // "custom:204/170/187"
```

## Tests

Clone this repo, and then run `make test-all`:

```sh
git clone https://github.com/bfontaine/Pheasant.js.git
cd Pheasant
make
```

You have to install the dependencies if they’re not already installed:

```sh
npm -g install mocha chai uglify-js mocha-phantomjs
# install Node-JSCoverage
git clone https://github.com/visionmedia/node-jscoverage.git
cd node-jscoverage
./configure && make && make install
```

You also need [PhantomJS][phantomjs].

[phantomljs]: http://phantomjs.org/download.html

## License

See the LICENSE file (MIT).

## Changes

### v0.2.0 (12/03/2013)

- `Pheasant#range`
- `Color#isLighterThan`, `Color#isDarkerThan`, `Color#eq`
- Minified version added
- Better doc

### v0.1.1 (10/03/2013)

- `Color#negative` (#3)
- `test` optional attribute support added on `.addFormat` argument
- `Pheasant.guessFormat` added

### v0.1.0 (09/03/2013)

First version.
