//For Options See
//  http://davidshimjs.github.io/qrcodejs/
// qrcode.js or qrcode.min.js needs to be included on Page
"use strict";

(function ($) {

    $.fn.qrCode = function (options) {
        var that = this;
        new QRCode(that[0], options);       
        return that;
    };

} (jQuery));