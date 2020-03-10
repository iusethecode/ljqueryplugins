(function ($) {

    $.fn.spin = function (options) {
        this.addClass('spinning');
        return this;
    };

    $.fn.unspin = function (options) {
        this.removeClass('spinning');
        return this;
    };



})(jQuery);