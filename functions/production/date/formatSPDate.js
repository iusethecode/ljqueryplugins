/**
* Formats a Date from a Rest Call "The SharePoint Way"
**/
function (jsonDate) {
    var hours = jsonDate.substring(11, 13), ampm = "AM";
    if (hours > 12) {
        hours = hours - 12;
        ampm = "PM";
        if (hours < 10) {
            hours = "0" + hours
        }
    }
    return jsonDate.substring(8, 10) + "/" + jsonDate.substring(5, 7) + "/" + jsonDate.substring(0, 4) + " " + hours + ":" + jsonDate.substring(14, 16) + " " + ampm;
}