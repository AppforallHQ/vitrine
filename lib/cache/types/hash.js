var abstraction = require("./abstract");

var Cache = new Class({
    Extends:abstraction,
    initialize:function(name, redis)
    {
    	name = 'h~'+name;
        this.parent(name, redis)
    },
    get:function(key, object_name, callback)
    {
        callback = this.getCallback(callback);
        this.redis.hget(this.name + '#' + key, object_name, callback);
        this.parent(key+':'+object_name, callback)
        return this;
    },
    gets:function(key, object_names, callback)
    {
        callback = this.getCallback(callback);
        this.redis.hmget(this.name + '#' + key, object_names, callback);
        return this;
    },
    keys:function(key, callback)
    {
        callback = this.getCallback(callback);
        this.redis.hkeys(this.name + '#' + key , callback);
        return this;
    },
    set:function(key, value, callback)
    {
        callback = this.getCallback(callback);
        this.redis.hmset(this.name + '#' + key, value, callback);
        this.parent(key, value);
        return this;
    },
    remove:function(key, object_name, callback)
    {
        callback = this.getCallback(callback);
        this.redis.hdel(this.name + '#' + key, object_name, callback);
        this.parent(key)
    },
    exists:function(key, object_name, callback)
    {
        this.redis.hexists(this.name + '#' + key, object_name, callback)
        this.parent(key+':'+object_name, callback);
        return this;
    },
    expire:function(key, sec)
    {
        this.redis.expire(this.name + '#' + key, parseInt(sec), console.log)
        this.parent(key, sec)
        return this;
    },
    getall:function(key, callback)
    {
        this.redis.hgetall(this.name + '#' + key, callback);
    }

});

module.exports = Cache;