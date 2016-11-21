var narsic = {};

narsic.generatePassword = function(password) {
    var crypto = require('crypto');
    var md5sum = crypto.createHash('md5');
    var hs = md5sum.update(password);

    password = md5sum.digest('hex').toLowerCase();
    return password;
}

narsic.generateRandomString = function(length, chars) {
    length = length ? length:12;
    chars = chars ? chars:'aA#!';
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    var result = '';
    for (var i = 0; i < length; i++) {
        result += mask[Math.round(Math.random() * (mask.length - 1))];
    }
    return result;
}

narsic.renderAccessDennied = function (req, res) {
    var message = {error: true, message: 'Access Denied'};
    res.render(message);
}

narsic.arrayUnique = function (array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

narsic.ln2br = function(str) {
    result = "<p>" + str + "</p>";
    result = result.replace(/\r\n\r\n/g, "</p><p>").replace(/\n\n/g, "</p><p>");
    result = result.replace(/\r\n/g, "<br />").replace(/\n/g, "<br />");
    return result;
}

module.exports = narsic;
