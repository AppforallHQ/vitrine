var Clazz = require("./abstract");
var Amon = require('amon');

var amon = new Amon({ 
           'host'    : 'IP',
           'port': 2464, 
           'app_key' : '?fape' }
   );
Amon.app_key = '?fape'

//amon.protocol = 'zeromq'
//amon.port = 5464

var Abstract =  new Class({
    Extends : Clazz,
    initialize:function()
    {
        this.parent()
    },
    publish:function(value)
    {
        if(value == null)
            return;

        if(amon != null)
        {
    	   amon.log( JSON.stringify(value) , value.type )
        }

        this.parent(value)
    }
});

/*
process.addListener('uncaughtException', function(err) {
    amon.handle(err);
});

amon.on('error', function(error,data) {
  // alternative logger
  console.log(data);
});

var a = new Abstract();
a.publish( { test:90, type : 'log' } )
*/

module.exports = Abstract;
