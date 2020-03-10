// See https://baconipsum.com/2012/03/jquery-plugin/
(function ($) {

    $.fn.BaconIpsum = function (options) {

        var settings = $.extend({
            'type': 'meat-and-filler',
            'start_with_lorem': true,
            'paras': 3,
            'sentences': 0,
            'no_tags': false
        }, options);

        return this.each(function () {

            var $this = $(this);

            $.getJSON('https://baconipsum.com/api/?callback=?',
              {
                  'type': settings.type,
                  'start-with-lorem': settings.start_with_lorem ? 1 : 0,
                  'paras': settings.paras,
                  'sentences': settings.sentences
              }, function (baconGoodness) {
                  if (baconGoodness && baconGoodness.length > 0) {
                      for (var i = 0; i < baconGoodness.length; i++) {
                          //Check if the rendering should be with or without tags
                          if (settings.no_tags)
                              $this.append(baconGoodness[i]);
                          else
                              $this.append('<p>' + baconGoodness[i] + '</p>');
                      }
                  }
              });

        });

    };
})(jQuery);