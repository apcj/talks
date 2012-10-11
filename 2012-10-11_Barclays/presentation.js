
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

(function() {
    var shortestPathGraph = d3.select("figure.shortest-path");

    step("shortest-path-start-and-end").onEnter(function() {
        shortestPathGraph.selectAll(".start-or-end")
            .style("stroke", "yellow");
    }).onReverse(function() {
        shortestPathGraph.selectAll(".start-or-end")
            .style("stroke", null);
    });
    step("shortest-path-path").onEnter(function() {
        shortestPathGraph.selectAll("circle.shortest-path")
            .style("stroke", "yellow");
        shortestPathGraph.selectAll("path.shortest-path")
            .style("fill", "yellow");
    }).onReverse(function() {
        shortestPathGraph.selectAll("circle.shortest-path")
            .style("stroke", null);
        shortestPathGraph.selectAll("path.shortest-path")
            .style("fill", null);
    });
})();

(function() {
    var hierarchyGraph = d3.select("figure.hierarchy");

    step("hierarchy-start-node").onEnter(function() {
        hierarchyGraph.selectAll(".start-node")
            .style("stroke", "yellow");
    }).onReverse(function() {
        hierarchyGraph.selectAll(".start-node")
            .style("stroke", null);
    });
    step("hierarchy-descendants").onEnter(function() {
        hierarchyGraph.selectAll("circle.descendant")
            .style("stroke", "yellow");
        hierarchyGraph.selectAll("path.descendant")
            .style("fill", "yellow");
    }).onReverse(function() {
        hierarchyGraph.selectAll("circle.descendant")
            .style("stroke", null);
        hierarchyGraph.selectAll("path.descendant")
            .style("fill", null);
    });
})();

(function() {
    var intersectionGraph = d3.select("figure.intersection");

    step("show-intersection").onEnter(function() {
        intersectionGraph.selectAll("circle.intersection")
            .style("visibility", "visible");
        intersectionGraph.selectAll("path.intersection")
            .style("visibility", "visible");
    }).onReverse(function() {
        intersectionGraph.selectAll("circle.intersection")
            .style("visibility", null);
            intersectionGraph.selectAll("path.intersection")
                .style("visibility", null);
        });
})();

(function() {
    var model;
    var view = d3.select("svg.linear-traversal");
    var running = false;
    var nodeDistance = 500;
    var interval = 2000;
    var nodes;

    step("linear-traversal-show-nodes").onEnter(function() {
        model = gd.model();
        var lastNode;
        for (var i = 0; i < 3; i++) {
            var newNode = model.createNode().x(nodeDistance * (i - 1)).y(0);
            if (lastNode) {
                model.createRelationship(lastNode, newNode);
            }
            lastNode = newNode;
        }
        bind(model, view);
    }).onReverse(function() {
        model = gd.model();
        bind(model, view);
    });
    step("linear-traversal-continuous").onEnter(function() {
        model = gd.model();
        nodes = [];
        var lastNode;
        for (var i = 0; i < 5; i++) {
            var newNode = model.createNode().x(nodeDistance * (i - 2)).y(0);
            if (lastNode) {
                model.createRelationship(lastNode, newNode);
            }
            lastNode = newNode;
            nodes.push(newNode);
        }
        bind(model, view);
        console.log(interval);
        running = true;
        d3.timer(function(elapsed) {
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].x(-(elapsed % interval) * nodeDistance / interval + nodeDistance * (i - 2));
            }
            bind(model, view);
            return !running;
        });
    }).onReverse(function() {
        running = false;
    });
    step("linear-traversal-faster").onEnter(function() {
        interval = 500;
    });
    step("linear-traversal-fastest").onEnter(function() {
        interval = 100;
    }).onReverse(function() {
        interval = 500;
    }).onExit(function() {
        if (interval == 100) {
            running = false;
        }
    });
})();

$(function() {
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

d3.selectAll("figure.graph-diagram").each(function() {
    var graph = gd.markup.parse(d3.select(this).select("ul.graph-diagram-markup"));

    var diagramView = d3.select(this).selectAll("svg.graph-diagram").data([graph]);

    diagramView
        .enter()
        .append("svg:svg")
        .attr("class", "graph-diagram");

    bind(graph, diagramView);

    if (!diagramView.classed("pre-sized")) {
        gd.scaling.sizeSvgToFitDiagram(graph, diagramView);
    }
});