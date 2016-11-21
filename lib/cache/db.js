var Clazz = require("../abstract-module");
var configs = require('../cache-configs');


var DB = new Class({
    Extends : Clazz,
    db:null,
    isReady : false,
    isCacheEnable:false,
    initialize:function()
    {

    	var Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server;
//    BSON = require('mongodb').BSONNative,
        var parseDbUrl = require("parse-database-url")
        var dbConfig = parseDbUrl(process.env["CACHE_MONGO_URI"])
        console.log(dbConfig)
        configs.mongo.name = dbConfig.name
        configs.mongo.user = dbConfig.user
        configs.mongo.pass = dbConfig.pass
        configs.mongo.host = dbConfig.host
        configs.mongo.port = dbConfig.port

        this.db = new Db( configs.mongo.name , new Server( configs.mongo.host,  configs.mongo.port,  {auto_reconnect: configs.mongo.auto_reconnect, poolSize : configs.mongo.poolSize} ), {numberOfRetries:configs.mongo.numberOfRetries, native_parser:configs.mongo.native_parser});
        this.db.open(function(err, db)
        {
            if(err)
            {
                this.emit( Clazz.EVENT_ERROR, err );
            }
            else
            {
                if(configs.mongo.user != '' && configs.mongo.pass != '')
                {

                    this.db.authenticate( configs.mongo.user , configs.mongo.pass , function(err2, result)
                    {
                        if(err2)
                            this.emit( Clazz.EVENT_ERROR, err );
                        else
                        {
                            this.isReady = true;
                            this.emit( Clazz.EVENT_READY );
                        }
                    }.bind(this));
                }else
                {
                    this.isReady = true;
                    this.emit( Clazz.EVENT_READY );
                }
            }

        }.bind(this));

        /*this.db.on("close", function(error)
        {
            this.emit( Clazz.EVENT_ERROR );
        }.bind(this));*/
        this.parent()
    },
    find:function(collection, objQuery, objAdditional, cb)
    {
        if(typeof(collection) == 'string')
        {
            this.db.collection(collection, function(err, col)
            {
                col.find(objQuery, objAdditional).toArray(cb);
            }.bind(this));
        }else
        {
            collection.find(objQuery, objAdditional).toArray(cb);
        }
    },
    update:function(collection, objQuery, objAdditional, cb)
    {
        if(typeof(collection) == 'string')
        {
            this.db.collection(collection, function(err, col)
            {
                col.update(objQuery, objAdditional, {safe:true}, cb)
            }.bind(this));
        }else
        {
            collection.update(objQuery, objAdditional, {safe:true}, cb);
        }
    },
    findOne:function(collection, objQuery, objAdditional, cb)
    {
        if(typeof(collection) == 'string')
        {
            this.db.collection(collection, function(err, col)
            {
                col.findOne(objQuery, objAdditional, cb);
            }.bind(this));
        }else
        {
            collection.findOne(objQuery, objAdditional).toArray(cb);
        }
    },
    count:function(collection, cb)
    {
        if(typeof(collection) == 'string')
        {
            this.db.collection(collection, function(err, col)
            {
                if(err)
                {
                    if(cb != null)
                        cb(true, null)
                    return;
                }

                col.count(cb);
            });
        }else
        {
            collection.count(cb);
        }
    },
    remove:function(collection, value, cb)
    {
        if(typeof(collection) == 'string')
        {
            this.db.collection(collection, function(err, col)
            {
                if(err)
                {
                    if(cb != null)
                        cb(true, null)
                    return;
                }
                col.remove(value, cb);
            }.bind(this));
        }else
        {
            collection.remove(value, cb);
        }
    },
    insert:function(collection, value, cb)
    {
        if(typeof(collection) == 'string')
        {
            this.db.collection(collection, function(err, col)
            {
                if(err)
                {
                    if(cb != null)
                        cb(true, null)
                    return;
                }
                col.insert(value, cb);
            }.bind(this));
        }else
        {
            collection.insert(value, cb);
        }
    },
    collection:function(name, cb)
    {
        if(this.db == null || !this.isReady)
        {
            cb(null);
            return;
        }

        this.db.collection(name, function(err, collection)
        {
            if(err)
            {
                cb( null );
            }else
            {
                cb( collection );
            }
        }.bind(this))
    },
    close:function()
    {
        if(this.db != null)
        {
            this.isReady = false;
            this.db.close();
            this.db = null;
        }

        Db = null;
        Connection = null;
        Server = null;
        this.parent()
    }
});




module.exports = DB;
