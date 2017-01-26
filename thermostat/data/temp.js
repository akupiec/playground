let reloadPeriod;
let running;

function loadTemperature() {
    const currentTemp = document.getElementById("current-temp");
    const currentHyst = document.getElementById("current-hyst");

    return setInterval(function () {
        ajax({
            type: 'GET',
            url: '/all',
            sCb: function (response) {
                const jsonResponse = JSON.parse(response.responseText);
                appendTemp(jsonResponse.temp);
                currentHyst.value = jsonResponse.hyst;
                currentTemp.value = jsonResponse.temp;
            },
            eCb: function () {
                currentHyst.value = -99999;
                currentTemp.value = -99999;
            }
        });
    }, reloadPeriod);
}

function setButtonState() {
    const startBtn = document.getElementById("start-button");
    const stopBtn = document.getElementById("stop-button");
    if (running) {
        startBtn.setAttribute("disabled", "disabled");
        stopBtn.removeAttribute("disabled");
    } else {
        stopBtn.setAttribute("disabled", "disabled");
        startBtn.removeAttribute("disabled");
    }
}

function run() {
    stop();
    running = loadTemperature();
    setButtonState();
}

function stop() {
    if (running) {
        clearInterval(running);
        running = null;
    }
    setButtonState();
}

let data = [];
function appendTemp(temp) {
    data.push({
        date: data.length,
        close: temp,
    });
    repaintPlot();
}

let x, y;
function repaintPlot() {

    const line = d3.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.close);
        });

    // x.domain(d3.extent(data, function(d) { return d.date; }));
    // y.domain(d3.extent(data, function(d) { return d.close; }));
    const dataStart = data.length - 50 > 0 ? data.length - 50 : 0;
    x.domain([dataStart, data.length]);

    const svg = d3.select("svg").selectAll('path').data(data);
    svg.attr('d', line(data))
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5);
    svg.exit().remove();
}

function onBodyLoad() {
    setButtonState();
    const svg = d3.select("svg");
    const margin = {top: 20, right: 20, bottom: 30, left: 50};
    let width = +svg.attr("width") - margin.left - margin.right;
    let height = +svg.attr("height") - margin.top - margin.bottom;
    let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x = d3.scaleLinear()
        .rangeRound([0, width]);

    y = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain([0, 100]);

    g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Temp (C)");
    svg.data(data)
        .append('svg:path');
}

function onStartRun() {
    const refreshInput = document.getElementById("refresh-rate");
    reloadPeriod = refreshInput.value;
    run();
}

function onStopRun() {
    stop();
}

function saveTemperature() {
    const tempInput = document.getElementById("temperature-input");
    const hystInput = document.getElementById("hysteresis-input");
    const fd = new FormData();
    fd.append('temp', tempInput.value);
    fd.append('hyst', hystInput.value);
    ajax({
        type: 'POST',
        url: '/saveTemp',
        data: fd
    });
}