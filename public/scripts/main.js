var app = app || {};

app.loadImages = function loadImages(above) {
  var imgDefer = document.getElementsByTagName('img');
  for (var i = 0; i < imgDefer.length; i++) {
    if (imgDefer[i].getAttribute('data-src')) {
      var elPos = imgDefer[i].getBoundingClientRect();
      if (elPos.top < above) {
        imgDefer[i].setAttribute('src', imgDefer[i].getAttribute('data-src'));
      }
    }
  }
};

loadImages = app.loadImages;

$(function () {
  app.loadImages(1400);

  // GA click/touch tracking
  $(document).on('mousedown touchstart', 'a', function (event) {
    var href = $(event.target).attr('href');
    if (href) {
      ga('send', 'event', 'anchorclick', href, null);
    }
  });

  $('.yt-link').on('click', function (e) {
    var hasTouch = 'ontouchstart' in window;
    if (!hasTouch) {
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

  var touchEventName = ('ontouchstart' in window) ? 'touchstart' : 'click';
  $('.js-toggle-menu').on(touchEventName, function (e) {
    e.preventDefault();
    $(this).toggleClass('is-active');
    $('.nav--menu').toggleClass('is-open');
  });

  $('.js-modal-close').click(function () {
    $('.modal').removeClass('is-open');
  });

  $('.js-more-summary').click(function () {
    $(this).siblings('.entry--txt-summary-collapse').toggleClass('is-open');
    $(this).toggleClass('is-active');
  });


  $('#bookmarkme').click(function () {
    if (window.sidebar && window.sidebar.addPanel) { // Mozilla Firefox Bookmark
      window.sidebar.addPanel(document.title, window.location.href, '');
    } else if (window.external && ('AddFavorite' in window.external)) { // IE Favorite
      window.external.AddFavorite(location.href, document.title);
    } else if (window.opera && window.print) { // Opera Hotlist
      this.title = document.title;
      return true;
    } else { // webkit - safari/chrome
      $('.js-bookmark-alert').toggleClass('is-open');
    }
  });

});
