require('../lib/custom-date');
var global = require('../lib/global-configs');
var configs = require('../lib/website-configs');
var errorModel = require('../response/error');
var authorizeModel =   require('../response/oauth2_authorize');
var tokenModel =   require('../response/oauth2_token');
var authorizeErrorModel =   require('../response/oauth2_error');


module.exports =
{
	revoke: function(req, res)
	{
		var token = null;

		if(req.body.token != null)
			token = req.body.token;

		if(req.query.token != null)
			token = req.query.token;

		if(token == null && req.query.access_token != null)
			token = req.query.access_token;

		if(token == null && req.body.access_token != null)
			token = req.body.access_token;

		errorModel.code = 0;
		errorModel.message = 'invalid token.';

		if(token == null)
		{
			res.status(400).render(errorModel);
			return;
		}


		this.Auth.revokeTokenByAccessToken(token, function()
		{
			if(true)
			{
				res.status(200).render({message:'token has been revoked.', token : token});
			}else
			{
				res.status(400).render(errorModel);
			}

		}.bind(this));
	},
	token : function(req, res)	// refresh token
	{

		/*
			refresh_token
			client_id
			client_secret
			grant_type
			//
			grant_type === "authorization_code"
			grant_type === "refresh_token"
		*/

		var obj = {};
		var input = {};
		var keys = ['refresh_token', 'client_id', 'client_secret', 'grant_type', 'code'];

		for(var i=0; i<keys.length; i++)
		{
			if(req.body[ keys[i] ] != null)
				input[ keys[i] ] = req.body[ keys[i] ];

			if(req.query[ keys[i] ] != null)
				input[ keys[i] ] = req.query[ keys[i] ];
		}

		//
		if(input.client_id != null && input.grant_type != null && input.refresh_token != null && input.grant_type == 'refresh_token')
		{
			this.Auth.updateExpireTimeByRefreshTokenAndUsername(input.refresh_token, input.client_id, getRandomToken(6, input.client_id), function(obj)
			{
				if(obj != null)
				{
					res.render(obj)
				}
				else
				{
					authorizeErrorModel.error_description = 'cannot refresh token.';
					res.status(404).render(authorizeErrorModel);
				}
			}.bind(this))
		}else
		{
			if( input.client_id != null && input.client_secret != null && input.code != null)
			{
				this.Auth.getByUsernameAndPasswordAndCode(input.client_id, input.client_secret, input.code, function(err, doc)
				{
					if(err == null && doc != null && doc.username == input.client_id)
					{
						tokenModel.access_token = getRandomToken(4, input.client_id);
						tokenModel.refresh_token  = getRandomToken(6, input.client_id);
						tokenModel.expires_in = configs.api.auth.default_expire_in;

						this.Auth.updateByCode(input.code, tokenModel, function(errz, docz)
						{
							if(errz == null && docz != null)
							{
								tokenModel.expires_in = parseInt(tokenModel.expires_in/1000);
								res.render(tokenModel);
							}else
							{
								authorizeErrorModel.error_description = 'error in code.';
								console.tlog('error', 'invalid parameters in oauth2::token.', ['model-oauth2', 'model', 'auth', req.rnd], input);
								res.status(404).render(authorizeErrorModel);
							}
						}.bind(this))
					}else
					{
						authorizeErrorModel.error_description = 'invalid parameter(s).';
						console.tlog('error', 'invalid parameters in oauth2::token.', ['model-oauth2', 'model', 'auth', req.rnd], input);
						res.status(404).render(authorizeErrorModel);
					}

				}.bind(this));
			}else
			{
				authorizeErrorModel.error_description = 'invalid parameter(s).';
				console.tlog('error', 'invalid parameters in oauth2::token.', ['model-oauth2', 'model', 'auth', req.rnd], input);
				res.status(404).render(authorizeErrorModel);
			}
		}


	 // {'client_secret':'INSERT_CLIENT_SECRET_HERE','grant_type':'authorization_code','code':'aaaaa','client_id':'INSERT_CLIENT_ID_HERE','redirect_uri':'http://www.mysite.com'}
     //



	},
	authorize : function(req, res)
	{
		/*
			{
			'redirect_uri':'',   				optional
			'scope':'',							optional
			'state':'',							optional
			'response_type':'code',				'code' OR 'token'
			'client_id':'clientid',
			'client_secret':'clientSecret',
			'type':'web_server',				optional
			'code':'code1'
			}
		*/

		/*
			response:
			{error: "access_denied", error_description: "User denied." }
		*/


		var obj = {};
		var input = {};
		var keys = ['redirect_uri', 'scope', 'state', 'response_type', 'client_id', /*'client_secret',*/ 'type', 'code'];

		for(var i=0; i<keys.length; i++)
		{
			if(req.body[ keys[i] ] != null)
				input[ keys[i] ] = req.body[ keys[i] ];

			if(req.query[ keys[i] ] != null)
				input[ keys[i] ] = req.query[ keys[i] ];
		}

		if(input['client_id'] == null)
		{
			authorizeErrorModel.error_description = 'client_id is not valid.';
			console.tlog('error', 'client_id is not valid in oauth2::authorize.', ['model-oauth2', 'model', 'auth', req.rnd], authorizeErrorModel);
			res.status(404).render(authorizeErrorModel);
			return;
		}

		this.Auth.getByUsername(input['client_id'], function(doc)
		{
			if(doc != null && doc.username != null && doc.username == input['client_id'])
			{
				var new_key = getRandomCode(input['client_id']);

				this.Auth.addCodeByUsername(input['client_id'], new_key, function(errz, docz)
				{
					if(errz == null && docz != null && docz.code == new_key)
					{
						authorizeModel.code = new_key;

						if(input.redirect_uri != null && String(input.redirect_uri) != '' && String(input.redirect_uri).indexOf('http') == 0)
						{
							// console.log('redirect');
							res.redirect( input.redirect_uri + '?' + require('querystring').encode(authorizeModel));
							return;
						}

						res.render(authorizeModel);
					}else
					{
						authorizeErrorModel.error_description = 'error in code.';
						//errorModel.code = 4;
						//errorModel.error = 'sys';
						console.tlog('error', 'error in adding new code to db.', ['model-oauth2', 'model', 'mongo', req.rnd], input);
						res.status(404).render(authorizeErrorModel);
					}
				}.bind(this));
			}else
			{
				authorizeErrorModel.error_description = 'client_id is not valid.';
				console.tlog('error', 'client_id is not valid in oauth2::authorize.', ['model-oauth2', 'model', 'auth', req.rnd], authorizeErrorModel);
				res.status(404).render(authorizeErrorModel);
			}
		}.bind(this))
	}
}

function getRandomToken(h, key)
{
	var r = '';
	var t = new Date().getTime();
	t = t.toString(32); // 9 chars
	r += t;
	h = (h == null) ? 8 : h;
	while(h > 0)
	{
		var rnd = parseInt( Math.random() * 100000000000 );
		rnd = rnd.toString(32); // 7 chars
		r += rnd;
		h--;
	}

	r += '-';
	r += getUsersKey(key);

	return r;
}


function getRandomCode(key)
{
	var r = '';
	var t = new Date().getTime();
	t = t.toString(32); // 9 chars
	r += t;
	var h = 8;
	while(h > 0)
	{
		var rnd = parseInt( Math.random() * 100000000000 );
		rnd = rnd.toString(32); // 14 chars
		r += rnd;
		h--;
	}
	r += '-';
	r += getUsersKey(key);

	return r;
}

function getUsersKey(key)
{
	key = String(key).toLowerCase();
	key = key.split('');
	var n = '';
	while(key.length > 0)
	{
		var i = key.shift();
		if(char_maps[i] != null)
			n += String(char_maps[i]);
		else
			n += '00';
	}
	n = parseInt(n).toString(32);

	return n;
}

var char_maps =
{
	a : 10,
	b : 11,
	c : 12,
	d : 13,
	e : 14,
	f : 15,
	g : 16,
	h : 17,
	i : 18,
	j : 19,
	k : 20,
	l : 21,
	m : 22,
	n : 23,
	o : 24,
	p : 25,
	q : 26,
	r : 27,
	s : 28,
	t : 29,
	u : 30,
	v : 31,
	w : 32,
	x : 33,
	z : 34,
	'_' : 35,
	'.' : 36
}

