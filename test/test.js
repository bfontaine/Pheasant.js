var Pheasant = require( __dirname + '/../src/pheasant' ).Pheasant,
    chai     = require( 'chai' ),
    
    expect   = chai.expect,
    assert   = chai.assert;

describe( 'Settings', function() {

    it( 'should change the default formatting after a call to .setDefaultStringFormat', function() {

        expect( Pheasant.parse( '#000' ).toString( 'hex3' ) ).to.equal( '#000' );
        Pheasant.setDefaultStringFormat( 'hex6' );
        expect( Pheasant.parse( '#000' ).toString() ).to.equal( '#000000' );
        expect( Pheasant.parse( '#000' ).toString( 'hex3' ) ).to.equal( '#000' );

    });

});

describe( 'Colors parsing', function() {

    beforeEach(function() {

        Pheasant.setDefaultStringFormat( 'hex3' );

    });

    it( 'should handle CSS/SVG color names', function() {

        expect( Pheasant.parse( 'black'   ).toString() ).to.equal( '#000' );
        expect( Pheasant.parse( 'lime'    ).toString() ).to.equal( '#0f0' );
        expect( Pheasant.parse( 'red'     ).toString() ).to.equal( '#f00' );
        expect( Pheasant.parse( 'blue'    ).toString() ).to.equal( '#00f' );
        expect( Pheasant.parse( 'white'   ).toString() ).to.equal( '#fff' );
        expect( Pheasant.parse( 'fuchsia' ).toString() ).to.equal( '#f0f' );

    });

    it( 'should handle short hex values (#XYZ)', function() {

        expect( Pheasant.parse( '#000' ).toString() ).to.equal( '#000' );
        expect( Pheasant.parse( '#f00' ).toString() ).to.equal( '#f00' );
        expect( Pheasant.parse( '#00f' ).toString() ).to.equal( '#00f' );
        expect( Pheasant.parse( '#fff' ).toString() ).to.equal( '#fff' );
        expect( Pheasant.parse( '#f0f' ).toString() ).to.equal( '#f0f' );

    });

    it( 'should handle hex values (#ABCDEF)', function() {

        expect( Pheasant.parse( '#000000' ).toString() ).to.equal( '#000' );
        expect( Pheasant.parse( '#0000ff' ).toString() ).to.equal( '#00f' );
        expect( Pheasant.parse( '#ffffff' ).toString() ).to.equal( '#fff' );
        expect( Pheasant.parse( '#ff00ff' ).toString() ).to.equal( '#f0f' );

    });

    it( 'should round short hex values (#XYZ) if necessary', function() {

        expect( Pheasant.parse( '#000000' ).toString() ).to.equal( '#000' );
        expect( Pheasant.parse( '#100000' ).toString() ).to.equal( '#100' );
        expect( Pheasant.parse( '#1e0000' ).toString() ).to.equal( '#200' );
        expect( Pheasant.parse( '#ff0000' ).toString() ).to.equal( '#f00' );

    });

});
