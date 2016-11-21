var mongoose = require('mongoose');
var mongoTypes = require('mongoose-types');
var configs = require('../website-configs');
var jalali = require('../jalali');
var persian = require('../persian');
var gMethod = require('../global_method');
mongoTypes.loadTypes(mongoose, 'url');
//mongoose.connect(configs.mongo.db);

var Schema = mongoose.Schema
, ObjectId = Schema.ObjectId;

var AppSchema = new Schema({
    id:{type:String},
    nam:{type:String},
    ver:{type:String},
    ico:{type:String},
    cat:{type:String},
    cid:{type:String},
    ven:{type:String},
    rel:{type:String},
    add:{type:String},
    siz:{type:String},
    iscr:{type:[String]},
    des:{type:String},
    gdl:{type:Number},
    dl:{type:Number},
    bid:{type:String},
    req:{type:String},
    sdev:{type:[String]},
    com:{type:String},
    beta:{type:String},
    locdes:{type:String},
    cop:{type:Schema.Types.Mixed},
    scr_html: {},
    html_description : '',
    html_loc_des: '',
    seo_loc_des: '',
    seo_nam: '',
    human_date: ''
});

AppSchema.statics.getById = function(id, fn)
{
    App.findOne({id: id}, fn);
};

AppSchema.statics.getByName = function(nam, fn)
{
    App.find({nam: nam}, fn);
};

AppSchema.statics.getAllConditionalCount = function(condition, fn)
{
    var freeCondition = Object.create(condition);
    freeCondition.prc = "Free";

    var all = App.count(condition);
    var free = App.count(freeCondition);

    all.exec(function(err, allcount) {
        free.exec(function(err, freecount){
            if (err) {
                fn(err, null);
            } else {
                count = {'all': allcount,
                         'free': freecount};

                fn(err, count);
            }
        });
    });
};

AppSchema.statics.getAllConditional = function(condition, filters,options, fn)
{
    if (!options.sorton) {
        options.sorton = 'dl';
    }
    var appSortKey = ['nam', 'ver', 'cat', 'siz', 'dl', 'gdl', 'upd'];
    if (appSortKey.indexOf(options.sorton) > -1) {
        var q = App.find(condition, filters);
        if(options.sorton != null) {
            options.sort = (options.sort == null) ? 1 : options.sort;
            options.sort = parseInt(options.sort);
            if(options.sort == 0) options.sort = -1;
            if(options.sort > 0) options.sort = 1;
            var t = {};
            t[options.sorton] = options.sort;
            q.sort(t);
        }

        if (options.start > 0) {
            q.skip(options.start);
        }
        q.limit(options.limit);

        if (options.q) {
            regexQuery = new RegExp(options.q,"gi");
            q.where().or({'nam': regexQuery}, {'ver': regexQuery}, {'des': regexQuery});
        }

        //q.exec(fn);
        q.exec(function (err, res) {
            if (err) {
                fn(err, null);
            } else {
                var result = [];
                for(var i=0; i<res.length; i++) {
                    result.push(res[i]);
                    //Do something
                    var tmp = res[i];

                    //Hack for Https Replace http://a\d to https://s\d.mzstatic

                    if (tmp['scr']) {
                        tmp['scr1'] = [];
                        for (var b=0; b<tmp['scr'].length; b++) {
                            img = tmp['scr'][b];
                            img = img.replace("http://a","//s");
                            img = img.replace("http://","//");
                            console.log(img);
                            tmp['scr1'].push({'src': img});
                        }
                        result[i]['scr_html'] = tmp['scr1'];
                    }
                    else if(tmp['iscr'])
                    {
                        tmp['scr1'] = [];
                        for (var b=0; b<tmp['iscr'].length; b++) {
                            img = tmp['iscr'][b];
                            img = img.replace("http://a","//s");
                            img = img.replace("http://","//");
                            tmp['scr1'].push({'src': img});
                        }
                        result[i]['scr_html'] = tmp['scr1'];
                    }

                    if (result[i]['des']) {
                        result[i]['html_description'] = gMethod.ln2br(result[i]['des']);
                    }
                    if (result[i]['locdes']) {
                        result[i]['html_loc_des'] = gMethod.ln2br(result[i]['locdes']);

                        //slice first 160 chars for description tag
                        var seoDesc = result[i]['locdes'].trim().slice(0,160).trim();
                        // get rid of invalid chars in description
                        seoDesc = seoDesc.replace("\"", "'").replace(/\n/g, " ").trim();
                        //get rid of last word
                        seoDesc = seoDesc.substring(0, seoDesc.lastIndexOf(" "));
                        result[i]['seo_loc_des'] = seoDesc + " ...";
                    }
                    if (result[i]['nam']){
                        var seoNam = result[i]['nam'].replace("&", "");

                        // get rid of anything after ",", "-", "–", "(" in title
                        var getRidOfChars = [ ",", "-", "–", "("];
                        getRidOfChars.forEach(function(char){
                            seoNam = seoNam.split(char)[0];
                        });

                        if (seoNam.length >= 45) {
                            // slice first 50 chars for title and replace with ...
                            seoNam = seoNam.slice(0,45);
                            //get rid of last word
                            seoNam = seoNam.substring(0, seoNam.lastIndexOf(" "));
                            seoNam = seoNam+"...";
                        }
                        result[i]['seo_nam'] = seoNam;
                    }
                    if (result[i]['rel']) {
                        var monthNames = [ "January", "February", "March", "April", "May", "June",
                                           "July", "August", "September", "October", "November", "December" ];
                        var date = new Date(result[i]['rel'] * 1000);
                        result[i]['human_date'] = monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
                    }
                }
                fn(null, result);
            }
        });
    } else {
        // bad sort option
        fn("{error: 'bad_option', message: 'sort option not exists'}");
    }
};

AppSchema.statics.getApps = function(limit,skip,condition,fn)
{
    limit = limit ? limit : 1000;
    skip = skip ? skip : 0;
    this.find().limit(limit).skip(skip).sort({"dl": 1}).exec(function(err,docs){
        fn(err,docs);
    });
};

AppSchema.statics.getApp = function(id,fn)
{
    this.findById(id,fn);
};

AppSchema.statics.getAllCat = function(fn)
{
    App.distinct("cat").exec(function (err, res) {
        if (err) {
            fn(err, null);
        } else {
            var result = [];
            for (var i=0; i<=res.length; i++) {
                result.push({title: res[i]});
            }
            fn (null, result);
        }
    });
};

AppSchema.statics.getAppIDs = function(fn)
{
    App.distinct("id").exec(function (err, res) {
        if (err) {
            fn(err, null);
        } else {
            fn (null, res);
        }
    });
};

App = mongoose.model('App', AppSchema);

module.exports = App;
