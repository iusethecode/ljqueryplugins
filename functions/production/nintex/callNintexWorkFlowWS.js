function callNintexWorkFlowWS(siteurl, method, body) {
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

