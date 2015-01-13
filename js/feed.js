$(document).ready(function() {
    var FEED_URL = "https://news.google.com/news?pz=1&cf=all&topic=tc&output=rss";
    
    $.ajax({
        type: 'GET',
        url      : 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(FEED_URL),
        dataType : 'json',
        success  : function (data) {
            if (data.responseData.feed && data.responseData.feed.entries) {
//                $.each(data.responseData.feed.entries, function (i, e) {
//                    console.log("------------------------");
//                    console.log("title         :    " + e.title);
//                    console.log("snippet       :    " + e.contentSnippet);
//                    console.log("publishedDate :    " + e.publishedDate);
//                });
                console.log(data.responseData.feed.entries);
                $.each(data.responseData.feed.entries, function (i, e) {
                    var c = e.content;
//                    console.log($(c).find("img").attr("src"));
                    $('#news').append("<img src=\"https:" + $(c).find("img").attr("src") + "\">");
                });
            }
        }
    });
});

/*  topics:
    n - us?
    w - world
    e - entertainment
    s - sports
    ir - spotlight
    b - business
    m - health
    tc - technology
    snc - science 
    t - sci/tech
*/