const core = {
    def: function (value, defaultValue) {
        return _.isUndefined(value) ? defaultValue : value;
    },

    toInt: function (something) {
        return something | 0;
    },

    // Return first argument that is not undefined and not null.
    coalesce: function () {
        return _.find(arguments, function (arg) {
            return !_.isNull(arg) && !_.isUndefined(arg);
        });
    },

    isUndefinedOrNull: function (thing) {
        return _.isUndefined(thing) || _.isNull(thing);
    }
};

function drawPathForwards(graphics, path) {
    for (var i = 0; i < path.length; i++) {
        graphics.lineTo(path[i].x, path[i].y);
    }
}

const renderPolygons = function (context, colors, map, noisyEdges) {
    var stage = new PIXI.Container();
    var graphics = new PIXI.Graphics();

    var drawPath0 = function (graphics, x, y) {
        var path = noisyEdges.path0[edge.index];
        graphics.moveTo(x, y);
        graphics.lineTo(path[0].x, path[0].y);
        drawPathForwards(graphics, path);
        graphics.lineTo(x, y);
    };

    var drawPath1 = function (graphics, x, y) {
        var path = noisyEdges.path1[edge.index];
        graphics.moveTo(x, y);
        graphics.lineTo(path[0].x, path[0].y);
        drawPathForwards(graphics, path);
        graphics.lineTo(x, y);
    };

    for (var centerIndex = 0; centerIndex < map.centers.length; centerIndex++) {
        var p = map.centers[centerIndex];
        for (var neighborIndex = 0; neighborIndex < p.neighbors.length; neighborIndex++) {
            var r = p.neighbors[neighborIndex];
            var edge = map.lookupEdgeFromCenter(p, r);
            var color = core.coalesce(colors[p.biome], 0);

            if (core.isUndefinedOrNull(noisyEdges.path0[edge.index]) || core.isUndefinedOrNull(noisyEdges.path1[edge.index])) {
                // It's at the edge of the map, where we don't have
                // the noisy edges computed. TODO: figure out how to
                // fill in these edges from the voronoi library.
                continue;
            }
            if (color !== colors.OCEAN) {
                graphics.beginFill(color);
                drawPath0(graphics, p.point.x, p.point.y);
                drawPath1(graphics, p.point.x, p.point.y);
                graphics.endFill();
            }
        }
    }

    stage.addChild(graphics);
    context.render(stage);
};

export default renderPolygons;