var Clazz = require("../abstract-module");
var fs = require('fs');
var config = require('../log-configs');

var Log =  new Class({
    Extends : Clazz,
    cache : null,
    collection : null,
    name : null,
    initialize:function(name)
    {
    	this.name = name;

    //  var cache_class = require('../cache').client;
    //	this.cache = new cache_class()
   	//	this.collection = this.cache.collection('log', cache_class.LIST);

        this.parent()
    },
    global:function(msg, value)
    {
        msg = this.make(msg, value, 'global');
  		this.store(msg)
    },
    info:function(msg, value)
    {
    	msg = this.make(msg, value, 'info');
        this.store(msg, 'info');
    },
    error:function(msg, value)
    {
    	msg = this.make(msg, value, 'error');
    	this.store(msg, 'error');
    },
    warn:function(msg, value)
    {
        msg = this.make(msg, value, 'warn');
        this.store(msg, 'warn');
    },
    store:function(value, path)
    {
        try
        {
            fs.open( config.path + path , 'a', 666, function( e, id )
            {
              fs.write( id, value + '\r\n', null, 'utf8', function()
              {
                fs.close(id, function()
                {
                  //console.log('file closed');
                });
              });
            });

        }catch(e){}
//    	this.collection.lpush(value, this.onadd.bind(this))
    },
    onadd:function(err, res)
    {
    	//console.log(res)
    	// a log jus added
    },
    make:function(msg, value, type)
    {
        if(value == null)
            value = '';

    	var obj = {msg : msg, name : this.name, time : new Date().getUTCTime(), type : type, value : value }
    	return JSON.stringify( obj )
    },
    close:function()
    {
    	/*if(this.cache != null)
    	{
    		this.cache.close();
    		this.cache = null
    		this.collection = null;
    	}*/

        this.parent()
    }
});


module.exports = Log;
