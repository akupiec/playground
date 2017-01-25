function ajax({type, url, data, sCb, eCb}) {
    type = type || 'GET';
    sCb = sCb || function(response) {console.log(response)};
    eCb = eCb || function(response) {console.log(response)};

    let request = new XMLHttpRequest();
    request.open(type, url, true);

    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            sCb(request);
        } else {
            eCb(request)
        }
    };

    request.onerror = function () {
        eCb(request)
    };

    request.send(data);
}
