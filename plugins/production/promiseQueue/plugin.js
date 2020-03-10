(function ($) {

    function PromiseQueue(jqElem) {
        this.base = $.Deferred();
        this.queue = this.base;
        this.jqElem = jqElem;
        this.counter = 0;
        this.template = '<div class="pline" id="p{{counter}}"><span class="pdesc">{{description}}</span><span class="perror"></span><span class="pstate pstatewaiting">waiting</span></div>';

        if (jqElem.data().hasOwnProperty("tplid")) {
            this.template = $('#' + jqElem.data('tplid')).html();
        }

    }


    PromiseQueue.prototype.add = function (description, promisefunction) {

        this.counter++;
        var counter = this.counter;

        var data={description:description,counter:counter};

        this.jqElem.append(this.template.replace(/\{\{(\w*)\}\}/g, function (m, key) { return data[key]; }));


        this.queue = this.queue.then(function () { $('#p' + counter + ' .pstate').removeClass('pstatewaiting').addClass('pstaterunning').html('running'); });
        this.queue = this.queue.then(promisefunction);
        this.queue = this.queue.then(function () { $('#p' + counter + ' .pstate').removeClass('pstaterunning').addClass('pstatedone').html('done'); }, function (text) { $('#p' + counter + ' .perror').html(text); $('#p' + counter + ' .pstate').removeClass('pstaterunning').addClass('pstateerror').html('error'); return $.Deferred().resolve() });

    };

    PromiseQueue.prototype.run = function () {
        this.base.resolve()
    };




    $.fn.promiseQueue = function () {
        return new PromiseQueue(this);
    };

}(jQuery));


