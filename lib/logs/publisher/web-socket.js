var Clazz = require("./abstract");

var Abstract =  new Class({
    Extends : Clazz,
    io : null,
    port : 5647,
    initialize:function()
    {
        this.io = require('socket.io').listen( this.port );
        this.parent()
    },
    publish:function(value)
    {
        this.io.sockets.emit('log', value)
        this.parent(value)
    }
});

module.exports = Abstract;