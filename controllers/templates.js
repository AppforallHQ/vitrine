require('../lib/custom-date');

module.exports =
{
    get: function(req, res)
    {
        templateName = req.params.name;
        var fs = require('fs');
        fs.readFile('views/' + templateName + '.html', function read(err, data) {
            if (err) {
                console.log(err);
                res.send('');
                return;
            }
            template = data;
            res.send(template);
        });
    }
}


