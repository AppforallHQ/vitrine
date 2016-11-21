jQuery(document).ready(function(){
    $(window).load(function(){
        if(iDeviceCheck()){
            setTimeout(function(){
                window.location = "https://PROJECT.ir/i/basic";
            }, 1000);
        }
    });
});
