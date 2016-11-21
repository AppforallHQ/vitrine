var Clazz = require("./abstract");


var Abstract =  new Class({
    Extends : Clazz,
    initialize:function()
    {
        this.parent()
    },
    publish:function(value)
    {
    	//console.log(value);
        this.parent(value)
    }
});


module.exports = Abstract;