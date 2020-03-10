function InMemoryQuery(data) {

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
