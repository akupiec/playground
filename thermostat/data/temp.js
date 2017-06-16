const ROOT_PREFIX = '';

let reloadPeriod;
let running;
let lastRefreshTime = new Date();

function loadTemperature() {
    const currentTemp = document.getElementById("current-temp");
    const setHyst = document.getElementById("set-hyst");
    const setTemp = document.getElementById("set-temp");

    return setInterval(function () {
        ajax({
            type: 'GET',
            url: ROOT_PREFIX + '/all',
            sCb: function (response) {
                const jsonResponse = JSON.parse(response.responseText);
                // appendTemp(jsonResponse.temp);
                Chart.addData(jsonResponse.temp);
                currentTemp.value = jsonResponse.temp;
                setHyst.value = jsonResponse.setHyst;
                setTemp.value = jsonResponse.setTemp;

                lastRefreshTime = new Date().getTime();
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
        startBtn.classList.add("hidden");
        stopBtn.classList.remove("hidden");
    } else {
        stopBtn.classList.add("hidden");
        startBtn.classList.remove("hidden");
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
    setButtonState();

    const lastRefreshLabel = document.getElementById("last-refresh-time");
    setInterval(() => {
        lastRefreshLabel.innerText = ((new Date().getTime() - lastRefreshTime) / 1000).toFixed(1) + ' s';
    }, 100);

    window.addEventListener('resize', Chart.render);
    Chart.render();
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
        url: ROOT_PREFIX + '/saveTemp',
        data: fd
    });
}
