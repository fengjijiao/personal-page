        var w = new Worker('/assets/js/speedtest.f.js') // create new worker
setInterval(function () { w.postMessage('status') }, 100) // ask for status every 100ms
        w.onmessage = function (event) { // when status is received, split the string and put the values in the appropriate fields
console.log(event.data);
            var data = JSON.parse(event.data); //fetch speedtest worker output
            document.getElementById('download').textContent = data.dlStatus + ' Mbit/s'
            document.getElementById('upload').textContent = data.ulStatus + ' Mbit/s'
            document.getElementById('ping').textContent = data.pingStatus + ' ms, ' + data.jitterStatus + ' ms jitter'
            document.getElementById('ip').textContent = data.clientIp
        }
w.postMessage('start') // start the speedtest (default params. keep garbage.php and empty.dat in the same directory as the js file)