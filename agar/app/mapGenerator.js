export default class MapGenerator {
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

        switch (shape) {
            case 'blob' :
                state.map.newIsland(voronoiMap.islandShape.makeBlob(), seed);
                break;
            case 'noise' :
                state.map.newIsland(voronoiMap.islandShape.makeNoise(shapeSeed), seed);
                break;
            case 'perlin' :
                state.map.newIsland(voronoiMap.islandShape.makePerlin(shapeSeed, oceanRatio), seed);
                break;
            case 'radial' :
                state.map.newIsland(voronoiMap.islandShape.makeRadial(shapeSeed, islandFactor), seed);
                break;
            case 'square' :
                state.map.newIsland(voronoiMap.islandShape.makeSquare(), seed);
                break;
        }


        const ps = voronoiMap.pointSelector.generateRelaxed(size.width, size.height, seed, lloydIterations);

        state.map.go0PlacePoints(numberOfPoints, ps);
        state.map.go1BuildGraph();
        state.map.go2AssignElevations(lakeThreshold);
        state.map.go3AssignMoisture(riverChance);
        state.map.go4DecorateMap();

        state.roads.createRoads(state.map, roadElevations);
// state.lava.createLava(state.map, 0.8);
        state.watersheds.createWatersheds(state.map);
        state.noisyEdges.buildNoisyEdges(state.map, state.lava, seed, edgeNoise);
        console.timeEnd('generate');

        this._map = state.map;
    }

    mapBiomeToSpriteNr(biome) {
        switch (biome) {
            case 'OCEAN':
                return 0;
            case 'MARSH':
                return 2;
            case 'ICE':
                return 4;
            case 'LAKE':
                return 6;
            case 'BEACH':
                return 8;
            case 'SNOW':
                return 10;
            case 'TUNDRA':
                return 11;
            case 'BARE':
                return 12;
            case 'SCORCHED':
                return 13;
            case 'TAIGA':
                return 15;
            case 'SHRUBLAND':
                return 0;
            case 'TEMPERATE_DESERT':
                return 0;
            case 'TEMPERATE_RAIN_FOREST':
                return 0;
            case 'TEMPERATE_DECIDUOUS_FOREST':
                return 0;
            case 'GRASSLAND':
                return 0;
            case 'TEMPERATE_DESERT':
                return 0;
            case 'TROPICAL_RAIN_FOREST':
                return 0;
            case 'TROPICAL_SEASONAL_FOREST':
                return 0;
            case 'GRASSLAND':
                return 0;
            case 'SUBTROPICAL_DESERT':
                return 0;
            default:
                console.error('unknown biome: ', biome);
                return 0;
        }
    };

    getMap() {
        console.time('pintPoint');
        let DATA = [];
        for (let i = 0; i < 1000 * 1000; i++) {
            DATA[i] = 1;
        }
        this._map.centers.map((center) => {
            var mask = new PIXI.Graphics();
            let points = center.corners.map((corner) => {
                return corner.point;
            });
            mask.drawPolygon(points);
            let bounds = mask.getBounds();
            const x = Math.floor(bounds.x);
            const y = Math.floor(bounds.y);
            const biomeNr = this.mapBiomeToSpriteNr(center.biome);
            for (let i = x; i < bounds.width + x; i++) {
                for (let j = y; j < bounds.height + y; j++) {
                    if (mask.graphicsData[0].shape.contains(i, j)) {
                        DATA[i * (j + 1)] = biomeNr;
                    }
                }
            }
            mask.destroy();
        });
        console.timeEnd('pintPoint');
        return DATA;
    }
}

