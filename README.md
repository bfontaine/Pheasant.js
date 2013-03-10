# Pheasant.js

[![Build Status](https://travis-ci.org/bfontaine/Pheasant.js.png)](https://travis-ci.org/bfontaine/Pheasant.js)

**Pheasant.js** makes colors manipulations easy.

## Install

```sh
npm install pheasant
```

## Usage

Pheasant expose one object, `Pheasant`. It has the following methods:

### .parse

This method return a `Pheasant.Color` object of the parsed string, or null if it
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

`Color` objects has four attributes, `.red`, `.green`, `.blue` and `.alpha`.
They also have two convenient methods: `.getRGB()` and `.getRGBA()`, which
return an array of `.red`, `.green` and `.blue` properties, plus the `.alpha`
one for `.getRGBA()`.

```js
Pheasant.parse( 'navy' ).blue; // 128
```

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

### .convert

This method takes two arguments, the first is the string to parse and the second
is the identifier of the format to convert to.

```js
Pheasant.parse( 'pink' ).toString( 'rgba' ); // 'rgba(255,192,203,1)'
Pheasant.convert( 'pink', 'rgba' ); // 'rgba(255,192,203,1)'
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
  used.

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
array:

```js
Pheasant.formats.length = 0;
```

## Tests

Clone this repo, and then run `make`. You need to install Mocha before:

```sh
[sudo] npm install -g mocha
git clone https://github.com/bfontaine/Pheasant.js.git
cd Pheasant
make
```

To test on client-side, type `make test-client`. It should display a file URL,
open it in your favorite browser (it’s the `test/client.html` file). We can’t
use PhantomJS, because it [doesn’t][phantomjs-no-bind] have the
`Function.prototype.bind` function.

## License

See the LICENSE file (MIT).

[phantomjs-no-bind]: https://code.google.com/p/phantomjs/issues/detail?id=522
