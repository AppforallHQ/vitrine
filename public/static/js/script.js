var getCookie = function(name){
    cookie = document.cookie;
    if(cookie.length > 0){
        var start = cookie.indexOf(name + "=");
        if(start !== -1){
            start = cookie.indexOf('=', start) + 1;
            end = cookie.indexOf(';', start);
            if(end === -1){
                end = cookie.length;
            }
            return unescape(cookie.substring(start, end));
        }

    }
    return null;
};

var openInPROJECT = function(link){
    if(getCookie('PROJECT') != link && iDeviceCheck()){
        document.cookie="PROJECT=" + link;
        setTimeout(function(){
            window.location = window.location.href;
        }, 25);
        window.location= link;
    }
};

var fadeOut = function(elem){
    setTimeout(function(){
       elem.fadeOut();
    }, 5000);
};

jQuery(document).ready(function(){
    //start - english num convert to persian num //
  $('close').click(function(){
    $('#bizzbar').slideUp(500)
  })
    var defaultSettings="fa";(function(e){e.fn.persiaNumber=function(t){function r(e,t){e.find("*").andSelf().contents().each(function(){if(this.nodeType===3&&this.parentNode.localName!="style"&&this.parentNode.localName!="script"){this.nodeValue=this.nodeValue.replace(this.nodeValue.match(/[0-9]*\.[0-9]+/),function(e){return e.replace(/\./,",")});this.nodeValue=this.nodeValue.replace(/\d/g,function(e){return String.fromCharCode(e.charCodeAt(0)+t)})}})}if(typeof t=="string"&&t.length>0)defaultSettings=t;var n=1728;if(t=="ar"){n=1584}window.persiaNumberedDOM=this;r(this,n);e(document).ajaxComplete(function(){var e=window.persiaNumberedDOM;r(e,n)})}})(jQuery);origParseInt=parseInt;parseInt=function(e){e=e&&e.toString().replace(/[\u06F0\u06F1\u06F2\u06F3\u06F4\u06F5\u06F6\u06F7\u06F8\u06F9]/g,function(e){return String.fromCharCode(e.charCodeAt(0)-1728)}).replace(/[\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669]/g,function(e){return String.fromCharCode(e.charCodeAt(0)-1584)}).replace(/[\u066B]/g,".");return origParseInt(e)};origParseFloat=parseFloat;parseFloat=function(e){e=e&&e.toString().replace(/[\u06F0\u06F1\u06F2\u06F3\u06F4\u06F5\u06F6\u06F7\u06F8\u06F9]/g,function(e){return String.fromCharCode(e.charCodeAt(0)-1728)}).replace(/[\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669]/g,function(e){return String.fromCharCode(e.charCodeAt(0)-1584)}).replace(/[\u066B]/g,".");return origParseFloat(e)}
    $('.fa').persiaNumber(); 

    //for show and close login-box
    $('#login_button').click(function() {
        $('#lightbox').show().delay(100).queue(function(next){
            $('#lightbox').addClass("show");
            next();
        });
        if ($(window).width() < 780) {
            $('.page-header').removeClass("openmenu").delay(400).queue(function(next){
                $('#menu_nav,#menu_darkbg').hide();
                next();
            });
        }
    });
    $('#lightbox_close,#lightbox_bg').click(function() {
        $('#lightbox').removeClass("show").delay(200).queue(function(next){
            $('#lightbox').hide();
            next();
        });
    });


    //for scroll with animate
    $(document).ready(function(){
        $('a[href^="#"]').on('click',function (e) {
            e.preventDefault();
            var target = this.hash;
            var $target = $(target);
            $('html, body').stop().animate({
                'scrollTop': $target.offset().top
            }, 900, 'swing', function () {
                window.location.hash = target;
            });
        });
    });


    //for menu-toggle and show/hide menu
    $('#menu_toggle').click(function() {
        if ($('#menu_nav').css('display') == 'none') {
            $('#menu_nav,#menu_darkbg').show().delay(200).queue(function(next){
                $('.page-header').addClass("openmenu");
                next();
            });
        }
        else {
            $('.page-header').removeClass("openmenu").delay(400).queue(function(next){
                $('#menu_nav,#menu_darkbg').hide();
                next();
            });
        }
    });
    $('#menu_darkbg').click(function() {
        $('.page-header').removeClass("openmenu").delay(400).queue(function(next){
            $('#menu_nav,#menu_darkbg').hide();
            next();
        });
    });
    var eventFired = 0;
    $(window).on('resize', function() {
        if (!eventFired) {
            if ($(window).width() > 780) {
                $('.page-header').removeClass("openmenu");
                $('#menu_darkbg').hide();
                $('#menu_nav').show();
                $('.category-list').show();
            } else {
                $('.page-header').removeClass("openmenu");
                $('#menu_darkbg').hide();
                $('#menu_nav').hide();
                $('.category-list').hide();
            }
        }
    });

    //for show screenshot in aap page
    $('.apppage-tab .show-text').click(function() {
        $('.apppage-tab .app-english').show();
        $('.apppage-tab .app-screenshot').hide();
        $(this).addClass("active");
        $('.apppage-tab .show-shot').removeClass("active");
    });
    $('.apppage-tab .show-shot').click(function() {
        $('.apppage-tab .app-screenshot').show();
        $('.apppage-tab .app-english').hide();
        $(this).addClass("active");
        $('.apppage-tab .show-text').removeClass("active");
    });


    $("form.search-form").on('submit', function(e){
        if(!$(this).children('.search-input').val()){
            e.preventDefault();
        };
    });

    //for category toggle
    $('.category-title').click(function() {
        if ($(window).width() < 780) {
            $('.category-list').toggle();
        }
    });

    //for show lightbox in download PROJECT
    $('#dirdl').on("click", function(e) {
        if(iDeviceCheck()){
            // window.location = "http://PROJECT.ir/i/basic";
            window.location = "http://www.PROJECT.ir/help/";
        } else {
            e.preventDefault();
            $('#downapplight').show().delay(100).queue(function(next){
                $('#downapplight').addClass("show");
                next();
            });

        }
    });

    $('#downapp_close,#downapp_bg').click(function() {
        $('#downapplight').removeClass("show").delay(200).queue(function(next){
            $('#downapplight').hide();
            next();
        });
    });

    $(".sms-form button.submit").on('click', function(){
        var error = $('#downapplight .the-box .error');
        var success = $('#downapplight .the-box .success');
        var mobile = $('#downapplight .sms-form #mobile-number').val();
        var loader = $('#downapplight .the-box #loader');

        var smsForm = $('#downapplight .sms-form');
        var helpLink = $('#downapplight .helplink');
        var oricon = $('#downapplight .or');

        if(mobile.match(/09[0-9]{9}/ig)){
            loader.fadeIn();
            $.ajax({
                url: '/panel/sms_basic/',
                type: 'post',
                data: {mobile: mobile},
                success: function(data) {
                    if(data.done == true){
                        smsForm.hide();
                        oricon.hide();
                        helpLink.show();
                        loader.fadeOut();
                        success.html("درخواست شما با موفقت ثبت شد.").fadeIn();
                        fadeOut(success);
                    } else {
                        loader.fadeOut();
                        error.html("تعداد درخواست نصب از حد مجاز گذشته..").fadeIn();
                        fadeOut(error);
                    }
                },
                error: function(err) {
                    loader.fadeOut();
                    error.html("تعداد درخواست نصب از حد مجاز گذشته. لطفا مجددا تلاش کنید.").fadeIn();
                    fadeOut(error);
                }
            });
        } else {
            error.html("شماره موبایل نا معتبر است").fadeIn();
            fadeOut(error);
        }
    });

    // App suggestion
    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };
    $(".search-error div.form form").submit(function(event) {
        var target = $(this);
        var emailAddress = $('.search-error div.form form input[type="email"]').val();
        var isValidEmail = validateEmail(emailAddress);

        event.preventDefault();

        if(!user_data.loggedIn && $("#newsletter-offer").is(':checked') && isValidEmail) {
            $.ajax({
                url: '/panel/newsletter/subscribe/',
                type: 'post',
                data: {email: emailAddress}
            });
        }

        if(!user_data.loggedIn && isValidEmail) {
            analytics.identify(emailAddress);
        }

        $.ajax({
            url: "http://API/apps/proposal/",
            type: "get",
            data: {
                "email": user_data.loggedIn ? user_data.email : emailAddress,
                "app": $(".search-error div.form form input[type='text']").val()
            }
        }).always(function(){
            target.fadeOut(function(){
                $('.search-error .success').fadeIn();
            });
        });
        return false;
    });

    var set_avatar = function(){
        $(".user-menu .userislogin .user-avatar").attr('src', user_data.avatar);
    };
    try {
 	      if(user_data.loggedIn) {
            $('.only_loggedin').show();
            $('.only_loggedout').hide();
            set_avatar();
	      }
	      else {
		        $('.only_loggedin').hide();
		        $('.only_loggedout').show();
	      };
    } catch(e){
        console.log('user error');
    }

});

$(document).ready(function(){
    $('.faq-title').click(function() {
        $(this).parent('.question').toggleClass('open').children('.faq-answer').slideToggle();
    });
});

$('.movebg').mousemove(function(e){
    var amountMovedX = (e.pageX * 1 / 15);
    var amountMovedY = (e.pageY * 1 / 10);
    $(this).css('background-position', amountMovedX + 'px ' + amountMovedY + 'px');
});

//for load tahoma font befor IRANSans-web
(function( w ){
    if( w.document.documentElement.className.indexOf( "fold" ) > -1 ){
        return;
    }
    var fontA = new w.FontFaceObserver( "IRANSans-web", {
        weight: 300
    });
    var fontB = new w.FontFaceObserver( "IRANSans-web", {
        weight: 500
    });
    var fontC = new w.FontFaceObserver( "IRANSans-web", {
        weight: 'normal',
    });
    w.Promise
        .all([fontA.check(), fontB.check(), fontC.check()])
        .then(function(){
            w.document.documentElement.className += "fold";
        });
}( this ));
