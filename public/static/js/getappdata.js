var bytesToSize = function(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

var getAppinfo = function(appid){
    var button = $(".theapp-title .ibtn.downloadapp-link");
    var loader = $("#loader.the-loader");

    loader.show();
    $.getJSON("https://itunes.apple.com/lookup?id=" + String(appid) +"&callback=?",
              function (data) {
                  loader.fadeOut();
                  var res = data.results[0];
                  console.log(data);

                  data = {
                      a160 : res.artworkUrl60.replace('60x60bb.jpg', "160x160-86.jpg"),
                      prc : res.price ? String(res.price) + " $" : "Free",
                      cat : res.primaryGenreName,
                      rel : res.releaseDate ? new Date(res.releaseDate).toDateString() : "-",
                      ver : res.version,
                      siz : res.fileSizeBytes ? bytesToSize(res.fileSizeBytes) : "-",
                      dl : "-",
                      ven : res.sellerName,
                      nam : res.trackName,
                      scr : res.screenshotUrls,
                      desc : res.description.replace(/(?:\r\n|\r|\n)/g, '<br />')
                  };

                  var btntxt = data.prc === "Free"? "دانلود رایگان" : "خرید این برنامه با اپفورال";
                  button.find('span').html(btntxt);

                  for(var key in data){
                      var elem = $("#app-" + key);

                      if(key === "scr"){
                          for(var img in data.scr){
                              var li = "<li><img src='" + data.scr[img] +
                                      "' alt='" + data.nam + "'></li>";
                              elem.append(li);
                          }
                      } else if(key === "cat"){
                          var cat = data["cat"];
                          elem.attr('href', "/vitrine/cat/" + cat).html(cat);
                      } else if(key === "a160"){
                          elem.attr('src', data["a160"]);
                      } else {
                          elem.html(data[key]);
                      }
                  };
              });
};
