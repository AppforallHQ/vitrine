var Clazz = require("./lib/abstract-module");
var configs = require('./lib/website-configs');

var Data = new Class({
    Extends : Clazz,
    cache:null,
    collection:null,

    started:null,
    request:1,
    initialize:function()
    {
        this.started = new Date();
        this.parent();
        var Cache = require("./lib/cache").client;
        this.cache = new Cache();
        this.cache.on( Cache.EVENT_READY , function()
        {
            this.collection = this.cache.collection('API');
        }.bind(this));
    },
    globalcallback:function(err, data)
    {
        if(err == null)
        {
          if(data == null)
            data = [];

          if(parseInt(this.cache) == 0)
                this.cache = 0;

            this.cache = this.cache*60; // sec to min

            var obj = JSON.stringify(data);

            this.collection.set(this.cahceKey, obj);
            this.collection.expire(this.cahceKey, this.cache);

            this.callback(JSON.parse(obj));
      }else
      {
        console.log('Error in run query: ' + err);
        this.callback(null);
      }
    },
    get:function(model, method, input, cache, callback)
    {
        if(input == null)
            input = [];

        var cahceKey = '#' + model + '#' + method + '#' + JSON.stringify(input);

        input.push( this.globalcallback.bind( {cahceKey : cahceKey, cache : cache, callback : callback, collection : this.collection} ) );

        var Model = require('./lib/models/' + model );

        if(cache < 1){
            Model[method].apply(null, input);
        }else{
            this.collection.get(cahceKey, function(err, data)
            {
                if(err == null && data != null)
                {
                    var obj = [];

                    try
                    {
                        obj = JSON.parse(data);
                        callback(obj)
                    }catch(e)
                    {
                        console.log(e);
                    }

                }else
                {
                    Model[method].apply(this, input);
                }
            }.bind(this));
        }

        if(cache == -1)
            this.collection.expire(cahceKey, 0);
    },
    expireCache:function(key, time, cb)
    {
        this.collection.expire(key, time, cb);
    },
    getRedis:function(key, cb)
    {
      this.collection.get(key, cb);
    },
    setRedis:function(key, obj, cb)
    {
        this.collection.set(key, obj, cb);
    },
    close:function()
    {
        if(this.cache != null)
            this.cache.close();

        this.cache = null;
        this.collection = null;
    },
    queryParse:function(query)
    {
        var list = ['limit', 'sort', 'sorton', 'start', 'q'];
        var options = {}

        for(var i=0; i<list.length; i++)
        {
            var j = list[i]
            if( query[j] != null)
                options[j] = query[j];
        }

	if(options.q){
	    // Escape any non alphanumeric character in search query.
	    options.q = options.q.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	}

	
        if(options.limit != null)
        {
            options.limit = parseInt(options.limit)
            if(options.limit < 1) {
                options.limit = 1;
            } else if (options.limit > 30) {
                options.limit = 30;
            }
        } else {
            options.limit = 30;
        }


        if (options.start == null) {
            options.start = 0;
        } else {
            try {
                options.start = parseInt(options.start);
            } catch(e) {
                options.start = 0;
            }
            if (options.start < 0 || isNaN(options.start)) {
                options.start = 0;
            }
        }

        return options;
    }
});



module.exports = new Data();
