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
