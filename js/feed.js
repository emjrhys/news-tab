/* TODO: 
    add support for queries, country, and language
*/

$(document).ready(function() {
    var topics = {
        US: 'n',
        WORLD: 'w',
        ENTERTAINMENT: 'e',
        SPORTS: 's',
        SPOTLIGHT: 'ir',
        BUSINESS: 'b',
        HEALTH: 'm',
        TECHNOLOGY: 'tc',
        SCIENCE: 'snc',
        SCI_TECH: 't'
    };
    
    var DEFAULT_URL = "https://news.google.com/news?output=rss";
    var BG_COUNT = 10;
    
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
    
    function getFeedURL(topic) {
        var url = "https://news.google.com/news?pz=1&cf=all&topic=" + topic + "&output=rss";
        
        return url;
    }
    
    function chooseRandomBackground() {
        var n = Math.floor(Math.random() * BG_COUNT) + 1;
        $('.background-image').css('background-image', 'url(/backgrounds/' + n + '.jpg)');
    }
    
    $.ajax({
        type: 'GET',
        url      : 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(getFeedURL(topics.TECHNOLOGY)),
        dataType : 'json',
        success  : function (data) {
            if (data.responseData.feed && data.responseData.feed.entries) {
                console.log(data.responseData.feed.entries);
                $.each(data.responseData.feed.entries, function (i, e) {
                    var d = getPublishedDate(e);
                    var c = $(e.content);
                    var imgSrc = c.find('img').attr('src');
                    
                    var snippet = c.find('font[color="#6f6f6f"]:not([size])').parent().parent().next().next().text();
                    
                    var ar = $('<a></a>')
                        .attr('href', e.link)
                        .append('<h3>' + e.title + '</h3');
                        
                    
                    if (imgSrc != undefined)
                        ar.append('<p><img src="https:' + imgSrc + '"> ' + snippet + '</p>');
                    else
                        ar.append('<p>' + snippet + '</p>');
                    
                    ar.append('<span class="date">' + d + '</span>')
                    
                    $('#news').append(ar);
                });
                
                setTimeout(function() {
                    $('#news a').each(function(i) {
                        $(this).delay((i++) * 50).fadeTo(400, 1); 
                    });
                }, 100);
            }
        }
    });
    
    function init() {
        chooseRandomBackground();
    }
    
    init();
});

