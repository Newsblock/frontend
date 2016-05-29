
(function () {
  var addthisScript = document.createElement('script');
  addthisScript.setAttribute('src', '//s7.addthis.com/js/300/addthis_widget.js#domready=1')
  document.body.appendChild(addthisScript);
  var addthis_config = addthis_config || {};
  addthis_config.pubid = 'ra-54d413a56139be0c';
})();

//-- Quantcast Tag -->
var _qevents = _qevents || [];
(function () {
  var elem = document.createElement('script');
  elem.src = (document.location.protocol == "https:" ? "https://secure" : "http://edge") + ".quantserve.com/quant.js";
  elem.async = true;
  elem.type = "text/javascript";
  var scpt = document.getElementsByTagName('script')[0];
  scpt.parentNode.insertBefore(elem, scpt);
})();

_qevents.push({qacct: "p-aaMptX6PjSV-c"});

(function ($) {

  //-- logic for GA to determine + track user reading page
  var scrolled = false;
  $(window).scroll(function () {
    if (!scrolled) {
      app.loadImages(99999); // loads below-fold images
    }
    scrolled = true;
  });

  setTimeout(function () {
    if (scrolled) {
      ga('send', 'event', 'user_reading', document.location.pathname, null);
    }
  }, 20 * 1000);

})(jQuery);
