this["L"] = this["L"] || {};
this["L"]["application"] = this["L"]["application"] || {};
this["L"]["application"]["Application"] = function Application(siteUrl) {
    var app = this;
    this._siteUrl = siteUrl;
    this._requestDigest = null;
    this._nextRequestDigestTmestamp = new Date().getTime() + 60000;
    this._startPromise = $.Deferred()

    this.getRequestDigest = function () {
        if (new Date().getTime() > this._nextRequestDigestTmestamp) {
            app.trace('Getting new Requestdigest');
            jQuery.ajax({
                url: app._siteUrl + "/_api/contextinfo",
                type: "POST",
                success: function (data) {
                    app._requestDigest = data.d.GetContextWebInformation.FormDigestValue;
                    app._nextRequestDigestTmestamp = new Date().getTime() + 60000;
                },
                error: function (error) {
                    app.error(error);                 
                },
                headers: {
                    "Accept": "application/json; odata=verbose",
                    "Content-Type": "application/json; odata=verbose"
                }
            });
        }

        return this._requestDigest;
    }


    jQuery.ajax({
        url: app._siteUrl + "/_api/contextinfo",
        type: "POST",

        success: function (data) {
            app._requestDigest = data.d.GetContextWebInformation.FormDigestValue;
            app._startPromise.resolve(data);
        },
        error: function (error) {
            app.error(error);
            app._startPromise.reject(error);
        },
        headers: {
            "Accept": "application/json; odata=verbose",
            "Content-Type": "application/json; odata=verbose"
        }
    });


    this._started = false;
    this._promise = this._startPromise;


    this._wirepromises = [];

    this.wire = function (wirefunc) {

        var promise = wirefunc(app);
        this._promise = this._promise.then(promise)
        this._wirepromises.push(promise);
    }

    this.ready = function (readyfunc) {
        if (!this._started) {
            app.log('starting App');
            this._started = true;
            this._startPromise.resolve();
        }
        $.when.apply($, this._wirepromises).then(function () {
            readyfunc(app);
        });
    }






    this.query = function (listname) {
        return new L.application.Query(this._siteUrl, listname, this);
    }


    this.mixin = {};
    this.mixin.newRepository = function (reponame, listname) {
        app.wire(function (a) {
            a[reponame] = new L.application.Repository(a._siteUrl, listname, a);
            return $.Deferred().resolve();
        });
    }

    this.mixin.newInMemoryRepository = function (reponame,data) {
        app.wire(function (a) {
            a[reponame] = new L.application.InMemoryRepository(data);
            return $.Deferred().resolve();
        });
    }


    this.mixin.dataFromQuery = function (objectname, queryobject) {
        app.wire(function (a) {
            var p = queryobject.execute(function (data) {
                a[objectname] = data;;
            });
            return p;

        });
    }


    this.trace = function (message) {
    }

    this.log = function (message) {        
    }


    this.error = function (message) {
        console.error(message);
    }



}
;
this["L"]["application"]["InMemoryQuery"] = function InMemoryQuery(data) {

    var me = this;
    me._data = data;
    me.results = null;

    me._mapToSingle = false;
    me._keyfield = '';
    me._valuefield = '';


    me.mapToSingleObject = function (keyfield, valuefield) {
        me._mapToSingle = true;
        me._keyfield = keyfield;
        me._valuefield = valuefield;
        return me;
    }



    me.none = function (callback) {

        if (me.results == null) {
            me.execute(function (data) {
                if (data.length == 0) {
                    callback();
                }
            })
        } else {
            if (me.results.length == 0) {
                callback();
            };
        }
        return me;
    }


    me.each = function (callback) {
        if (me.results == null) {
            me.execute(function (data) {
                $.each(data, function (index, value) {
                    callback(index, value);
                });
            })
        } else {
            $.each(me.results, function (index, value) {
                callback(index, value);
            });
        }

       

        return me;

    }


    me.filter = function (attribute, operation, value) {
        var oldFilter = me._filterfunction;
        switch (operation) {

            case 'eq':
                me._filterfunction = function (row, i) {              
                    return row[attribute] == value && oldFilter(row, i);
                }
                break;
            case 'ne':
                me._filterfunction = function (row, i) {                  
                    return row[attribute] != value && oldFilter(row, i);
                }
                break;          
            default:

        }

        return me;

    }


    me._filterfunction = function (row,i) {       
        return true;
    }






    me.execute = function (callback) {
        var promise = $.Deferred();
        me.results = jQuery.grep(me._data, me._filterfunction);

        if (me._mapToSingle) {
            var obj = {};

            jQuery.each(me.results, function (index, value) {
                obj[value[me._keyfield]] = value[me._valuefield];
            });

            me.results = obj;
        }

        if (callback != null) {
            callback(me.results);
        }


        promise.resolve();

        return promise;
    }


}
;
this["L"]["application"]["InMemoryRepository"] = function InMemoryRepository(data) {


    var me = this;
    me._data = data;


    this.query = function () {
        return new L.application.InMemoryQuery(data);
    }


    this.insert = function (metadata) {
        console.log('Not Implemented');
        var promise = $.Deferred();
        promise.resolve();
        return promise;
    }


    this.remove = function (Id) {
        console.log('Not Implemented');
        var promise = $.Deferred();
        promise.resolve();
        return promise;

    }


    this.startWorkflowOnItem = function (itemID, wfname) {
        console.log('Not Implemented');
        var promise = $.Deferred();
        promise.resolve();
        return promise;

    }



    this.update = function (metadata) {
        console.log('Not Implemented');
        var promise = $.Deferred();
        promise.resolve();
        return promise;

    }



}
;
this["L"]["application"]["Query"] = function Query(siteUrl, listname, application) {
    var me = this;

    this._application = application
    this.getDigest = function () {
        if (this._application && this._application._requestDigest) {
            return this._application.getRequestDigest();
        }
        return $("#__REQUESTDIGEST").val();
    }

    me._filter = '';
    me.endpoint = siteUrl +
    "/_api/web/lists/GetByTitle('"
    + listname + "')/items";
    me.results = null;

    me.filter = function (filter) {
        me._filter = filter;
        return me;
    }


    me._mapToSingle = false;
    me._keyfield = '';
    me._valuefield = '';


    me.mapToSingleObject = function (keyfield, valuefield) {
        me._mapToSingle = true;
        me._keyfield = keyfield;
        me._valuefield = valuefield;
        return me;
    }



    me.none = function (callback) {

        if (me.results == null) {
            me.execute(function (data) {
                if (data.length == 0) {
                    callback();
                }
            })
        } else {
            if (me.results.length == 0) {
                callback();
            };
        }
        return me;
    }



    me.each = function (callback) {
        if (me.results == null) {
            me.execute(function (data) {
                $.each(data, function (index, value) {
                    callback(index, value);
                });
            })
        } else {
            $.each(me.results, function (index, value) {
                callback(index, value);
            });
        }

       

        return me;

    }





    me.execute = function (callback) {
        var me = this;
        var url = this.endpoint+"?";
        if (me._filter != '') {
            url = url + "$filter=" + me._filter+"&"
        }
        // Force to load eveerything, not just the items with an id below 1000
        url = url + "$top=999999"
        var promise = $.Deferred();
        jQuery.ajax({
            url: url,
            method: "GET",
            //     data: requestData,
            success: function (data) {
                me.results = data.d.results;

                if (me._mapToSingle) {
                    var obj = {};

                    jQuery.each(me.results, function (index, value) {
                        obj[value[me._keyfield]] = value[me._valuefield];
                    });

                    me.results = obj;
                }

                if (callback != null) {
                    callback(me.results);
                }


                promise.resolve();

            }




            ,
            error: function (error) {
                me._application.error(error);
                promise.reject();
            },
            headers: {
                "X-RequestDigest": me.getDigest(),
                "Accept": "application/json; odata=verbose",
                "Content-Type": "application/json; odata=verbose"
            }
        });
        return promise;
    }


}
;
this["L"]["application"]["Repository"] = function Repository(siteUrl, listname, application) {

    this._siteUrl = siteUrl;
    this._listname = listname;
    this._application = application
    this.getDigest = function () {
        if (this._application && this._application._requestDigest) {
            return this._application.getRequestDigest();
        }
        return $("#__REQUESTDIGEST").val();
    }



    this._endpoint = siteUrl +
    "/_api/web/lists/GetByTitle('"
    + listname + "')/items";




    this.query = function () {
        return new L.application.Query(siteUrl, listname, application);
    }


    this.insert = function (metadata) {
        var me = this;

        var item = $.extend({
            "__metadata": { "type": "SP.Data." + me._listname.charAt(0).toUpperCase() + me._listname.split(" ").join("").slice(1) + "ListItem" }
        }, metadata);


        var promise = $.Deferred();
        jQuery.ajax({
            url: this._endpoint,
            type: "POST",
            contentType: "application/json;odata=verbose",
            data: JSON.stringify(item),
            success: function (data) {
                promise.resolve(data);
            },
            error: function (error) {
                me._application.error(error);
                promise.reject(error);
            },
            headers: {
                "X-RequestDigest": "" + me.getDigest(),
                "Accept": "application/json; odata=verbose",
                "Content-Type": "application/json; odata=verbose"
            }
        });
        return promise;
    }


    this.remove = function (Id) {
        var me = this;


        var digest = me.getDigest();

        var promise = $.Deferred();           
            $.ajax({
                url: this._endpoint+"(" + Id + ")",
                type: "POST",
                headers: {
                    "ACCEPT": "application/json;odata=verbose",
                    "content-type": "application/json;odata=verbose",
                    "X-RequestDigest": "" + digest,
                    "IF-MATCH": "*",
                    "X-HTTP-Method": "DELETE"
                },
                success: function (data) {
                    promise.resolve(data);
                },
                error: function (error) {
                    me._application.error(error);
                    promise.reject(error);
                },
            });

            return promise;


    }


    this.startWorkflowOnItem = function (itemID, wfname) {

        this._application.log('Starting Workflow ' + wfname + ' on item ' + itemID);

       return L.nintex.startWorkflowOnItem(this._siteUrl, this._listname, itemID, wfname);
    }



    this.update = function (metadata) {
        var me = this;


        var item = $.extend({
            "__metadata": { "type": "SP.Data." + me._listname.charAt(0).toUpperCase() + me._listname.split(" ").join("").slice(1) + "ListItem" }
        }, metadata);


        var promise = $.Deferred();
        jQuery.ajax({
            url: this._endpoint + "(" + metadata.Id + ")",
            type: "POST",
            contentType: "application/json;odata=verbose",
            data: JSON.stringify(item),
            success: function (data) {
                promise.resolve(data);
            },
            error: function (error) {
                me._application.error(error);
                promise.reject(error);
            },
            headers: {
                "X-RequestDigest": "" + me.getDigest(),
                "Accept": "application/json; odata=verbose",
                "Content-Type": "application/json; odata=verbose",
                "X-HTTP-Method": "MERGE",
                "If-Match": metadata.__metadata.etag

            }
        });
        return promise;
    }



}
;
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