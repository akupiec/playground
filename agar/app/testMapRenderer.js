console.time('paint');
var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
const map = state.map;
voronoiMap.renderCanvas.graphicsReset(context, map.SIZE.width, map.SIZE.height, voronoiMap.style.displayColors);


voronoiMap.renderCanvas.renderDebugPolygons(context, state.map, voronoiMap.style.displayColors);
voronoiMap.renderCanvas.renderPolygons(context, voronoiMap.style.displayColors, null, voronoiMap.renderCore.colorWithSlope, state.map, state.noisyEdges);
voronoiMap.renderCanvas.renderEdges(context, voronoiMap.style.displayColors, state.map, state.noisyEdges, state.lava, renderRivers);
// voronoiMap.renderCanvas.renderAllEdges(context, 0xd0d0d0, 0.25, state.map, state.noisyEdges);
voronoiMap.renderCanvas.renderRoads(context, state.map, state.roads, voronoiMap.style.displayColors);
// voronoiMap.renderCanvas.renderBridges(context, state.map, state.roads, style.displayColors);
// voronoiMap.renderCanvas.renderWatersheds(context, state.map, state.watersheds);
// voronoiMap.renderCanvas.addNoise(context, state.map.SIZE.width, state.map.SIZE.height);


console.timeEnd('paint');