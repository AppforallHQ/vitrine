$(document).ready(function(){
    $('#subscription .newsletter-box .newsletter-submit').on("click", function(e) {
        e.preventDefault();

        var email = $("#subscription .newsletter-box .newsletter-input").val();
        var loaderBox = $(".footer-box .loader-box");
        var messageBox = $(".footer-box .success");
        var errorBox = $("#subscription .error");

        $(".newsletter-box").fadeOut();
        loaderBox.fadeIn();

        $.ajax({
            url: '/panel/newsletter/subscribe/',
            type: 'post',
            data: {email: email},
            success: function(data) {
                loaderBox.fadeOut(function(){
                    messageBox.fadeIn();
                });
            },
            error: function(err) {
                loaderBox.fadeOut(function(){
                    errorBox.fadeIn();
                });
            }
        });

    });
});
