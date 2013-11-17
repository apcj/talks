var actionsOnEnter = {};
var actionsOnReverse = {};
var actionsOnExit = {};

function step(id) {
    var stepBuilder = {};
    stepBuilder.onEnter = function(action) {
        actionsOnEnter[id] = action;
        return stepBuilder;
    };
    stepBuilder.onReverse = function(action) {
        actionsOnReverse[id] = action;
        return stepBuilder;
    };
    stepBuilder.onExit = function(action) {
        actionsOnExit[id] = action;
        return stepBuilder;
    };
    return stepBuilder;
}

function centreSlides() {
    $( ".slide > .center" ).wrap( "<div class='center-outer'><div class='center-inner'></div></div>" );
}

function attributions() {
    d3.selectAll("a.attribution")
        .text(function() { return d3.select(this).attr("href"); });
}

$(function() {
    centreSlides();
    attributions();

    function callIfDefined(action) {
        if (action) action();
    }

    $.deck('.slide');
    $(document).bind('deck.change', function(e, from, to) {
        var fromId = $.deck('getSlide', from).attr("id");
        var toId = $.deck('getSlide', to).attr("id");

        if (from > to) {
            callIfDefined(actionsOnReverse[fromId]);
        }
        callIfDefined(actionsOnExit[fromId]);
        callIfDefined(actionsOnEnter[toId]);
    });
});

