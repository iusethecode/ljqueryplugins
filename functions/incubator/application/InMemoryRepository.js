function InMemoryRepository(data) {


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
