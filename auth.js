var Clazz = require('./lib/abstract-module');
var configs = require('./lib/website-configs');
var crypto = require('crypto');
require('./lib/custom-date');
var obj2xml = require('./lib/json2xml');
var AuthModel = require('./lib/models/auths');

var authorizeModel =   require('./response/oauth2_authorize');
var tokenModel =   require('./response/oauth2_token');
var authorizeErrorModel =   require('./response/oauth2_error');

var Data;
var This;

var Auth = new Class({
  Extends: Clazz,
  initialize: function(data) {
    This = this;
    Data = data;
    this.parent();
  },
  prepare: function(req, res, next) {
    next();
  },
  auth: function(req, res, next) {
    var permission = this.r;
    if (permission < 1) {
      next(); // doesnt need to authenticate
      return;
    }

    var token;
    token = (req.query.access_token != null) ? req.query.access_token : token;
    token = (req.query.token != null) ? req.query.token : token;

    if (token == null) {
      err(req, res, next); // no token!
      return;
    }


    This.getMemberByToken(token, function(data) {
      if (data != null && data.username == res.member.username) {
        next();
      } else {
        err(req, res, next);
      }
    }.bind(this));
  },
  empty: function(req, res, next) {
    next();
  },
  revokeTokenByAccessToken: function(req, res, next) {
    Data.expireCache(this._token + token, 0, function(err, doc) {
        // removing tocken from redis.
    });

    AuthModel.revokeByAccessToken(token, function(err, doc) {
      if (err == null && doc != null) {
        cb(true);
      } else {
        cb(false);
      }
    }.bind(this));
  },
  updateExpireTimeByRefreshTokenAndUsername: function(refresh_token, client_id, new_refresh_token, cb) {
    //AuthModel.getValidTokenByRefreshTokenAndUsername(refresh_token, client_id, function(err, doc)
    Data.get('auths', 'getValidTokenByRefreshTokenAndUsername', [refresh_token, client_id], -1, function(doc) {
      if (doc != null && doc.username == client_id) {
        var obj = doc;

        AuthModel.updateExpireTimeByRefreshToken(refresh_token, new_refresh_token, function(errz, docz) {
          if (errz == null && docz != null) {
            Data.expireCache(this._token + obj.access_token, 0, function(err, doc) {
              // removing tocken from redis.
            });

            var ex = (obj.expire + configs.api.auth.default_refresh_inc * 1000) - new Date().getTime();

            tokenModel.access_token = obj.access_token;
            tokenModel.refresh_token  = new_refresh_token;
            tokenModel.expires_in = parseInt(ex / 1000);

            cb(tokenModel);
          } else {
            cb(null);
            console.tlog('warn', 'cannot upate expire time by token/usernaem in db', ['sys', 'auth', 'db', 'refresh_token'], doc);
          }
        }.bind(this))
      } else {
        cb(null);
        console.tlog('warn', 'cannot find user by refresh_token AND username in db', ['sys', 'auth', 'db', 'refresh_token'], {client_id: client_id, refresh_token: refresh_token});
      }
    }.bind(this));
  },
  getMemberByKey: function(key, cb) {
    Data.get('members', 'getByKey', [key], 60, function(doc) {
      if (doc != null) {
        cb(doc);
      } else {
        console.tlog('info', 'cannot find user by key in mongodb, key: ' + key, ['sys', 'auth', 'db']);
        cb(null);
      }
    }.bind(this))
  },
  getAllMembers: function(callback) {
    // MembersModel.getAll(function(err, docs)
    Data.get('members', 'getAll', [], 5, function(docs) {
      var arr = [];
      if(docs != null) {
        for(var i=0; i<docs.length; i++) {
          var obj = docs[i].toObject();
          arr.push(obj);
        }
      } else {
      }
      callback(arr);

    }.bind(this))
  },
    getByUsername:function(username, cb)
    {
        // MembersModel.getByUsername(username, function(err, data)
        Data.get('members', 'getByUsername', [username], 60, function(data)
        {
            if(data != null)
            {
                var str = JSON.stringify(data);
                Data.setRedis(this._members + username, str);
                cb(data);
            }else
            {
                cb(null)
            }
        }.bind(this));
    },
    addCodeByUsername:function(username, code, cb)
    {
        AuthModel.insertCodeByUsername(username, code, cb)
    },
    updateByCode:function(code, obj, cb)
    {
        AuthModel.updateByCode(code, obj, cb);
        //
        Data.expireCache(this._token + obj.access_token,  parseInt(obj.expires_in / 1000) , function(){} );
    },
    getByUsernameAndPasswordAndCode:function(username, password, code, cb)
    {
        username = String(username);
        password = String(password);
        code = String(code);
        //
        //AuthModel.getByUsernameAndCode(username, code, function(err, doc)
        Data.get('auths', 'getByUsernameAndCode', [username, code], -1, function(doc)
        {
            if(doc != null && doc.code == code && doc.username == username)
            {
              console.log('>>>', doc);
               // MembersModel.getByUsernameAndPassword(username, password, function(errz, docz)
                Data.get('members', 'getByUsernameAndPassword', [username, password], 60, function(docz)
                {
                    if(docz != null && docz.username == username && docz.password  == password)
                    {
                        cb(null, docz);
                    }else
                    {
                        cb({error : 'invalid username OR password'}, null);
                    }
                }.bind(this));
            }else
            {
                cb({error : 'invalid username OR code'}, null);
            }
        }.bind(this))
    },
    getMemberByToken:function(token, cb)
    {
      Data.get('auths', 'getValidTokenByAccesToken', [token], 30, function(data)
      {
          if(data != null && data.username != null &&  (data.expire > (new Date().getTime()) ) )
          {
              var str = JSON.stringify(data);
              this.getByUsername(data.username, cb);
          }else
          {
              console.tlog('warn', 'cannont find Auth document by token.', ['sys', 'auth', 'token'], token);
              cb(null)
          }
      }.bind(this));
    },
    updateLastRequestByKey:function(key)
    {
        MembersModel.updateLastRequestByKey(key, function(err, docs)
        {
        }.bind(this));
    },
    removeTokenHistoryByToken:function(token)
    {
        AuthModel.removeTokenHistoryByToken(token, function(err, docs)
        {
        }.bind(this));
    },
    updateLastRequestByToken:function(token, url)
    {
        url = String(url).replace(/rest\/json\/\d{8}\//, '').replace(/\?(.*)/g, '').replace(/rest\/xml\/\d{8}\//, '').replace(/\?(.*)/g, '')
        console.log('>>>>>', url);
        /*
        AuthModel.updateLastRequestByToken(token, url, function(err, docs)
        {
        }.bind(this));
        */
    }






    /*,
    getEncryptedKey:function(obj)
    {
        var str = JSON.stringify(obj);
        var cipher = crypto.createCipher(configs.criptoAlgorithm, configs.cripto);
        var crypted = cipher.update(str,'utf8','hex');
        crypted += cipher.final('hex');

        return crypted;
    },
    md5:function(text)
    {
      var md5sum = crypto.createHash('md5');
      md5sum.update(text);
      var md5 = md5sum.digest('hex');
      return md5;
    }*/
});


function err(req, res, next)
{
    res.status(403);
    var obj = {error:true, message : 'permission denied.'};
    if(req.params.type == 'xml')
    {
      obj = '<api>' + obj2xml(obj) + '</api>';
      res.setHeader('Content-Type', 'text/xml');
    }else
    {
      res.setHeader('Content-Type', 'application/json');
    }
    res.send(obj)
}

module.exports = Auth;


/*
var crypto = require('crypto');
var md5sum = crypto.createHash('md5');
md5sum.update('123');
var a = md5sum.digest('hex');
console.log(a);
*/

/*
var cipher = crypto.createCipher('aes-256-cbc','InmbuvP6Z8')
var text = "123|123123123123123";
cipher.update(text,'utf8','hex')
var crypted = cipher.final('hex')
var decipher = crypto.createDecipher('aes-256-cbc','InmbuvP6Z8')
decipher.update(crypted,'hex','utf8')
var dec = decipher.final('utf8')
*/
