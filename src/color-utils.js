
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
     * Test if the color is darker than an other one. Return a boolean.
     **/
    Pheasant.Color.prototype.isDarkerThan = function( other ) {

        var diff, sum;

        if ( '' + other === other ) {

            other = Pheasant.parse( other );

        }

        if ( !other || !other.getRGBA ) { return false; }

        diff = cmpColors( this, other );
        sum  = diff[ 0 ] + diff[ 1 ] + diff[ 2 ];

        return sum > 0;

    };

    /**
     * Test if the color is the same as an other one. Return a boolean.
     **/
    Pheasant.Color.prototype.eq = function( other ) {

        var rgba1, rgba2, i;

        other = Pheasant.parse( other );

        if ( !other || !other.getRGBA ) { return false; }

        rgba1 = this.getRGBA();
        rgba2 = other.getRGBA();

        for ( i = 0; i < 4; i++ ) {

            if ( rgba1[ i ] !== rgba2[ i ] ) { return false; }

        }

        return true;

    };

    /**
     * Test if the color is lighter than an other one. Return a boolean.
     **/
    Pheasant.Color.prototype.isLighterThan = function( other ) {

        var diff, sum;

        other = Pheasant.parse( other );

        if ( !other || !other.getRGBA ) { return false; }

        diff = cmpColors( this, other );
        sum  = diff[ 0 ] + diff[ 1 ] + diff[ 2 ];

        return sum < 0;

    };
