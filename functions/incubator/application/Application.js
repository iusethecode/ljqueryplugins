function Application(siteUrl) {
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
