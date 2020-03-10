this["L"] = this["L"] || {};
this["L"]["date"] = this["L"]["date"] || {};
this["L"]["date"]["formatSPDate"] = /**
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
};
this["L"]["date"]["parseSPDate"] = /**
* Parses a Date from a Rest Call
**/
function (date) {
    var h = date.substring(date.indexOf(' ') + 1, date.length);
    var input = date.substring(0, date.indexOf(' '));
    var parts = input.split('/');
    var hours = h.split(':');
    return new Date(parts[2], parts[1] - 1, parts[0], hours[0], hours[1]); // Note: months are 0-based
};
this["L"]["nintex"] = this["L"]["nintex"] || {};
this["L"]["nintex"]["callNintexWorkFlowWS"] = function callNintexWorkFlowWS(siteurl, method, body) {
    var wsurl = siteurl + "/_vti_bin/NintexWorkflow/Workflow.asmx";


    return jQuery.ajax({
        type: "POST",
        cache: false,
        async: true,
        url: wsurl,
        data: body,
        beforeSend: function (xhr) { xhr.setRequestHeader('SOAPAction', 'http://nintex.com/' + method); },
        contentType: "text/xml; charset=utf-8",
        dataType: "xml",
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error calling Nintex Workflow Webservice');
        }
    });

}

;
this["L"]["nintex"]["startWorkflowOnItem"] = function startWorkflowOnItem(siteurl, listname, itemID, wfname) {


    var body = '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:m="http://nintex.com"><soap:Header></soap:Header><soap:Body><m:StartWorkflowOnListItem><m:itemId>{{itemID}}</m:itemId><m:listName>{{listname}}</m:listName><m:workflowName>{{wfname}}</m:workflowName><m:associationData></m:associationData></m:StartWorkflowOnListItem></soap:Body></soap:Envelope>';

    body = L.utils.template(body, { listname: listname, itemID: itemID, wfname: wfname });


    return L.nintex.callNintexWorkFlowWS(siteurl, "StartWorkflowOnListItem", body);

}
;
this["L"]["utils"] = this["L"]["utils"] || {};
this["L"]["utils"]["getQueryParameter"] = function(name) {
    var results = new RegExp("[\\?&]" + name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]") + "=([^&#]*)").exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};
this["L"]["utils"]["template"] = /**
* Replaces Variables in a Template String
**/
function(template, scope) {
    return template.replace(/\{\{(\w*)\}\}/g, function (m, key) { return scope[key]; })
};