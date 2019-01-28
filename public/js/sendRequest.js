function sendRequest(url, data, method, callback) {
    const xhttp  = new XMLHttpRequest();
    xhttp.addEventListener('readystatechange', function () {
        if (this.readyState === 4 && this.status === 200) {
            callback(this.response);
        }
    });

    // 3rd (true) use async
    xhttp.open(method, url, true);
    
    const token = getCookie('jwt-token');
    // set authentication jsonwebtoken string
    xhttp.setRequestHeader('Authentication', token.value);

    if (method === 'POST') {
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        // send data with POST method
        let encodedObj = encodeURIComponent(JSON.stringify(data));
        xhttp.send(`encodedObj=${encodedObj}`);
    } else {
        xhttp.send();
    }
}

function fetchData(url, callback) {
    fetch(url)
        .then(res => res.json())
        then(data => {
            callback(null, data);
        })
        .catch(err => {
            console.error(err);
            callback(err, false);
        });
}

function convertObjToQS(obj) {
    // flat data into [ [k, v], [k, v], ... ]
    // return query string
    return Object.entries(obj)
        .map(([k, v]) => k + '=' + v)
        .join('&')
}

function sendGetRequest(url, callback) {
    sendRequest(url, null, 'GET', callback);
}

function sendPostRequest(url, data, callback) {
    sendRequest(url, data, 'POST', callback);
}

function sendPutRequest(url, data, callback) {
    sendRequest(url, data, 'PUT', callback);
}

function sendDeleteRequest(url, callback) {
    sendRequest(url, null, 'DELETE', callback);
}