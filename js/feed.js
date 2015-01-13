$(document).ready(function() {
    // https://news.google.com/news?pz=1&cf=all&topic=w&output=rss
    var FEED_URL = "https://news.google.com/news?output=rss";
    
//    $(function() {
//        $('#news article').each(function(i) {
//            $(this).delay((i++) * 500).fadeTo(1000, 1); 
//        });
//    });
    
    function getPublishedDate(e) {
        var currTime = new Date();
        var pubDate = new Date(e.publishedDate);
        
        var str;
        
        var elapsedTime = Math.floor((currTime.getTime() - pubDate.getTime())/60000);
        if (elapsedTime < 60)
            str = elapsedTime + " minutes ago";
        else if (elapsedTime/1440 > 1)
            str = elapsedTime/1440 + " days ago";
        else {
            elapsedTime = Math.floor(elapsedTime/60);
            str = elapsedTime;
            if (elapsedTime == 1)
                str += " hour ago";
            else
                str += " hours ago";
        }
        
        return str;
    }
    
    $.ajax({
        type: 'GET',
        url      : 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(FEED_URL),
        dataType : 'json',
        success  : function (data) {
            if (data.responseData.feed && data.responseData.feed.entries) {
                console.log(data.responseData.feed.entries);
                $.each(data.responseData.feed.entries, function (i, e) {
                    var d = getPublishedDate(e);
                    var c = $(e.content);
                    var imgSrc = c.find('img').attr('src');
                    
                    var ar = $('<a></a>')
                        .attr('href', e.link)
                        .append('<h3>' + e.title + '</h3')
                        .append('<span class="date">' + d + '</span>');
//                        .append('<p>' + e.contentSnippet + '</p>')
                    
                    if (imgSrc != undefined)
                        ar.append('<img src="https:' + imgSrc + '">');
                    
                    $('#news').append(ar);
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