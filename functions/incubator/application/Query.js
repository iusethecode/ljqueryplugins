function Query(siteUrl, listname, application) {
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
