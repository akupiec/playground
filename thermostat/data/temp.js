let tempPlot;
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
                tempPlot.add(jsonResponse.temp);
                currentHyst.value = jsonResponse.hyst;
                currentTemp.value = jsonResponse.temp;
            },
            eCb: function() {
                currentHyst.value = -99999;
                currentTemp.value = -99999;
            }
        });
    }, reloadPeriod);
}

function setButtonState() {
    const startBtn = document.getElementById("start-button");
    const stopBtn = document.getElementById("stop-button");
    if(running) {
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

function onBodyLoad() {
    tempPlot = createGraph(document.getElementById("analog"), "Temperature", 100, 128, 20, 120, false, "cyan");
    setButtonState();
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

    ajax({
        type: 'POST',
        url: '/saveTemp',
        data: {
            temp: tempInput.value,
            hyst: hystInput.value
        }
    });
}