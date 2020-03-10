/**
* Parses a Date from a Rest Call
**/
function (date) {
    var h = date.substring(date.indexOf(' ') + 1, date.length);
    var input = date.substring(0, date.indexOf(' '));
    var parts = input.split('/');
    var hours = h.split(':');
    return new Date(parts[2], parts[1] - 1, parts[0], hours[0], hours[1]); // Note: months are 0-based
}