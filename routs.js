// app.get app.all app.put app.del app.post

var routs = {
    '/' : {controller : 'index', action:'vitrin', type : 'all', permission: 0, render: 'default'},
    '/faq' : {controller : 'index', action:'faq', type : 'all', permission: 0, render: 'default'},
    '/tos' : {controller : 'index', action:'tos', type : 'all', permission: 0, render: 'default'},
    '/contact' : {controller : 'index', action:'contact', type : 'all', permission: 0, render: 'default'},
    '/features' : {controller : 'index', action:'features', type : 'all', permission: 0, render: 'default'},
    '/vitrine' : {controller : 'index', action:'search', type : 'all', permission: 0, render: 'default'},

    '/vitrine/suggest' : {controller : 'index', action:'vitrine_suggest', type : 'all', permission: 0, render: 'default'},
    '/vitrine/cat/:cat' : {controller : 'index', action:'cat', type : 'all', permission: 0, render: 'default'},
    '/bundle' : {controller : 'index', action:'bundleList', type : 'all', permission: 0, render: 'default'},
    '/bundle/:tag' : {controller : 'index', action:'bundle', type : 'all', permission: 0, render: 'default'},
    '/vitrine/:id' : {controller : 'index', action:'app', type : 'all', permission: 0, render: 'default'},
    '/apps/list' : {controller : 'apps', action:'all', type : 'all', permission: 0},
    '/apps/list/:name' : {controller : 'apps', action:'appsByName', type : 'all', permission: 0},
    '/apps/lists/*' : {controller : 'apps', action:'appsByNames', type : 'all', permission: 0},
    '/apps/categories' : {controller : 'apps', action:'appsAllCategories', type : 'all', permission: 0},
    '/apps/categorie/:cat' : {controller : 'apps', action:'appsByCategorie', type : 'all', permission: 0},
    '/apps/categories/*' : {controller : 'apps', action:'appsByCategories', type : 'all', permission: 0},
    '/apps/list/:id' : {controller : 'apps', action:'appsById', type : 'all', permission: 0},
    '/template/:name' : {controller : 'templates', action:'get', type : 'get', permission: 0},

    '/report' : {controller : 'report', action:'report', type : 'all', permission: 0, render: 'default'},
    '/captcha' : {controller : 'report', action:'captcha', type : 'all', permission: 0, render: 'default'},
    '/getcounter' : {controller : 'counter', action:'getCount', type : 'all', permission: 0, render: 'default'},
    '/updatecounter' : {controller : 'counter', action:'increment', type : 'all', permission: 0, render: 'default'},
    '/sitemap' : {controller : 'index', action:'sitemap', type : 'all', permission: 0, render: 'default'},

    // Landing pages
    '/help' : {controller : 'index', action:'landingHelp', type : 'all', permission: 0, render: 'default'},
    '/send' : {controller : 'index', action:'sendApp', type : 'all', permission: 0, render: 'default'},
    '/help/buy' : {controller : 'index', action:'landingHelpBuy', type : 'all', permission: 0, render: 'default'},
    '/fetr' : {controller : 'index', action:'landingFetr', type : 'all', permission: 0, render: 'default'},
    '/sport' : {controller : 'index', action:'landingSport', type : 'all', permission: 0, render: 'default'},
    '/sports' : {controller : 'index', action:'landingSport2', type : 'all', permission: 0, render: 'default'},
    '/movie' : {controller : 'index', action:'landingMovie', type : 'all', permission: 0, render: 'default'},
    '/game' : {controller : 'index', action:'landingGame', type : 'all', permission: 0, render: 'default'},
    '/game2' : {controller : 'index', action:'landingGame2', type : 'all', permission: 0, render: 'default'},
    '/photography' : {controller : 'index', action:'landingPhotography', type : 'all', permission: 0, render: 'default'},
    '/photography2' : {controller : 'index', action:'landingPhotography2', type : 'all', permission: 0, render: 'default'},
    '/syna' : {controller : 'index', action:'landingSyna', type : 'all', permission: 0, render: 'default'}
};

if (process.env.REGISTER_TYPE == "register") {
    routs['/welcome/:plan_id'] = {controller : 'signup', action:'complete', type : 'all', permission: 0, render: 'default'};
    routs['/failure/:res_code'] = {controller : 'signup', action:'failure', type : 'all', permission: 0, render: 'default'};
}
else if(process.env.REGISTER_TYPE == "earlypage") {
    routs['/early/'] = {controller : 'earlypage', action:'register', type : 'post', permission: 0, render: 'default'};
}
//error handling
routs['*'] = {controller : 'error', action:'index', type : 'all', permission: 0};


module.exports = routs;

