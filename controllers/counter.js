var redis = require('redis');
var client = redis.createClient();

var server = require('../server');
var io = require('socket.io').listen(server.server);

io.on('connection', function(socket){
    console.log('a user connected');
});

var get_count = function(callback){
    client.select(5, function(err, msg){
        client.get("download_counter", function(err, count){
            if(!(isNaN(count))){
                callback(count);
            }else{
                callback(81555);
            }
        });
    });
};

var set_count = function(count){
    client.select(5, function(err, res){
        return client.set("download_counter", count);
    });
};

var add_count = function(num, callback){
    get_count(function(count){
        var newCount = parseInt(count) + 1;
        set_count(newCount);

        callback(newCount);
    });
};

module.exports = {
    increment: function(req, res){
        add_count(1, function(count){
            io.emit("inc", count);
            res.send({
                status: "ok",
                count: String(count)
            });
        });
    },

    getCount: function(req, res){
        get_count(function(count){
            res.json({
                count: String(count)
            });
        });
    }
};
