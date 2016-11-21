jQuery(document).ready(function(){
    var plan_elem = $("#registeration_plan");
    var plan_desc = {"1": "یک ماهه",
                     "2": "سه ماهه",
                     "3": "شش ماهه"};


    // Function definitions
    var check_active_plan = function(){
        var plan = plan_elem.attr('value');

        if(plan && validate_plan(plan)){
            switch_section(2);
            select_plan(plan);
        } else {
            switch_section(1);
        }
    };

    var switch_section = function(block_number){
        if( [1, 2, 3].indexOf(block_number) === -1 ){
            return;
        }
        var section = $('.signup-block .signup-sect' + block_number);
        var title = $('.signup-block .signup-title .stagettl' + block_number);
        section.show().siblings().not('.signup-title').hide();

        if(block_number === 1){
            title.addClass("active").show().siblings().hide();
        } else {
            title.addClass("active").show().siblings().show().not(".title-arrow").removeClass("active");
        }

    };

    var select_plan = function(plan){
        if(validate_plan(plan)){
            var t = "<span>تومان</span>";
            var plan_data = $("#plansubmit-" + plan);
            plan_elem.attr('value', plan);
            $(".changplan-title .selected .d").html(plan_desc[plan]);

            $(".thereceipt #show-plane-name").html(plan_desc[plan_data.attr('data-plan')]);
            $(".thereceipt #show-plane-price").html(plan_data.attr('data-price') + t);
            $(".thereceipt #show-promo").html("0" + t);
            $(".thereceipt #show-payment").html(plan_data.attr('data-price') + t);
        }
    };

    var validate_plan = function(plan){
        var valid_plans = ["1", "2", "3"];
        if(valid_plans.indexOf(plan) != -1){
            return true;
        }
        return false;
    };

    var register = function(data){
        var loader = $("#loader.the-loader");
        loader.fadeIn();
        $.ajax({
            type: 'POST',
            data: data,
            url: "/signup/",
            dataType: 'json'
        }).success(function (data) {
            if(data.promo){
                display_promo_data(data.promo);
            }

            $('.payment-box .gotopay').attr('href', data.active_invoice_payment_url['mellat']);
            switch_section(3).then(function(){
                loader.fadeOut();
            });
        }).error(function(xhr) {
            var errors = $.parseJSON(xhr.responseText);
            var container = $("#register_form .error");

            $.each(errors, function(k, v) {
                container.children().first().append("<li>" + k + ": " + v + "</li>");
            });

            container.show();
            fadeOutElem(container);
            loader.fadeOut();
        });
    };

    var display_promo_data = function(data){
        $("#promo_code_enter form").hide();
        $("#promo_code_enter .success .partner").html(data.partner);
        $("#promo_code_enter .success .final_price").html(data.final_price);
        $("#promo_code_enter .success").fadeIn();

        var price = parseInt($("#show-orig-price").text());
        var final = parseInt(data.final_price);
        var discount = price - final;

        var curr = "<span>تومان</span>";
        $("#show-discount").html(discount+curr);
        $("#show-price").html(final+curr) ;

        if(final == 0){
            $('.signup-sect3 .payment-box .box-title').html("بر اساس کد تخفیفی که وارد کرده‌اید نیازی به پرداخت آنلاین ندارید. لطفا مراحل ثبت نام را ادامه دهید.");
            $('.signup-sect3 .payment-box .gotopay').html("ادامه");
        }
    };

    var apply_promo = function(data){
        $.ajax({
            type: 'POST',
            data: data,
            url: "/panel/apply_promo/",
            dataType: 'json'
        }).success(function (data) {
            if(data.success) {
                $(".error").hide();
                display_promo_data(data);
            }
            else {
                $(".error").html(data.message);
                $(".error").fadeIn();
            }

        }).error(function (xhr) {
            $(".error").fadeIn();
        });
    };

    var fadeOutElem = function(elem){
        setTimeout(function(){
	          elem.fadeOut();
        },5000);
    };

    // Do not let user to signup without aggriment to TOS
    $('.signup-sect3 .payment-box .gotopay').on('click', function(e){
        if(!$('div.termsofuse input').prop('checked')){
            e.preventDefault();
            $('div.termsofuse').addClass('error');
        }
    });

    var email_check = function(email){
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
    };

    // An static variable to check email address if it's not validated before
    var last_username = "";
    var verify_username = function(username){
        if(last_username === username){
            return true;
        }
        $.ajax({
            type: "post",
            data: {'email': username},
            url: "/panel/email_ajax/",
            dataType: 'json'
        }).success(function(result){
            if(result.success){
                last_username = username;
                return true;
            } else {
                return false;
            }
        }).error(function(){
            return false;
        });
    };

    var errorField = function(field){
        field.removeClass('success').addClass('error');
    };

    var successField = function(field){
        field.removeClass('error').addClass('success');
    };

    var formCheck = function(username, first_name, mobile_number, password){
        var user = username.val();
        var name = first_name.val();
        var mobile = mobile_number.val();
        var pass = password.val();

        var user_chk = email_check(user) && verify_username(user) ? true : false;
        var name_chk = name.length >= 3 ? true : false;
        var mobi_chk = mobile.length == 11 && mobile[0] == 0 ? true : false;
        var pass_chk = pass.length >= 8 ? true : false;

        if(user_chk){
            successField(username);
        } else if(user.length > 0) {
            errorField(username);
        }

        if(name_chk){
            successField(first_name);
        } else if(name.length > 0) {
            errorField(first_name);
        }

        if(mobi_chk){
            successField(mobile_number);
        } else if(mobile.length > 0) {
            errorField(mobile_number);
        }
        if(pass_chk){
            successField(password);
        } else if(pass.length > 0) {
            errorField(password);
        }

        if(user_chk, name_chk, mobi_chk, pass_chk){
            $('#register_form .ibtn.reg-submit').attr('disabled', false);
        } else {
            $('#register_form .ibtn.reg-submit').attr('disabled', true);
        }
    };

    // Do real jobs
    check_active_plan();

    $('submit.planbutton').on('click', function(){
        var plan = $(this).attr('data-plan');
        if(plan === "0"){
            console.log("Free plan");
        } else {
            select_plan(plan);
            switch_section(2);
        }
    });

    $(".changplan-title .change").on('click', function(){
        switch_section(1);
    });

    $("#register_form").on("submit", function(e){
        e.preventDefault();

        var data = $(this).serialize();
        register(data);
    });

    $(".promo-box .promo-form").on('submit', function(e){
        e.preventDefault();

        var data = $(this).serialize();
        apply_promo(data);
    });

    $("#register_form input").bind('keyup', function(){
        var username = $("#register_form input[name='username']");
        var first_name = $("#register_form input[name='first_name']");
        var mobile_number = $("#register_form input[name='mobile_number']");
        var password = $("#register_form input[name='password']");
        formCheck(username, first_name, mobile_number, password);
    });
});
