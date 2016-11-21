// Experimental sort function
// It will show non-free apps and apps in PROJECT first

var appRate = function(app){
    if(app.PROJECT && app.prc !== "Free"){
        return 3;
    } else if (app.PROJECT){
        return 2;
    } else if (!app.PROJECT && app.prc !== "Free"){
        return 1;
    } else {
        return 0;
    }
};

var sort = function(apps){
    return apps.sort(function(a, b){
        return appRate(b) - appRate(a);
    });
};

module.exports = sort;
