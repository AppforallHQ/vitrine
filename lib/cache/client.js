var Clazz = require("../abstract-module");

var Cache = new Class({
    Extends : Clazz,
    instances : [],
    client:null,
    isReady:false,
    initialize:function()
    {
    	var redis = require("redis");
    	this.client = redis.createClient();

        this.client.on("error", function (err)
        {
            this.isReady = false;
            this.emit( Cache.EVENT_ERROR  , ['redis connection' ,err]);
        }.bind(this));

        this.client.on("connect", function ()
        {
            this.isReady = true;
            this.emit( Cache.EVENT_READY );
        }.bind(this));

        this.parent()
    },
    collection:function(name, type)
    {
        if(type == null)
            type = Cache.DEFAULT;

        Object.each( this.instances, function(e)
        {
            if(e.name == name && e.type == type)
                return e;
        })

        // getting new instance by its type
        var clazz = require( './types/'+ type );
        var instance = new clazz(name, this.client, type);
        // caching current collections
        this.instances.push( instance );

        return instance;
    },
    close:function()
    {
        this.isReady = false;
        if(this.client != null)
            this.client.quit();

        this.instances = null;
		this.client = null;

        this.parent()
    }
});


Cache.DEFAULT = 'default';
Cache.HASH = 'hash';
Cache.Z_LIST = 'zlist';
Cache.LIST = 'list';

Cache.EVENT_READY = 'ready';
Cache.EVENT_ERROR = 'error';
Cache.EVENT_INIT = 'init';
Cache.EVENT_CLOSE = 'close';


module.exports = Cache;
