(function ($) {

    $.fn.toDynamicSelect = function (options) {

        var that = this;
       
        that.hide();
        
        // This is the easiest way to have default options.
        var settings = $.extend({
            // These are the defaults.
        }, options);

        var selectString = "<select";

        if (settings.class != undefined) {
            selectString += ' class="' + settings.class + '"';
        }
        if (settings.id != undefined) {
            selectString += ' id="' + settings.id + '"';
        }
        selectString += '>';


        var value = '';

        for (i = 0; i < settings.options.length; i++) {
            var current = settings.options[i];
            selectString += '<option value="' + current.value + '"';
            if (current.selected != undefined && current.selected) {
                selectString += ' selected="selected" ';
                value = current.value;
            }
            selectString += '>' + current.text + '</option>';

        }

        that.val(value);


        var select = $(selectString +
            '</select>');
        select.change(function () {
            that.val(this.value);
        })


        that.after(select);
        return that;
    };

} (jQuery));