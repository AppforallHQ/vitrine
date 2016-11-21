var abstraction = require("./abstract");

var Cache = new Class({
    Extends:abstraction,
    initialize:function(name, redis)
    {
    	name = 'l~'+name;
        this.parent(name, redis)
    },
    range:function(from, to, callback)
    {
        this.redis.lrange(this.name,  parseInt(from), parseInt(to), callback);
        return this;
    },
    getall:function(callback)
    {
        this.range(0, -1, callback)
        return this;
    },
    lpop:function(callback)
    {
        callback = this.getCallback(callback);
        this.redis.lpop(this.name, callback)
        this.updated(this.name, 'remove')
        return this;
    },
    rpop:function(callback)
    {
        callback = this.getCallback(callback);
        this.redis.lpop(this.name, callback)
        this.updated(this.name, 'remove')
        return this;
    },
    lpush:function(value, callback)
    {
        callback = this.getCallback(callback);
        this.redis.lpush(this.name, value, callback)
        this.updated(this.name, 'set');
        return this;
    },
    rpush:function(value, callback)
    {
        callback = this.getCallback(callback);
        this.redis.lpush(this.name, value, callback)
        this.updated(this.name, 'set')
        return this;
    },
    set:function(value, index, callback)
    {
        callback = this.getCallback(callback);
        this.redis.lset(this.name, parseInt(index == null ? 0 : index), value , callback);
        this.parent(this.name, value);
        return this;
    },
    remove:function(value, callback)
    {
        callback = this.getCallback(callback);
        this.redis.lrem(this.name , 0, value,  callback);
        this.parent(this.name, callback)
        return this;
    },
    length:function(callback)
    {
        callback = this.getCallback(callback);
        this.redis.llen(this.name, callback);   
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