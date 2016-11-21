request = require('request')
var Analytics = require('analytics-node')
var analytics = new Analytics("")

module.exports = {
  register: function(req, res) {
    if (req.xhr) {
      if (req.param('email')) {
        request.get({
              url: 'http://EARLYPAGE/api/welcome',
              auth: {
                'user' : 'PROJECT',
                'pass' : ''
              },
              form: {
                'email' : req.param('email'),
                'referrer' : req.param('referrer'),
                'current_adopter_id' : req.cookies.current_adopter_id,
                'share_url' : 'http://www.PROJECT.ir/?ref_id={{ref_id}}'
              }
            },
            function(err,head,body){
              
              var res_data = {
                queue_length : process.env.QUEUE_LENGTH
              }
              
              var data = JSON.parse(body);
              if (data['error']) {
                res_data['landing'] = true
                res_data['error'] = true
                res_data['referrer'] = req.param('referrer')
                res.render('earlypage',res_data);
              }
              else{
                res.cookie('current_adopter_id',data['current_adopter_id']);
                process.env.QUEUE_LENGTH = parseInt(process.env.QUEUE_LENGTH)+1
                res_data['welcome']=true
                res_data['share_url']=data['share_url']
                res_data['encoded_share_url']=data['encoded_share_url']
                analytics.identify({
                  userId : "Early-"+data['current_adopter_id'],
                  traits : {
                    "email":req.param('email'),
                    "referrer":(req.param('referrer')?req.param('referrer'):'direct'),
                  }
                })
                analytics.track({
                  userId : "Early-"+data['current_adopter_id'],
                  event : "early_page_signup",
                  properties : {
                    "email":req.param('email'),
                    "queue_length":process.env.QUEUE_LENGTH
                  }
                })
                res.render('earlypage',res_data);
              }
            })
      }
    }
    else
    {
      error = require('./error')
      error.index(req,res)
    }
  }
}
