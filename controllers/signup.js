var util = require('util')
var http = require('http')
var plans = JSON.parse(process.env.PLANS_JSON)

var apps = require('./apps')

module.exports = {
  complete: function (req, res) {
    apps.Data = this.Data;
    var plan_id = req.params.plan_id
    var plan;
    for (var i in plans) {
      if(plans[i].id == plan_id)
        plan = plans[i]
    }

    apps._all(req, function(result) {
      app = result.data;
      info = result.info;

      this.Data.get('apps', 'getAllCat', null, 60, function(result) {
        cat = result;

        var res_data = {
          register: true,
          apps: app,
          cats: cat,
          info: info,
          plan: plan,
          partials: {
            'slide_content': 'slide_4',
            'vitrine': 'vitrin',
            'pjax_content': 'list_of_apps'
          }
        }

        res.render('layout', res_data)
      })
    }.bind(this))
  },

  failure: function (req, res) {
    apps.Data = this.Data;
    var plan_id = req.params.plan_id
    var plan;
    for (var i in plans) {
      if(plans[i].id == plan_id)
        plan = plans[i]
    }

    apps._all(req, function(result) {
      app = result.data;
      info = result.info;

      this.Data.get('apps', 'getAllCat', null, 60, function(result) {
        cat = result;

        var res_data = {
          register: true,
          apps: app,
          cats: cat,
          info: info,
          plan: plan,
          partials: {
            'slide_content': 'slide_4_failure',
            'vitrine': 'vitrin',
            'pjax_content': 'list_of_apps'
          }
        }

        res.render('layout', res_data)
      })
    }.bind(this))
  }

}
