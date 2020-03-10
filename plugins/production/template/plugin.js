(function ($) {

    $.fn.template = function (options) {
        
        // This is the easiest way to have default options.
        var settings = $.extend({
            // These are the defaults.
        }, options);


        return this.each(function () {
            var me = $(this);


            me.empty();

            var html;
            if (options.tpl != undefined) {
                html = options.tpl;
            } else
                if (me.data().hasOwnProperty("tplid")) {
                    html = $('#' + me.data('tplid')).html();
                }

            if (options.data instanceof Array) {


                $.each(options.data, function (index, value) {
                    var t = html.replace(/\{\{(\w*)\}\}/g, function (m, key) { return value[key]; })
                    me.append(t);
                });
               

            } else {
                html = html.replace(/\{\{(\w*)\}\}/g, function (m, key) { return options.data[key]; })
                me.html(html);
               
            }
            return me;


        });


       



    };

} (jQuery));