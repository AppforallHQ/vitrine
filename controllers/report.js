require('../lib/custom-date');
apps = require('./apps');

var request = require('request');
var captcha = require('node-captcha');
var Analytics = require('analytics-node');
var session = require('express-session');
var validator = require('valid-url');

var analytics = new Analytics('');

module.exports = {
  report: function(req, res) {
    success=false;
    error=false;
    if(req.method=="POST")
    {
      
      if (req.body.captcha && req.body.captcha == req.session.captcha)
          {
        analytics.identify({userId : 'PROJECT_Admin', traits : {'email':'admin@PROJECT.ir'}});
        analytics.track({userId : 'PROJECT_Admin',event : 'request_remove_app',properties:{
          'price' : (req.body.price == "free" ? 'Free' : 'Non-Free'),
          'PROJECT_link' : (req.body.PROJECT_link),
          'iTunes_link' : (req.body.iTunes_link),
          'website_link' : (req.body.website_link),
          'bundleID' : (req.body.bundleId),
          'more_data' : req.body.more_data
        }})
        success = true
      }
      else
      {
        error = true
      }
    }
    res_data = {success:success,error:error}
    res.render('report',res_data)
  },
  
  captcha: function(req,res) {
    captcha({fileMode : 2,size : 5,noise : false,height : 36},function(text, data){
        req.session.captcha = text
        res.end(data);
      });
  }
  
}


