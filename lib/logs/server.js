var Clazz = require("../abstract-module");
var LogServer =  new Class({
    Extends : Clazz,
    cache : null,
    collection : null,
    lastCount : -1,
    max_result : 1000,
    intervals : null,
    interval_time : 1000, // 1 sec
    publishers : null,
    initialize:function()
    {
        this.parent()
    },
    update:function()
    {
        this.getnewitems(-1);

    },
    getnewitems:function(num)
    {
    	this.collection.range(0, num, function(err, res)
    	{
    		if(res != null)
    			res.reverse();
    		else
    			return;

    		Object.each(res, function(e)
    		{
    			try
    			{
    				this.publish( JSON.parse(e) );
    			}catch(errs)
    			{
    			}

    		}.bind(this))
    	}.bind(this)).expire(0);
    },
    publish:function(value)
    {
    	if(value != null)
    	{
    		var plugin = this.publishers['default'];
    		if(this.publishers[value.type] != null)
    			plugin = plugin.concat( this.publishers[value.type] )
    		if(plugin != null)
    		{
    			Object.each( plugin , function(e)
    			{
    				e.publish( value );
    			})
    		}
    	}
    },
    close:function()
    {
        this.parent()
    }
});


module.exports = LogServer;
