var express = require('express');
var configs = require('./lib/website-configs');

var server = {};

server.app = express();
server.port = configs.port;

server.app = express();
server.server = null;

server.run = function(){
        this.server = this.app.listen(server.port, function(){
            console.log('Express API Oauth server started on port:'+ server.port );
        });
};

module.exports = server;
