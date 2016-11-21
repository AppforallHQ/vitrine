var abstraction = require("./abstract");

var Cache = new Class({
    Extends:abstraction,
    initialize:function(name, redis)
    {
    	name = 'z~'+name;
        this.parent(name, redis)
    },
    range:function(from, to, callback)
    {
        this.redis.zrange(this.name,  parseInt(from), parseInt(to), callback);
        return this;
    },
    rangebyscore:function(from, to, callback)
    {
        this.redis.zrangebyscore(this.name, parseInt(from), parseInt(to), callback);
        return this;
    },
    getall:function(callback)
    {
        this.range(0, -1, callback)
        return this;
    },
    set:function(value, priority, callback)
    {
        callback = this.getCallback(callback);
        this.redis.zadd([this.name, parseInt(priority == null ? 0 : priority), value] , callback);
        this.parent(this.name, value);
        return this;
    },
    getindex:function(value, callback)
    {
        callback = this.getCallback(callback);
        this.redis.zscore([this.name, value], callback);
        return this;
    },
    remove:function(value, callback)
    {
        callback = this.getCallback(callback);
        this.redis.zrem(this.name ,value, callback);
        this.parent(this.name, callback)
        return this;
    },
    length:function(callback)
    {
        callback = this.getCallback(callback);
        this.redis.zcard(this.name, callback);
        return this;
    },
    expire:function(sec)
    {
        this.redis.expire(this.name, parseInt(sec))
        this.parent(this.name, sec)
        return this;
    }

});

module.exports = Cache;