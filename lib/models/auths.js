var mongoose = require('mongoose');
var mongoTypes = require('mongoose-types');
var configs = require('../website-configs');
require('../custom-date');

mongoose.connect(configs.mongo.db);

var Schema = mongoose.Schema
, ObjectId = Schema.ObjectId;

var AuthSchema = new Schema({
	code : String,
	access_token : String,
	refresh_token : String,
	expires_in : { type: Number, default: 3600 },
	inserted: { type: Date },
	created : { type: Number },	// timestamp created at
	expire : { type: Number },	// timestamp expire at
	refresh_history : {type:[Schema.Types.Mixed], default:[]},
	username : String,
	lastRequest : {type: Date},
	requests : {
				total   : Number,
				history : Schema.Types.Mixed
			   }
});


AuthSchema.statics.getByKey = function(key,fn)
{
    Auths.find().where("key", key).exec(fn);
}

AuthSchema.statics.getByToken = function(token,fn)
{
    Auths.findOne().where("access_token", token).exec(fn);
}

AuthSchema.statics.getByUsernameAndCode = function(username, code, fn)
{
    Auths.findOne()
    .where("username", username)
    .where("code", code)
    .where("access_token", "")
    .where("refresh_token", "")
    .exec(fn);
}

AuthSchema.statics.getValidTokenByAccesToken = function(token,fn)
{
	var to = new Date().getTime();
    Auths.findOne().where("access_token", token)
   // .where("created").gte(from)
    .where("expire").gt(to)
    .exec(fn);
}
AuthSchema.statics.insertCodeByUsername = function(username, code, fn)
{
	var a = new Auths({

		code : code,
		access_token : '',
		refresh_token : '',
		expires_in : 0,
		created : 0,
		expire : 0,
		refresh_history : [],
		username : username,
		inserted : new Date(),
		lastRequest : new Date(),
		requests : {
					total   : 1,
					history : {}
					}
	});
	a.save(fn);
}

AuthSchema.statics.getValidTokenByRefreshToken = function(token,fn)
{
	var to = new Date().getTime();
    Auths.findOne().where("refresh_token", token)
   // .where("created").gte(from)
    .where("expire").gt(to)
    .exec(fn);
}

AuthSchema.statics.getValidTokenByRefreshTokenAndUsername = function(token, username, fn)
{
	var to = new Date().getTime();
	console.log(token, username, to);
    Auths.findOne().where("refresh_token", token).where("username", username)
   // .where("created").gte(from)
    .where("expire").gt(to)
    .exec(fn);
}



AuthSchema.statics.revokeByAccessToken = function(token, fn)
{
	var update_obj = { type : 'revoke', date : new Date() };

	Auths.update(
		{access_token : token},
		{
	 		lastRequest : new Date,
	 		'$push' : {  refresh_history : update_obj },
	 		'$set' : { expires_in : 0, expire: 1 }
	 	}
	 	, {}, fn);
}

AuthSchema.statics.updateByCode = function(code, obj, fn)
{
	Auths.update(
		{code : code},
		{ '$set' :
			{
				access_token : obj.access_token,
				refresh_token : obj.refresh_token,
				expires_in : obj.expires_in,
				created : new Date().getTime(),
				expire : new Date().getTime() + obj.expires_in,
				lastRequest : new Date()
		}   },
		{}, fn);
}

AuthSchema.statics.updateExpireTimeByRefreshToken = function(token, new_refresh_token,fn)
{
	var update_obj = { type : 'refresh', secs : configs.api.auth.default_refresh_inc, date : new Date() };

	Auths.update(
		{refresh_token : token},

		{'$inc' : { expire : configs.api.auth.default_refresh_inc*1000  } ,
	 	lastRequest : new Date,
	 	'$push' : {  refresh_history : update_obj },
	 	'$set' : { refresh_token : new_refresh_token }

	 	}
	 	, {}, fn);
}

AuthSchema.statics.removeTokenHistoryByToken = function(token,fn)
{
	Auths.update({access_token : token}, {'$unset' : { 'requests.history' :  1} }  , {}, fn);
}

AuthSchema.statics.getAll = function(fn)
{
    Auths.find().exec(fn);
}

AuthSchema.statics.updateLastRequestByToken = function(token, url,fn)
{
	var dt = new Date();
	var k = 'requests.history.' + dt.getFullYear() + '-' + (dt.getMonth()+1) + '-' + dt.getDate();
	url =  String(url).replace(/\ /g, '').replace(/\\/g, '').replace(/\(/g, '').replace(/\)/g, '').replace(/\./g, '_').replace(/\$/g, '');

	var q = {};
	q['requests.total'] = 1;
	q[ k + '.sum'  ] = 1;
	q[ k + '.'+ url ] = 1;
    Auths.update({access_token : token}, {'$inc' : q, lastRequest : new Date}, {}, fn);
}


Auths = mongoose.model('auths', AuthSchema);
module.exports = Auths;
