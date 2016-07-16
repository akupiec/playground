function drawPathForwards(graphics, path) {
    for (var i = 0; i < path.length; i++) {
        graphics.lineTo(path[i].x, path[i].y);
    }
}

function lookupEdgeFromCenter(p, r) {
    for (var i = 0; i < p.borders.length; i++) {
        var edge = p.borders[i];
        if (edge.d0 === r || edge.d1 === r) {
            return edge;
        }
    }
    return null;
}

export function drawSinglePolygon(center, colors = [], noisyEdges, graphics) {
    function drawPath0(graphics, x, y) {
        var path = noisyEdges.path0[edge.index];
        graphics.moveTo(x, y);
        graphics.lineTo(path[0].x, path[0].y);
        drawPathForwards(graphics, path);
        graphics.lineTo(x, y);
    }

    function drawPath1(graphics, x, y) {
        var path = noisyEdges.path1[edge.index];
        graphics.moveTo(x, y);
        graphics.lineTo(path[0].x, path[0].y);
        drawPathForwards(graphics, path);
        graphics.lineTo(x, y);
    }

    for (var neighborIndex = 0; neighborIndex < center.neighbors.length; neighborIndex++) {
        var neighbor = center.neighbors[neighborIndex];
        var edge = lookupEdgeFromCenter(center, neighbor);
        var color = colors[center.biome] || 0;

        if (!(noisyEdges.path0[edge.index]) || !(noisyEdges.path1[edge.index])) {
            // It's at the edge of the map
            continue;
        }
        if (color !== colors.OCEAN) {
            graphics.beginFill(color);
            drawPath0(graphics, center.point.x, center.point.y);
            drawPath1(graphics, center.point.x, center.point.y);
            graphics.endFill();
        }
    }
    return graphics;
}

export function renderPolygons(graphics, colors, map, noisyEdges) {
    for (var centerIndex = 0; centerIndex < map.centers.length; centerIndex++) {
        var center = map.centers[centerIndex];
        graphics = drawSinglePolygon(center, colors, noisyEdges, graphics);
    }
    return graphics
}