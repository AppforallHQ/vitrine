var cached = false
var cache
var url = 'http://USERS/register_type.json'
var http = require('http')
var request = require('request')
var fs = require('fs');
var default_reg_type = 'register';

var register_switcher = {
    which: function(callback) {
	try{
	    var data = String(fs.readFileSync('./lib/reg_type.txt')).replace(/\s/g, "");
	} catch(e) {
	    var data = default_reg_type;
	}
	var reg_type = data == 'register' || data == 'earlypage' ? data : 'register';

	callback(reg_type);
    },
    queue_length: function(callback) {
        request.get({
            url: 'http://EARLYPAGE/api/landing',
            auth: {
              'user' : 'PROJECT',
              'pass' : ''
            }
          },
          function(err,res,body){
            var data = JSON.parse(body);
            callback(parseInt(data['query_length'])+1250);
          })
    }
}

module.exports = register_switcher
