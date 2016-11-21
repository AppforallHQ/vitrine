var cached = false
var cache
var url = 'http://localhost:3000/panel/plans.json'
var http = require('http')

var retrieve_plans_from_users = function(callback) {

  if (cached)
    return callback(cached)

  http.get(url, function(res) {
    var body = ''

    res.on('data', function(chunk) {
      body += chunk
    })

    res.on('end', function() {
      cached = true
      var json_resp = JSON.parse(body)
      json_resp.sort(function(a, b) {
          return a.price - b.price
      })

      var i = 1;
      var FQDNorsuh_daily_rate = null
      for (var plan_id in json_resp) {
        var plan = json_resp[plan_id];

        // We use first plan's daily rate as basis
        if (!FQDNorsuh_daily_rate) {
          FQDNorsuh_daily_rate = plan["price"]/plan["period_length"]
        }

        plan["orig_price"] = (plan["period_length"]*FQDNorsuh_daily_rate)
        plan["discount"] = (plan["orig_price"]-plan["price"])
        plan["free"] = plan["discount"]/FQDNorsuh_daily_rate
        plan["free"] = plan["free"] > 0 ? plan["free"] : null
        plan["iter"] = i++
        plan["period_length"] /= 30
        plan["price_unformatted"] = plan["price"]
        plan["price"] /= 1000

        if (plan["id"] == 2)
            plan["recommended"] = true
      }

      cache = json_resp
      callback(cache)
    })
  }).on('error', function(e) {})
}

module.exports = retrieve_plans_from_users
