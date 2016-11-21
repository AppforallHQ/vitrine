require('newrelic');
var configs = require('./lib/website-configs');
var retrieve_plans_from_users = require('./lib/plans')
var register_switcher = require('./lib/register_switcher')
retrieve_plans_from_users(function(plans) {
  process.env.PLANS_JSON = JSON.stringify(plans)
})

register_switcher.which(function(reg_type){
  process.env.REGISTER_TYPE = reg_type
  if (reg_type == "earlypage") {
    register_switcher.queue_length(function(len){
      process.env.QUEUE_LENGTH = len
    })
  }
})


var arguments = process.argv.splice(2);

configs.port = process.env.PORT || 8007

var webserver = require('./index.js');
var web = new webserver();
