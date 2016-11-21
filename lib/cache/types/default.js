var abstraction = require("./abstract");

var Cache = new Class({
    Extends:abstraction,
    initialize:function(name, redis)
    {
    	name = 'd~'+name;
        this.parent(name, redis)
    },
    getAll:function(callback)
    {
        callback = this.getCallback(callback);
        this.redis.hgetall(this.name, callback);
    },
    getall:function(callback)
    {
        this.getAll(callback);
    },
    get:function(key, callback)
    {
        callback = this.getCallback(callback);
        this.redis.get(this.name + '#' + key, callback);
        this.parent(key, callback)
        return this;
    },
    set:function(key, value, callback)
    {
        callback = this.getCallback(callback);
        this.redis.set(this.name + '#' + key, value);
        this.parent(key, value);
        callback(); // some setter don't have callback!
        return this;
    },
    remove:function(key, callback)
    {
        callback = this.getCallback(callback);
        this.redis.del(this.name + '#' + key, callback);
        this.parent(key)
    },
    exists:function(key, callback)
    {
        callback = this.getCallback(callback);
        this.redis.exists(this.name + '#' + key, callback);
        return this;
    },
    expire:function(key, sec)
    {
        this.redis.EXPIRE(this.name + '#' + key, parseInt(sec))
        this.parent(key, sec)
        return this;
    }

});

module.exports = Cache;