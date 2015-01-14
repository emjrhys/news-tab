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
    
    function convertISOToDate(dateString) {
        var ISO_8601_re = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{3}))?(Z|[\+-]\d{2}(?::\d{2})?)$/,
            m = dateString.match(ISO_8601_re);

        var year = +m[1],
            month = +m[2],
            dayOfMonth = +m[3],
            hour = +m[4],
            minute = +m[5],
            second = +m[6],
            ms = +m[7], // +'' === 0
            timezone = m[8];

        if (timezone === 'Z') timezone = 0;
        else timezone = timezone.split(':'), timezone = +(timezone[0][0]+'1') * (60*(+timezone[0].slice(1)) + (+timezone[1] || 0));
        // timezone is now minutes

        // your prefered way to construct
        var myDate = new Date();
        myDate.setUTCFullYear(year);
        myDate.setUTCMonth(month - 1);
        myDate.setUTCDate(dayOfMonth);
        myDate.setUTCHours(hour);
        myDate.setUTCMinutes(minute + timezone); // timezone offset set here, after hours
        myDate.setUTCSeconds(second);
        myDate.setUTCMilliseconds(ms);
    }
    
    function getPublishedDate(e) {
        var pubDate = convertISOToDate(e.created_date);
        console.log(pubDate);
        var currTime = new Date();
        
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
        $('.background-image, .bg').css('background-image', 'url(/backgrounds/' + n + '.jpg)');
    }
    
    $.ajax({
        type: 'GET',
        url      : 'https://api.nytimes.com/svc/topstories/v1/home.json?api-key=23bf4766a699334df3eb41b9fb772ff7:19:67768797',
        dataType : 'json',
        success  : function (data) {
            console.log(data);
            if (data.results) {
                $.each(data.results, function (i, e) {
//                    var date = getPublishedDate(e);
                    var ar = $('<a class="item"></a>')
                        .attr('href', e.url);
                    
                    if (e.multimedia) {
                        var url = e.multimedia.slice(-1)[0].url;
                        ar.append('<img src="' + url + '">');
                    } else {
                        ar.addClass('noimage');
                    }
                    
                    var text = $('<article></article>')
                        .append('<h3>' + e.title + '</h3>')
                        .append('<p>' + e.abstract + '</h3>');
                    
                    ar.append(text);
                    $('#news').append(ar);
                });
                
                $('#news').imagesLoaded(function() {
                    $('#news').masonry({
                        transitionDuration: 0,
                        gutter: 20,
                        itemSelector: '.item'
                    });
                    
                    $('#news a').each(function(i) {
                        $(this).delay((i++) * 50).fadeTo(400, 1); 
                    });
                });
            }
        }
    });
    
    function init() {
        chooseRandomBackground();
    }
    
    init();
});

/* FOR USE WITH GOOGLE NEWS
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
*/

