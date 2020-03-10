(function ($) {

    // Serialized the values of all Matching Elements to a Json Object.
    // Json Attribute Name is Taken from ID of the input

    $.fn.toJSON = function () {
        var result = {};
        this.each(function () {
            var elem = $(this);
            result[elem.attr('id')] = elem.val();
        });
        return result;
    };


} (jQuery));