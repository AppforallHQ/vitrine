//exports.server = require('./server');
var minify = require('express-minify');
var Clazz = require("./lib/abstract-module");
var configs = require('./lib/website-configs');
var express = require('express');
var session = require('express-session');
var controllers = require('./routs');
var obj2xml = require('./lib/json2xml');
var Auth = require('./auth');
var Data = require('./data');
var cons = require('consolidate');
var server = require('./server');
var swig = require('swig');
var catTrans = require('./lib/category_translations');
var raven = require('raven');

var client = new raven.Client(configs.sentry_dsn);
client.patchGlobal();

var APIServer = new Class({
    Extends : Clazz,
    log:null,
    app:null,
    auth:null,
    initialize:function()
    {
        console.tlog = console.log;
        //
        this.log = new (require('./lib/logs').client)('api_server');
        this.parent();
        //
        this.auth = new Auth(Data);
        this.init();
    },
    ____renders:function(obj)
    {
        console.log('Custom Render');
        if(this.req.params != null && this.req.params.type == 'xml')
        {
            if(obj == null)
                obj = {};

            obj = JSON.parse(JSON.stringify(obj));

            obj = '<api>' + obj2xml(obj) + '</api>';
            this.setHeader('Content-Type', 'text/xml; charset=utf-8');
        }else
        {
            this.setHeader('Content-Type', 'application/json; charset=utf-8');
        }

        this.send(obj);
    },
    init:function()
    {

        this.app = server.app;
        server.run();

        this.app.use(express.bodyParser());
        this.app.use(express.methodOverride());
        // this.app.use(express.static( configs.static_files ));

        // this.app.use(function(req, res, next) {
        //     if(['/faq',/*'/pricing',*/'/tos','/yesfaq'].indexOf(req.url) != -1)
        //     {
        //         req.url = req.url + '.html';
        //         console.log(req.url);
        //     }
        //     next();
        // });
        this.app.use(session({secret: 'THeSecretF0R3ssionofApp4Al1',resave: false,saveUninitialized: true,maxAge: 10*60*1000}));

        this.app.use(minify({
            // cache: "/tmp"
        }));
        this.app.use('/static', express.static( configs.static_files ));
        this.app.use('/assets', express.static( configs.dist_files ));
        this.app.use('/l1', express.static('/home/rubako/environment/workingFiles/repository/'));
        this.app.use('/release', express.static('/home/rubako/environment/workingFiles/layer3'));
        this.app.use('/repo', express.static('/home/rubako/environment/workingFiles/repository'));
        this.app.use('/static', express.static('/home/rubako/environment/workingFiles/static'));
        this.app.use("/views", express.static( configs.views ) );
        this.app.use(express.cookieParser());
        this.app.engine('html', cons.swig);
        this.app.set('views', configs.views);
        this.app.set('view engine',  'html');

        // Define swig filters
        swig.setFilter('slice', function(input, start, end){
            if(input.length > end){
                return input.slice(start, end) + "...";
            } else {
                return input;
            }
        });

        swig.setFilter('translateCat', function(name){
            return catTrans[name];
        });

        swig.setFilter('addFarsiClass', function(currentClass, text){
            var arabic = /[\u0600-\u06FF]/;
            if(arabic.test(text)){
                return currentClass + " " + "farsi";
            } else {
                return currentClass;
            }
        });

        for(var i in controllers)
        {
            var t = controllers[i].type == null ? 'all' : controllers[i].type;
            var a = controllers[i].action == null ? 'index' : controllers[i].action;
            var c = controllers[i].controller;
            var r = controllers[i].permission == null ? 0 : controllers[i].permission;
            var re = controllers[i].render;

            try
            {
                //app[t](i , (r > 0 ? this.auth.auth : this.auth.empty ), function(req, res)
                this.app[t](i , [ this.auth.prepare , this.auth.auth.bind({r:r}) ], function(req, res)
                            {
                                res.action = this.a;
                                res.controller = this.c;
                                res.permission = this.r;
                                if (!this.re || this.re != 'default') {
                                    console.log('custom for:', this.c, this.a);
                                    res.render = this.th.____renders;
                                } else {
                                    console.log('DEFAULT for:', this.c, this.a);
                                }
                                var cz = require( configs.controllers + res.controller );
                                cz.Data = Data;
                                Data.request++;
                                cz.Auth = this.th.auth;
                                cz[res.action](req, res);


                            }.bind({i:i, c:c, a:a, t:t, th:this, r:r, re:re}) );
            }catch(e)
            {
                console.log(e);
            }
        }

    },
    close:function()
    {
        // log
        this.log.info('closing the API Oauth web server instance');
        this.parent();
    }
});



module.exports = APIServer;
//new APIServer();
