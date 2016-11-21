$(document).ready(function(){
    $('.discount-footer').countdown('2015/07/20', function(event){
        event.strftime('%D %H:%M:%S');
        var days = event.strftime('%D') * 24,
            hours = Number(event.strftime('%H')) + days,
            hour0 = fatrans(hours.toString().substr(0, 1)),
            hour1 = fatrans(hours.toString().substr(1, 1)),
            min0 = fatrans(event.strftime('%M').substr(0, 1)),
            min1 = fatrans(event.strftime('%M').substr(1, 1)),
            sec0 = fatrans(event.strftime('%S').substr(0, 1)),
            sec1 = fatrans(event.strftime('%S').substr(1, 1));
        if(!hour1){
            var hour1 = hour0,
                hour0 = fatrans(String(0));
        }
        $('.timer-count .hour').text(hour0);
        $('.timer-count .hour1').text(hour1);
        $('.timer-count .min').text(min0);
        $('.timer-count .min1').text(min1);
        $('.timer-count .sec').text(sec0);
        $('.timer-count .sec1').text(sec1);
    });
});
function fatrans(s) {
  var fanum = {'1': '۱',
               '2': '۲',
               '3': '۳',
               '4': '۴',
               '5': '۵',
               '6': '۶',
               '7': '۷',
               '8': '۸',
               '9': '۹',
               '0': '۰'};
  var translate_re = /[1234567890]/g;
  return ( s.replace(translate_re, function(match) { 
    return fanum[match]; 
  }) );
}
