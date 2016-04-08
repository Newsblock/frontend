function loadImages(above) {
    var imgDefer = document.getElementsByTagName('img');
    for (var i=0; i<imgDefer.length; i++) {
        if(imgDefer[i].getAttribute('data-src')) {
            var elPos = imgDefer[i].getBoundingClientRect();
            if(elPos.top < above) {
                imgDefer[i].setAttribute('src',imgDefer[i].getAttribute('data-src'));
            }
        }
    }
}

//deferred loading
function init() {
    loadImages(1400); // loads above-fold images
}

$(document).ready(init());

window.NB = {
    readCookie:function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    },
    createCookie: function createCookie(name,value,days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
        }
        else var expires = "";
        document.cookie = name+"="+value+expires+"; path=/";
    },
    getHtml: function (data) {
        var tokens = data.split('|');
        var city = tokens[0]||'', icon = tokens[1]||'', temp=tokens[2]||'';
        var wHtml="<span class='weather--loc'>"+ city +"</span>"
            + "<i class='wi wi-"+ icon + "'></i>"
            + "<span class='weather--temp'>"+ temp +"<i class='wi-fahrenheit'></i></span>";
        return wHtml;
    },
    geoSuccess: function (pos) {
        var crd = pos.coords;
        var latLong =  Math.round(crd.latitude*100)/100 +','+ Math.round(crd.longitude*100)/100;
        console.log('Your cooridinates:', latLong);
        var options = {
            url:'/location/'+latLong,
            success: function (resp) {
                var city='', icon='', temp='';
                if(resp.city){
                    city=resp.city.replace(' Township','');
                }
                if(resp.forecast) {
                    icon=resp.forecast.icon||'';
                    temp=Math.floor(resp.forecast.temperature)||'';
                }
                var cookieVal = city +"|"+icon+"|"+temp;
                NB.createCookie('locationData', cookieVal, 0.3);
                $('#weather-info').html(NB.getHtml(cookieVal));
            },
            error: function (error) {
                console.log('## err', error.statusText);
            }
        };
        $.ajax(options);
    },
    geoError: function (err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
    },
    init: function () {
        var baseUrl = 'http://nvcdn.nbcnews.com'
        this.locationCookie = this.readCookie('locationData');
        if(this.locationCookie) {
            var html = this.getHtml(this.locationCookie);
            $('#weather-info').html(html);
        }
        else{
//                var geoOptions = {enableHighAccuracy: false, timeout: 6000, maximumAge: Infinity};
//                if (navigator.geolocation) {
//                        navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoError, geoOptions);
//                }
            var self = this;
            $.ajaxPrefilter(function(options) {
                if (options.crossDomain && jQuery.support.cors) {
                    options.url = 'http://nb-cors.herokuapp.com/' + options.url;
                }
            });

            $.ajax({
                url: baseUrl + '/_login/proxy?path=/servista/quova&ip=0',
                dataType: "xml",
                success: function(xml) {
                    var pos = {coords: { latitude:$(xml).find("Latitude").text(), longitude:$(xml).find("Longitude").text()}}
                    self.geoSuccess(pos);
                }
            });

        }
    }
};

$(function() {
    // GA click/touch tracking
    $(document).on('mousedown touchstart', 'a', function(event){
        var href = $(event.target).attr('href');
        if(href) {
            ga('send', 'event',  'anchorclick', href, null);
        }
    });

    $('.yt-link').on('click', function (e) {
        var hasTouch = 'ontouchstart' in window;
        if(!hasTouch) {
            e.preventDefault();
            var videoId = $(e.target).data('videoid');
            var width = 560, height = 480;//min: 560x315
            var iframe = '<iframe width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + videoId + '?autoplay=1" frameborder="0" allowfullscreen></iframe>';
            $('.yt-player-wrapper').addClass('is-open');
            $('#yt-player').html(iframe);
        }
    });

    $('.js-yt-close').on('mouseup', function () {
        $('#yt-player').html('');
        $('.yt-player-wrapper').removeClass('is-open');
    });

    //  NB.init();

//    window.doorbellOptions = { hideButton: true, appKey: 'Fe0ta22Pckzqc0CsZsiKDcPV0QxlnU8yA7ihXEffRLoAgZepDQ8Leg55W2NtHT72'};
//    (function(d, t) {
//      var g = d.createElement(t);g.id = 'doorbellScript';g.type = 'text/javascript';g.async = true;g.src = 'https://doorbell.io/button/745';(d.getElementsByTagName('head')[0]||d.getElementsByTagName('body')[0]).appendChild(g);
//    }(document, 'script'));

    var touchEventName =  ('ontouchstart' in window) ? 'touchstart':'click';
    $('.js-toggle-menu').on(touchEventName,function (e) {
        e.preventDefault();
        $(this).toggleClass('is-active');
        $('.nav--menu').toggleClass('is-open');
    });

    $('.js-modal-close').click(function () {
        $('.modal').removeClass('is-open');
    });

    $('.js-more-summary').click(function(){
        $(this).siblings('.entry--txt-summary-collapse').toggleClass('is-open');
        $(this).toggleClass('is-active');
    });

//    $('.doorbell-button').click(function () {
//      doorbell.show();
//    });

    $('#bookmarkme').click(function() {
        if (window.sidebar && window.sidebar.addPanel) { // Mozilla Firefox Bookmark
            window.sidebar.addPanel(document.title,window.location.href,'');
        } else if(window.external && ('AddFavorite' in window.external)) { // IE Favorite
            window.external.AddFavorite(location.href,document.title);
        } else if(window.opera && window.print) { // Opera Hotlist
            this.title=document.title;
            return true;
        } else { // webkit - safari/chrome
            $('.js-bookmark-alert').toggleClass('is-open');
        }
    });

    //-- logic for GA to determine + track user reading page
    var scrolled = false;
    $(window).scroll(function() {
        if(!scrolled) {
            loadImages(99999); // loads below-fold images
        }
        scrolled = true;
    });

    setTimeout(function () {
        if(scrolled) {
            ga('send', 'event',  'user_reading', document.location.pathname, null);
        }
    }, 20 * 1000);
});

// https://github.com/scdoshi/jquery-ajaxchimp
(function($){
    "use strict";$.ajaxChimp={responses:{"We have sent you a confirmation email":0,"Please enter a value":1,"An email address must contain a single @":2,"The domain portion of the email address is invalid (the portion after the @: )":3,"The username portion of the email address is invalid (the portion before the @: )":4,"This email address looks fake or invalid. Please enter a real email address":5},translations:{en:null},init:function(selector,options){$(selector).ajaxChimp(options)}};$.fn.ajaxChimp=function(options){$(this).each(function(i,elem){var form=$(elem);var email=form.find("input[type=email]");var label=form.find("label[for="+email.attr("id")+"]");var settings=$.extend({url:form.attr("action"),language:"en"},options);var url=settings.url.replace("/post?","/post-json?").concat("&c=?");form.attr("novalidate","true");email.attr("name","EMAIL");form.submit(function(){var msg;function successCallback(resp){if(resp.result==="success"){msg="We have sent you a confirmation email";label.removeClass("error").addClass("valid");email.removeClass("error").addClass("valid")}else{email.removeClass("valid").addClass("error");label.removeClass("valid").addClass("error");var index=-1;try{var parts=resp.msg.split(" - ",2);if(parts[1]===undefined){msg=resp.msg}else{var i=parseInt(parts[0],10);if(i.toString()===parts[0]){index=parts[0];msg=parts[1]}else{index=-1;msg=resp.msg}}}catch(e){index=-1;msg=resp.msg}}if(settings.language!=="en"&&$.ajaxChimp.responses[msg]!==undefined&&$.ajaxChimp.translations&&$.ajaxChimp.translations[settings.language]&&$.ajaxChimp.translations[settings.language][$.ajaxChimp.responses[msg]]){msg=$.ajaxChimp.translations[settings.language][$.ajaxChimp.responses[msg]]}label.html(msg);label.show(2e3);if(settings.callback){settings.callback(resp)}}var data={};var dataArray=form.serializeArray();$.each(dataArray,function(index,item){data[item.name]=item.value});$.ajax({url:url,data:data,success:successCallback,dataType:"jsonp",error:function(resp,text){console.log("mailchimp ajax submit error: "+text)}});var submitMsg="Submitting...";if(settings.language!=="en"&&$.ajaxChimp.translations&&$.ajaxChimp.translations[settings.language]&&$.ajaxChimp.translations[settings.language]["submit"]){submitMsg=$.ajaxChimp.translations[settings.language]["submit"]}label.html(submitMsg).show(2e3);return false})});return this}
})(jQuery);

function signupComplete(resp) {
    console.log('####', resp);
    if(resp.result ==='success') {
        $('#mce-EMAIL').hide();
        $('#mc-embedded-subscribe').hide();
    }
}

$('#mc-embedded-subscribe-form').ajaxChimp({
    url: '//getnewsblock.us10.list-manage.com/subscribe/post?u=8ad72db3d9bf3cc51a37d4fbe&id=68134db832',
    callback: signupComplete
});

//
var addthisScript = document.createElement('script');
addthisScript.setAttribute('src', 'http://s7.addthis.com/js/300/addthis_widget.js#domready=1')
document.body.appendChild(addthisScript)
var addthis_config = addthis_config||{};
addthis_config.pubid = 'ra-54d413a56139be0c';

//
//window.twttr = (function(d, s, id) {
//    var js, fjs = d.getElementsByTagName(s)[0], t = window.twttr || {};
//    if (d.getElementById(id)) return t;
//    js = d.createElement(s);
//    js.id = id;
//    js.src = "https://platform.twitter.com/widgets.js";
//    fjs.parentNode.insertBefore(js, fjs);
//    t._e = [];
//    t.ready = function(f) {
//        t._e.push(f);
//    };
//    return t;
//}(document, "script", "twitter-wjs"))

//-- Quantcast Tag -->
var _qevents = _qevents || [];
(function() {
    var elem = document.createElement('script');
    elem.src = (document.location.protocol == "https:" ? "https://secure" : "http://edge") + ".quantserve.com/quant.js";
    elem.async = true;
    elem.type = "text/javascript";
    var scpt = document.getElementsByTagName('script')[0];
    scpt.parentNode.insertBefore(elem, scpt);
})();
_qevents.push({qacct:"p-aaMptX6PjSV-c"});

function ampSizer() {
    if($) {
        var width = $('.article').width();
        $('.js-amp-iframe').css('width', width).css('height', $(window).height());
        $('.js-amp-btn').css('width', width);
    }
}

$(function () {
    ampSizer();
    $(window).resize(ampSizer);
});
