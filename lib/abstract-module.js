require("mootools");
process.setMaxListeners(0);
var event = require('events').EventEmitter;
//process.env.TZ = 'UTC'
require('./custom-date');

var Clazz = new Class({
    Implements: [event,Options],
    initialize:function()
    {
        this.emit( Clazz.EVENT_INIT );
    },
    close:function()
    {
        this.emit( Clazz.EVENT_CLOSE );
    }
});


Clazz.EVENT_READY = 'ready';
Clazz.EVENT_ERROR = 'error';
Clazz.EVENT_INIT = 'init';
Clazz.EVENT_CLOSE = 'close';


module.exports = Clazz;
