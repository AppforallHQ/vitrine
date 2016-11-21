var Cache = require("./").client;
var c = new Cache();
c.on( Cache.EVENT_READY , function()
      {

        console.log('zlist');
        var collection = c.collection('zlist-test', Cache.Z_LIST);
        collection.set('2', 1).set(3)
        collection.expire(0, console.log)


        c.close();

      })
