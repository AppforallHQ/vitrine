require('../lib/custom-date');
var gMethod = require('../lib/global_method');

module.exports =
    {
        LIMITS: {nam:1, ver:1, a60:1, a160:1 , siz:1, cat:1, id:1, ico:1, dl:1},

        make:function(list)
        {
            var result = [];
            if(list == null)
                list = [];

            for(var i=0; i<list.length; i++)
            {
                var obj = list[i];
                if (obj.a60)
                    obj.a60 = obj.a60.replace("https://","//").replace("http://","//");
                if (obj.a160)
                    obj.a160 = obj.a160.replace("https://","//").replace("http://","//");
                delete obj._id;
                result.push(obj);
            }
            return result;
        },

        getAllConditional: function (conditions, limits, options, time, cb) {
            var parameter = [];
            if (conditions) {
                parameter.push(conditions);
            }
            if (limits) {
                parameter.push(limits);
            }
            if (options) {
                parameter.push(options);
            }
            if (parameter.length == 0) {
                parameter = null;
            }
            this.Data.get('apps', 'getAllConditional', parameter, time, function(list)
                          {
                              if (!list) {
                                  cb(null);
                              } else {
                                  var objs = this.make(list);
                                  var parameter = [];
                                  if (conditions) {
                                      parameter.push(conditions);
                                  } else {
                                      parameter = null;
                                  }
                                  if (options.q && options.q != '') {
                                      regexQuery = new RegExp(options.q,"gi");
                                      parameter[0].nam = regexQuery;
                                  }
                                  this.Data.get('apps', 'getAllConditionalCount', parameter, time, function(count) {
                                      var info = {};
                                      info.total = count.all;
                                      info.free = count.free;
                                      info.nextPageUrl = [];
                                      info.pervPageUrl = [];

                                      if (info.total > (options.start + options.limit)) {
                                          info.nextPageUrl.push('start=' + (options.start + options.limit));
                                      }
                                      if (options.start > 0) {
                                          if (isNaN(options.start - options.limit) || (options.start - options.limit) < 0) {
                                              info.pervPageUrl.push('start=0');
                                          } else {
                                              info.pervPageUrl.push('start=' + (options.start - options.limit));
                                          }
                                      }

                                      t = '';
                                      if (info.nextPageUrl.length > 0) {
                                          if (options.q) {
                                              info.nextPageUrl.push('q='+options.q);
                                          }
                                          if (options.cat) {
                                              info.nextPageUrl.push('cat='+options.q);
                                          }
                                          for (i=0;i<info.nextPageUrl.length;i++) {
                                              if (i > 0) {
                                                  t += '&';
                                              }
                                              t += info.nextPageUrl[i];
                                          }
                                      }

                                      info.nextPageUrl = t==''? null:'?'+t;

                                      t = '';
                                      if (info.pervPageUrl.length > 0) {
                                          if (options.q) {
                                              info.pervPageUrl.push('q='+options.q);
                                          }
                                          if (options.cat) {
                                              info.pervPageUrl.push('cat='+options.q);
                                          }
                                          for (i=0;i<info.pervPageUrl.length;i++) {
                                              if (i > 0) {
                                                  t += '&';
                                              }
                                              t += info.pervPageUrl[i];
                                          }
                                      }

                                      info.pervPageUrl = t==''? null:'?'+t;


                                      result = {info: info, data: objs};
                                      cb(result);
                                  }.bind(this));
                              }
                          }.bind(this));
        },

        all : function(req, res)
        {
            this._all(req, function(result) {
                res.render(result);
            });

        },

        appsAllCategories : function(req, res) {

            this.Data.get('apps', 'getAllCat', null, 60, function(list)
                          {
                              var result = list;
                              res.render(result);
                          }.bind(this))
        },

        appsByCategories : function(req, res) {
            var keys = String(req.params[0]).split('/');

            var options = this.Data.queryParse(req.query);
            var limits = this.LIMITS;
            conditions = {'cat': {'$in': keys }};

            this.getAllConditional(conditions, limits, options, 60, function(result) {
                res.render(result);
            });
        },

        appsByCategorie: function(req, res) {
            this._appsByCategorie(req, function(result) {
                res.render(result);
            });
        },

        appsByTag: function(req, res) {
            this._appsByCategorie(req, function(result) {
                res.render(result);
            });
        },

        appsByName : function(req, res)
        {
            this._appsByName(req, function(result) {
                res.render(result);
            });
        },

        appsByNames : function(req, res)
        {
            var keys = String(req.params[0]).split('/');

            var options = this.Data.queryParse(req.query);
            var limits = this.LIMITS;
            conditions = {'nam': {'$in': keys}};

            this.getAllConditional(conditions, limits, options, 60, function(result) {
                res.render(result);
            });

        },

        _all: function(req, cb)
        {
            var options = this.Data.queryParse(req.query);
            var limits = this.LIMITS;

            var conditions = {'status': {'$lt': 100},
                              'cop': {
                                  '$elemMatch': {'status': {'$lt': 100}}
                              }};

            this.getAllConditional(conditions, limits, options, 60, function(result) {
                cb(result);
            });
        },

        _appsByCategorie: function(req, cb)
        {
            var options = this.Data.queryParse(req.query);
            var limits = this.LIMITS;
            var conditions = {'status': {'$lt': 100},
                              'cop': {
                                  '$elemMatch': {'status': {'$lt': 100}}
                              }};
            conditions.cat =  req.params.cat;

            this.getAllConditional(conditions, limits, options, 60, function(result) {
                cb(result);
            });
        },

        _appsByTag: function(req, cb)
        {
            var options = this.Data.queryParse(req.query);
            var limits = this.LIMITS;
            var conditions = {'status': {'$lt': 100},
                              'cop': {
                                  '$elemMatch': {'status': {'$lt': 100}}
                              }};
            conditions.tags =  req.params.tag;

            this.getAllConditional(conditions, limits, options, 60, function(result) {
                cb(result);
            });
        },

        _appByName: function(req, cb)
        {
            var options = this.Data.queryParse(req.query);
            var limits = this.LIMITS;
            var conditions = {'status': {'$lt': 100},
                              'cop': {
                                  '$elemMatch': {'status': {'$lt': 100}}
                              }};
            conditions.nam =  req.params.name;

            this.getAllConditional(conditions, limits, options, 60, function(result) {
                cb(result);
            });
        },

        _appById: function(req, cb)
        {
            var options = this.Data.queryParse(req.query);
            var limits = {};
            var conditions = {'status': {'$lt': 100},
                              'cop': {
                                  '$elemMatch': {'status': {'$lt': 100}}
                              }};
            conditions.id = req.params.id;

            this.getAllConditional(conditions, limits, options, 60, function(result) {
                cb(result);
            });
        }
    };
