require("mootools");
var event = require('events').EventEmitter;

var Abstract =  new Class({
    Implements: [event],
    initialize:function(name)
    {
        this.emit( Abstract.EVENT_INIT );
    },
    publish:function(value)
    {
        this.emit( Abstract.EVENT_PUBLISH );
    }
});

Abstract.EVENT_READY = 'ready';
Abstract.EVENT_ERROR = 'error';
Abstract.EVENT_INIT = 'init';
Abstract.EVENT_CLOSE = 'close';
Abstract.EVENT_PUBLISH = 'close';

module.exports = Abstract;