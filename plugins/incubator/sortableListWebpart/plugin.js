(function ($) {
    /*
	 * Attach this to the <tbody> element of a List-Webpart
	 * Ensure, that the list has a Number Column for storing the Sortvalue
     * Parameter: {listName : 'NameOfList', sortColumn : 'NameOfSortColumn'}
     * Requires: jQuery.ui
     */
    $.fn.sortableListWebpart = function (options) {
        var me = this;

        // Provide default values
        var settings = $.extend({
            //sortColumn: 'SortOrder',
        }, options);



        (function init() {
            $(document).ready(function () {
                if (!(settings.listName === undefined) && !(settings.sortColumn === undefined)) {
                    me.css('cursor', 'move'); // Show user, that list is sortable
                    makeItSortable();
                }
                else {
                    console.warn("At least one function parameter is missing!");
                }
            });
        })();



        /* 
	 	 * Attaches jQueryUI Sortable to the Agenda Webpart
	 	 * See https://jqueryui.com/sortable
	 	 */
        function makeItSortable() {
            $(me).sortable({
                scroll: false,
                stop: function (event, ui) {
                    var arr = $(me).sortable('toArray', { attribute: "iid" }); // Serializes the visible list items
                    saveAgendaPositions(arr);
                }
            });
        }


        // Persists the item positions to the column: in list
        function saveAgendaPositions(arr) {
            if (Array.isArray(arr)) {
                var clientContext = new SP.ClientContext();
                var oList = clientContext.get_web().get_lists().getByTitle(settings.listName);
                for (var i = 0; i < arr.length; i++) {
                    var itemId = (arr[i]).split(",")[1];
                    this.oListItem = oList.getItemById(itemId);
                    oListItem.set_item(settings.sortColumn, i + 1);
                    oListItem.update();
                }
                clientContext.executeQueryAsync(Function.createDelegate(this, onQuerySucceeded), Function.createDelegate(this, onQueryFailed));
            }
        }

        // Query Success Handler
        function onQuerySucceeded() {
            //console.log("Persisting item positions: Done!");
        }


        // Query Fail Handler
        function onQueryFailed(sender, args) {
            alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
        }

        return me;
    };
}(jQuery));