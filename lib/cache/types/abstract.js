require("mootools");
var event = require('events').EventEmitter;

var AbstractType = new Class({
    Implements: [event],
    name : null, 
    redis : null,
    type : null,
    initialize:function(name, redis, type)
    {
        this.name = name;
        this.redis = redis;
        this.type = type;
        this.emit("init");
    },
    updated:function(key, action)
    {
//        console.log('updated:', this.name, key, action);
    },
    get:function(key, callback)
    {
    },
    set:function(key, value, callback)
    {
        this.updated(key, 'set');
    },
    remove:function(key, callback)
    {
        this.updated(key, 'remove');
    },
    expire:function(key, sec)
    {
    },
    getCallback:function(cb)
    {
        if(cb == null || cb +'' == 'undefined')
            cb = function(){};
        
        return cb;
    }
});


module.exports = AbstractType;