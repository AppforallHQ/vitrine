var Clazz = require("./abstract");
var boxcar = require('boxcar');

var Abstract =  new Class({
    Extends : Clazz,
    provider : null,
    initialize:function()
    {
        this.provider = new boxcar.Provider('KEY', 'VAL');
        this.provider.on('response', function()
        {
        	// finished.
        });
        this.parent()
    },
    publish:function(value)
    {
    	this.provider.broadcast(  JSON.stringify(value) );
        this.parent(value)
    }
});

module.exports = Abstract;
