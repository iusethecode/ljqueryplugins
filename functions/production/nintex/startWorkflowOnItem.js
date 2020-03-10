function startWorkflowOnItem(siteurl, listname, itemID, wfname) {


    var body = '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:m="http://nintex.com"><soap:Header></soap:Header><soap:Body><m:StartWorkflowOnListItem><m:itemId>{{itemID}}</m:itemId><m:listName>{{listname}}</m:listName><m:workflowName>{{wfname}}</m:workflowName><m:associationData></m:associationData></m:StartWorkflowOnListItem></soap:Body></soap:Envelope>';

    body = L.utils.template(body, { listname: listname, itemID: itemID, wfname: wfname });


    return L.nintex.callNintexWorkFlowWS(siteurl, "StartWorkflowOnListItem", body);

}
