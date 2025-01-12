// Local server to serve an HTML to execute RF Code on a local network
// Send rf code by syscall (no dependancies)
// open in a browser http://localhost:37123/
// call example curl -X "POST" http://localhost:37123 --data '{"code":"1234"}'
// call example curl -X "POST" http://localhost:37123 --data '{"code":"outputkitchen"}'
// call example curl -X "POST" http://localhost:37123 --data '{"key":"abcd1234efff","code":"1234"}'
var exec = require('child_process').exec;

const http = require('http');

function trim(str) {
    return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
};

var server = http.createServer(function(req, res) {
    if (req.method === 'OPTIONS') {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('200');
        return;
    }
    if (req.method === 'GET') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('<html itemscope="" itemtype="http://schema.org/WebPage" lang="en"><head><meta charset="UTF-8"><meta content="origin" name="referrer"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Local Server to send RF call</title><style>body{background:black}h1{text-align:center;font-family:Quicksand,"Source Sans Pro",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;display:block;font-weight:300;font-size:32px;color: #004f88;}body{user-select:none; display: flex; align-items: center; flex-direction: column;}.mopt{cursor: pointer; display:block; width:140px; height:140px; text-align: center; line-height: 140px; margin:0 10px 10px 0; padding:10px 21px; text-transform:uppercase; font-weight:400; font-size:16px; text-transform: uppercase; color:white; /*#3e3e3e;*/ background:#53b7e8; /*#7cb289;*/ background:#004f88; border:none; float: left;}.mopt:active{background: red;}a, a:hover, a:visited, a:focus{color: gold; text-decoration: underline;}</style></head><body><h1>Local Server to send RF call</h1><br><br><button class="mopt" onclick="sendLocalMsg(\'outputkitchen\')">Kitchen</button> <button class="mopt" onclick="sendLocalMsg(\'outputlivingroom\')">Livingroom</button> <script>function sendLocalMsg(msg){var headers=new Headers(); headers.append(\'Content-type\', \'application/json\'); var init={headers: headers, body: JSON.stringify({code: msg}),}; init.method=\'POST\'; var query=new Request(window.location.protocol+\'//\'+window.location.host, init); fetch(query, init) .then(function(response){console.log(response);});}</script> </body></html>');
        return;
    }
    if (req.method !== 'POST') {
        res.writeHead(400, {'Content-Type': 'text/plain'});
        res.end('404');
        return;
    }
    var body = '';
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
        try{
            let codeNum = 0;
            body = JSON.parse(body);
            console.log(body);
            // if (!body['key'] || body['key'] !== 'abcd1234efff') {
            //     throw new Error('auth failed');
            // }
            if (!body['code'] || trim(body['code']) === '') {
                throw new Error('code failed');
            }
            codeNum = trim(body['code']);
            const cmd = exec("python /home/pi/workspace/raspberry5-433mhz-rpi-lgpio-public/autosend.py /home/pi/workspace/raspberry5-433mhz-rpi-lgpio-public/" + codeNum , function(err, stdout, stderr) {
                if (err) {
                    console.error(stderr); 
                }
                console.log(stdout);
              });
        }
        catch(e) {
            /* Not a JSON. Write error */
            res.writeHead(400, {'Content-Type': 'application/json'})
            res.end(JSON.stringify({success: false, error: e.message}))
            return
        }
        /* Do your stuff with request and respond with a propper challenge field */
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify({success: true}))
    });
});


console.log('Server started on 37123');
server.listen(37123);
