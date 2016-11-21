require('../lib/custom-date');
apps = require('./apps');
var plans = JSON.parse(process.env.PLANS_JSON);
var request = require('request');
var Analytics = require('analytics-node');
var sortSearch = require('../lib/sortSearchApps');

var TRANSLATE_CAT_NAME = require('../lib/category_translations');

var NAMES = {vitrin : "اپفورال",cat : "دسته "};

var analytics = new Analytics('');

var load_register_section = function(req,res_data){
    if (process.env.REGISTER_TYPE == "register") {
        res_data['register'] = true;
        res_data['plans'] = plans;
        res_data['partials']['slide_1'] = 'slide_1';
        res_data['partials']['slide_2'] = 'slide_2';
        res_data['partials']['slide_3'] = 'slide_3';
        res_data['partials']['slide_content'] = 'ajax_slides';
    }
    else if (process.env.REGISTER_TYPE == "earlypage") {
        res_data['earlypage'] = true;
        res_data['partials']['earlypage_content'] = 'earlypage';
        res_data['landing'] = true;
        res_data['queue_length'] = process.env.QUEUE_LENGTH;
        res_data['referrer'] = req.param('ref_id');
    }
};


var suggestion_apps = [];
var translate_cat_names = function(cats) {
    return cats.map(function(cat) {
        new_cat = JSON.parse(JSON.stringify(cat));
        new_cat.translated = new_cat.title;
        if(new_cat.title in TRANSLATE_CAT_NAME) {
            new_cat.translated = TRANSLATE_CAT_NAME[new_cat.title];
        }
        return new_cat;
    });
};

var renderLanding = function(res, view){
    request({url: 'http://localhost:3000/getcounter'}, function(err, response, body){
        var dl_data = 10000;
        if(!err){
            dl_data = JSON.parse(body).count;
        }
        var res_data = {
            dl_data: dl_data
        };

        res.render(view, res_data);
    });
};

var roundByTen = function(number, place){
    var tens = place ? Math.pow(10, place) : 10;
    return number - (number % tens);
};

function shuffle(o){
    // http://stackoverflow.com/a/6274381/1573477
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

module.exports = {
    vitrin: function(req, res) {
        apps.Data = this.Data;

        apps._all(req, function(result) {
            app = result.data;
            info = result.info;
            info.cat = NAMES.vitrin;
            var res_data = {};

            this.Data.get('PROJECT', 'getBundles', null, 60, function(result) {
                info.paid = info.total && info.free ? roundByTen(info.total - info.free) : 10300;
                info.total = info.total ? roundByTen(info.total) : 13000;
                info.free = info.free ? roundByTen(info.free) : 2700;
                var res_data = {
                    referredBy : req.param("referredBy"),
                    utm_campaign : req.param("utm_campaign"),
                    apps: app,
                    bundles: shuffle(result).slice(0, 8),
                    info: info,
                    req_data: {
                        x_forwarded_for: req.headers['x-forwarded-for'],
                        remote_addr: req.connection.remoteAddress,
                        remote_host: req.headers.host,
                        user_agent: req.headers['user-agent']
                    },
                    suggestion_apps: suggestion_apps,
                    plans: plans
                };
                // TODO: Implement register section
                // load_register_section(req,res_data);

                res.render('index', res_data);
            });
        }.bind(this));
    },
    search: function(req, res) {
        var search_query = req.param('q');

        if(search_query){
            this.Data.get('apps', 'getAllCat', null, 60, function(result) {
                var cat = translate_cat_names(result);
                var params = {q: search_query, count: 50};

                request({url: 'http://API/apps/find/', qs:params}, function(err, response, body){
                    if(err){
                        res.render('app_list');
                    }
                    var apps = JSON.parse(body).list;
                    if(Object.keys(apps).length != 0){
                        apps = sortSearch(apps);
                    };

                    var res_data = {
                        apps: apps,
                        cats: cat,
                        info: {query: search_query,
                               total: apps ? apps.length : 0},
                        suggestion_apps: suggestion_apps,
                        req_data: {
                            x_forwarded_for: req.headers['x-forwarded-for'],
                            remote_addr: req.connection.remoteAddress,
                            remote_host: req.headers.host,
                            user_agent: req.headers['user-agent']
                        }
                    };
                    res.render('app_list', res_data);
                });
            });
        } else {
            apps.Data = this.Data;

            apps._all(req, function(result) {
                app = result.data;
                info = result.info;
                info.cat = NAMES.vitrin;
                info.query = this.Data.queryParse(req.query).q,
                this.Data.get('apps', 'getAllCat', null, 60, function(result) {
                    cat = translate_cat_names(result);

                    var res_data = {
                        apps: app,
                        cats: cat,
                        info: info,
                        'zomg_scroll': true,
                        suggestion_apps: suggestion_apps,
                        req_data: {
                            x_forwarded_for: req.headers['x-forwarded-for'],
                            remote_addr: req.connection.remoteAddress,
                            remote_host: req.headers.host,
                            user_agent: req.headers['user-agent']
                        }
                    };
                    res.render('app_list', res_data);
                });
            }.bind(this));
        }
    },

    vitrine_suggest: function(req, res) {
        //FIXME
        var url = process.env.ZAPIER_SUGGEST_URL+'?app_name='+encodeURIComponent(req.query.app_name);

        /*analytics.identify({
         userId: 'anonymous',
         traits: {
         name: 'Anonymous',
         email: 'anonymous@anonymous.com',
         }
         });*/

        /*analytics.track({
         userId: 'anonymous',
         event: 'request_nonexistent_app_from_support',
         properties: {
         name: 'Anonymous',
         email: 'anonymous@anonymous.com',
         app_name: req.query.app_name
         }
         });*/

        request.get(url).pipe(res);
    },

    cat: function(req, res) {
        apps.Data = this.Data;
        apps._appsByCategorie(req,function(result) {
            app = result.data;
            info = result.info;
            info.cat = NAMES.cat + TRANSLATE_CAT_NAME[req.params.cat];
            info.canonical = "cat/" + req.params.cat;
            this.Data.get('apps', 'getAllCat', null, 60, function(result) {
                cat = translate_cat_names(result);
                var res_data = {
                    cats: cat,
                    apps: app,
                    info: info,
                    'zomg_scroll': true,
                    'analytics': "analytics.page('" + req.params.cat +"', 'Category Page')"
                    // partials: {
                    //     'content': 'vitrin',
                    //     'vitrine': 'vitrin',
                    //     'pjax_content': 'list_of_apps'
                    // }
                };
                // load_register_section(req,res_data);

                // if (req.xhr) {
                //     res.render('list_of_apps', res_data);
                // } else {
                //     res.render('layout_single', res_data);
                // }

                res.render('app_list', res_data);
            });
        }.bind(this));
    },

    bundle: function(req, res) {
        apps.Data = this.Data;
        var tag = req.params.tag;
        var params = {tag: tag};

        request({url: 'http://API/apps/list/', qs:params}, function(err, response, body){

            response = JSON.parse(body);
            var apps = response.list;

            var info = {};
            info.canonical = "bundle/" + tag;
            info.total = apps.length;

            this.Data.get('apps', 'getAllCat', null, 60, function(result) {
                var cat = translate_cat_names(result);
                var res_data = {
                    cats: cat, 
                    apps: apps,
                    info: info,
                    bundle: req.params.tag,
                    'zomg_scroll': true,
                    'analytics': "analytics.page('" + req.params.tag +"', 'Bundle Page')"
                };
                res.render('app_list', res_data);
            });
        }.bind(this));
    },

    app: function(req, res) {
        apps.Data = this.Data;
        apps._appById(req,function(result) {
            app = result.data[0];
            this.Data.get('apps', 'getAllCat', null, 60, function(result) {
                cat = translate_cat_names(result);
                var info = {};
                try{
                    info.canonical = app.id;
                } catch(e) {
                    info.canonical = null;
                    info.itunesid = req.params.id;
                }
                res_data = {
                    app: app,
                    cats: cat,
                    info: info
                };
                // load_register_section(req,res_data);
                res.render('app_single', res_data);
            });
        }.bind(this));
    },
    // pricing: function(req, res) {
    //     var res_data = {
    //         'plans': plans
    //     };
    //     res.render('pricing', res_data);
    // },

    // friends: function(req, res){
    //     res.render('friends');
    // },
    faq: function(req, res){
        res.render('faq');
    },
    tos: function(req, res){
        res.render('tos');
    },
    contact: function(req, res){
        res.render('contact');
    },
    sendApp: function(req, res){
        res.render('send');
    },
    features: function(req, res){
        res.render('features');
    },
    sitemap: function(req, res){
        this.Data.get('apps', 'getAllCat', null, 60, function(result) {
            cat = result;

            this.Data.get('apps', 'getAppIDs', null, 60, function(result){
                var res_data = {
                    apps: result,
                    cats: cat
                };
                res.header('Content-Type', 'text/xml');
                res.render('sitemap', res_data);
            });
        }.bind(this));
    },
    bundleList: function(req, res){
        this.Data.get('apps', 'getAllCat', null, 60, function(result) {
            cat = translate_cat_names(result);
            this.Data.get('PROJECT', 'getBundles', null, 60, function(result) {
                var info = {};
                try{
                    info.canonical = app.id;
                } catch(e) {
                    info.canonical = null;
                    info.itunesid = req.params.id;
                }
                res_data = {
                    // app: app,
                    cats: cat,
                    info: info,
                    bundles: result
                };
                // load_register_section(req,res_data);
                res.render('bundle-list', res_data);
            });
        }.bind(this));
    },
    landingFetr: function(req, res){
        res.render('landing_fetr');
    },
    landingHelp: function(req, res){
        res.render('landing_help');
    },
    landingHelpBuy: function(req, res){
        res.render('landing_help_buy');
    },
    landingSport: function(req, res){
        renderLanding(res, 'landing_sport');
    },
    landingMovie: function(req, res){
        renderLanding(res, 'landing_movie');
    },
    landingGame: function(req, res){
        renderLanding(res, 'landing_game');
    },
    landingGame2: function(req, res){
        renderLanding(res, 'landing_game2');
    },
    landingSport2: function(req, res){
        renderLanding(res, 'landing_sport2');
    },
    landingPhotography: function(req, res){
        renderLanding(res, 'landing_photography');
    },
    landingPhotography2: function(req, res){
        renderLanding(res, 'landing_photography2');
    },
    landingSyna: function(req, res){
        renderLanding(res, 'landing_syna');
    }
};
