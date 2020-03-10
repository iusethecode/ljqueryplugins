function Repository(siteUrl, listname, application) {

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
