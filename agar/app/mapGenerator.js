class MapGenerator {
    generate() {
        console.time('generate');

        var size = {
            width: 1000,
            height: 1000
        };
        var numberOfPoints = 500;

        var seed = '1';
        var shapeSeed = '1';
        var edgeNoise = 0.5;
        var lloydIterations = 2;
        var shape = 'blob';

        var lakeThreshold = 0.3;
        var riverChance = 0.1;
        const renderRivers = true;

        var roadElevations = [0, 0.05, 0.37, 0.64];

        var oceanRatio = 0.5;
        var islandFactor = 0.3;

        var state = {
            map: voronoiMap.map(size),
            noisyEdges: voronoiMap.noisyEdges(),
            roads: voronoiMap.roads(),
            watersheds: voronoiMap.watersheds(),
            lava: voronoiMap.lava()
        };

//         switch (shape) {
//             case 'blob' :
//                 state.map.newIsland(voronoiMap.islandShape.makeBlob(), seed);
//                 break;
//             case 'noise' :
//                 state.map.newIsland(voronoiMap.islandShape.makeNoise(shapeSeed), seed);
//                 break;
//             case 'perlin' :
//                 state.map.newIsland(voronoiMap.islandShape.makePerlin(shapeSeed, oceanRatio), seed);
//                 break;
//             case 'radial' :
//                 state.map.newIsland(voronoiMap.islandShape.makeRadial(shapeSeed, islandFactor), seed);
//                 break;
//             case 'square' :
//                 state.map.newIsland(voronoiMap.islandShape.makeSquare(), seed);
//                 break;
//         }
//
//
//         const ps = voronoiMap.pointSelector.generateRelaxed(size.width, size.height, seed, lloydIterations);
//
//         state.map.go0PlacePoints(numberOfPoints, ps);
//         state.map.go1BuildGraph();
//         state.map.go2AssignElevations(lakeThreshold);
//         state.map.go3AssignMoisture(riverChance);
//         state.map.go4DecorateMap();
//
//         state.roads.createRoads(state.map, roadElevations);
// // state.lava.createLava(state.map, 0.8);
//         state.watersheds.createWatersheds(state.map);
//         state.noisyEdges.buildNoisyEdges(state.map, state.lava, seed, edgeNoise);
        console.timeEnd('generate');
        this._map = state.map;
    }

    getMap() {
        return this._map;
    }
}

