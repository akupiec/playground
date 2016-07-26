/**
 * Modification of http://parano.github.io/GeneticAlgorithm-TSP/
 * MIT Licence
 */

Array.prototype.shuffle = function () {
    for (var j, x, i = this.length - 1; i; j = randomNumber(i), x = this[--i], this[i] = this[j], this[j] = x);
    return this;
};

Array.prototype.clone = function () {
    return this.slice(0);
};

Array.prototype.swap = function (x, y) {
    if (x > this.length || y > this.length || x === y) {
        return
    }
    var tem = this[x];
    this[x] = this[y];
    this[y] = tem;
};

Array.prototype.indexOf = function (value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === value) {
            return i;
        }
    }
};

Array.prototype.next = function (index) {
    if (index === this.length - 1) {
        return this[0];
    } else {
        return this[index + 1];
    }
};

Array.prototype.previous = function (index) {
    if (index === 0) {
        return this[this.length - 1];
    } else {
        return this[index - 1];
    }
};

Array.prototype.deleteByValue = function (value) {
    var pos = this.indexOf(value);
    this.splice(pos, 1);
};

var points;
var POPULATION_SIZE;
var CROSSOVER_PROBABILITY;
var MUTATION_PROBABILITY;
var UNCHANGED_GENS;
var mutationTimes;
var dis;
var bestValue;
var best;
var currentGeneration;
var currentBest;
var population;
var values;
var fitnessValues;
var roulette;


function GAInitialize(newPoints) {
    points = newPoints;
    POPULATION_SIZE = 50;
    CROSSOVER_PROBABILITY = 0.9;
    MUTATION_PROBABILITY = 0.01;
    UNCHANGED_GENS = 0;
    mutationTimes = 0;
    dis = undefined;
    bestValue = undefined;
    best = [];
    currentGeneration = 0;
    currentBest = undefined;
    population = [];
    values = new Array(POPULATION_SIZE);
    fitnessValues = new Array(POPULATION_SIZE);
    roulette = new Array(POPULATION_SIZE);

    countDistances();
    for (var i = 0; i < POPULATION_SIZE; i++) {
        population.push(randomIndivial(points.length));
    }
    setBestValue();
}

function GANextGeneration() {
    currentGeneration++;
    selection();
    crossover();
    mutation();
    setBestValue();

    return best;
}

function selection() {
    var parents = [];
    var initnum = 4;
    parents.push(population[currentBest.bestPosition]);
    parents.push(doMutate(best.clone()));
    parents.push(pushMutate(best.clone()));
    parents.push(best.clone());

    setRoulette();
    for (var i = initnum; i < POPULATION_SIZE; i++) {
        parents.push(population[wheelOut(Math.random())]);
    }
    population = parents;
}

function crossover() {
    var queue = [];
    for (let i = 0; i < POPULATION_SIZE; i++) {
        if (Math.random() < CROSSOVER_PROBABILITY) {
            queue.push(i);
        }
    }
    queue.shuffle();
    for (let i = 0, j = queue.length - 1; i < j; i += 2) {
        doCrossover(queue[i], queue[i + 1]);
    }
}

function doCrossover(x, y) {
    let child1 = getChild('next', x, y);
    let child2 = getChild('previous', x, y);
    population[x] = child1;
    population[y] = child2;
}

function getChild(fun, x, y) {
    let solution = [];
    var px = population[x].clone();
    var py = population[y].clone();
    var dx, dy;
    var c = px[randomNumber(px.length)];
    solution.push(c);
    while (px.length > 1) {
        dx = px[fun](px.indexOf(c));
        dy = py[fun](py.indexOf(c));
        px.deleteByValue(c);
        py.deleteByValue(c);
        c = dis[c][dx] < dis[c][dy] ? dx : dy;
        solution.push(c);
    }
    return solution;
}

function mutation() {
    for (var i = 0; i < POPULATION_SIZE; i++) {
        if (Math.random() < MUTATION_PROBABILITY) {
            if (Math.random() > 0.5) {
                population[i] = pushMutate(population[i]);
            } else {
                population[i] = doMutate(population[i]);
            }
            i--;
        }
    }
}

function doMutate(seq) {
    mutationTimes++;
    // m and n refers to the actual index in the array
    // m range from 0 to length-2, n range from 2...length-m
    let m, n;
    do {
        m = randomNumber(seq.length - 2);
        n = randomNumber(seq.length);
    } while (m >= n);

    for (var i = 0, j = (n - m + 1) >> 1; i < j; i++) {
        seq.swap(m + i, n - i);
    }
    return seq;
}

function pushMutate(seq) {
    mutationTimes++;
    var m, n;
    do {
        m = randomNumber(seq.length >> 1);
        n = randomNumber(seq.length);
    } while (m >= n);

    var s1 = seq.slice(0, m);
    var s2 = seq.slice(m, n);
    var s3 = seq.slice(n, seq.length);
    return s2.concat(s1).concat(s3).clone();
}

function setBestValue() {
    for (var i = 0; i < population.length; i++) {
        values[i] = evaluate(population[i]);
    }
    currentBest = getCurrentBest();
    if (bestValue === undefined || bestValue > currentBest.bestValue) {
        best = population[currentBest.bestPosition].clone();
        bestValue = currentBest.bestValue;
        UNCHANGED_GENS = 0;
    } else {
        UNCHANGED_GENS += 1;
    }
}

function getCurrentBest() {
    var bestP = 0,
        currentBestValue = values[0];

    for (var i = 1; i < population.length; i++) {
        if (values[i] < currentBestValue) {
            currentBestValue = values[i];
            bestP = i;
        }
    }
    return {
        bestPosition: bestP
        , bestValue: currentBestValue
    }
}

function setRoulette() {
    //calculate all the fitness
    for (let i = 0; i < values.length; i++) {
        fitnessValues[i] = 1.0 / values[i];
    }
    //set the roulette
    var sum = 0;
    for (let i = 0; i < fitnessValues.length; i++) {
        sum += fitnessValues[i];
    }
    for (let i = 0; i < roulette.length; i++) {
        roulette[i] = fitnessValues[i] / sum;
    }
    for (let i = 1; i < roulette.length; i++) {
        roulette[i] += roulette[i - 1];
    }
}

function wheelOut(rand) {
    var i;
    for (i = 0; i < roulette.length; i++) {
        if (rand <= roulette[i]) {
            return i;
        }
    }
}

function randomIndivial(n) {
    var a = [];
    for (var i = 0; i < n; i++) {
        a.push(i);
    }
    return a.shuffle();
}

function evaluate(indivial) {
    var sum = dis[indivial[0]][indivial[indivial.length - 1]];
    for (var i = 1; i < indivial.length; i++) {
        sum += dis[indivial[i]][indivial[i - 1]];
    }
    return sum;
}

function countDistances() {
    var length = points.length;
    dis = new Array(length);
    for (var i = 0; i < length; i++) {
        dis[i] = new Array(length);
        for (var j = 0; j < length; j++) {
            dis[i][j] = ~~distance(points[i], points[j]);
        }
    }
}

function randomNumber(boundary) {
    return parseInt(Math.random() * boundary);
    //return Math.floor(Math.random() * boundary);
}

function distance(p1, p2) {
    return euclidean(p1.x - p2.x, p1.y - p2.y);
}

function euclidean(dx, dy) {
    return Math.sqrt(dx * dx + dy * dy);
}

export {
    GAInitialize,
    GANextGeneration,
};
