// Fetch 1st collumn of an AirTable table and send RF Query if code match then execute the RF send and delete the entry in AirTable table.

// Run with : nohup node /home/pi/workspace/node-query-handler-airtable/index.js 1>&2 /home/pi/workspace/node-query-handler-airtable/output.log &

var exec = require('child_process').exec;

const https = require('https');

var sendAirTable = function(method, uri, data, cb) {
    let payload = '';
    if (data) {
        payload = JSON.stringify(data)
    }
    const options = {
        hostname: 'api.airtable.com',
        port: 443,
        path: uri,
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer XXXXXX',
            'Content-Length': payload.length
        }
    };
    const req = https.request(options, cb);
    if (payload.length > 0) {
        req.write(payload);
    }
    req.end();
    return req;
};

const validRfCodes = [
    'outputkitchen', //Kitchen
    'outputlivingroom', //Livingroom
];
 
setInterval(function() {
    // console.log('check src');
    const query = sendAirTable('GET', '/v0/appXXX/YourTable', '', function(res) {
        //console.log(`statusCodeGet1: ${res.statusCode}`);
        var returnData = '';
        res.on('data', (chunk) => {
            returnData += chunk;
        });
        res.on('end', () => {
            const json = JSON.parse(returnData);
            if (json && json.records.length) {
                for (let index = 0; index < json.records.length; index++) {
                  var lastAction = '';
                  if (json.records[index].id) {
                      if (json.records[index].fields && json.records[index].fields.Name && json.records[index].fields.Name !== '') {
                        lastAction =  json.records[index].fields.Name;
                        console.log('last action', lastAction);
                        // Execute local action
                        lastAction = 'rfsend' + lastAction; 
                        let rfMatch = lastAction.match(/rfsend\s?(.*)/g);
                        if (rfMatch && rfMatch[0]) {
                            rfMatch = rfMatch[0].toString().replace('rfsend','');
				if (validRfCodes.indexOf(rfMatch) !== -1) {
                                const cmd = exec("python /home/pi/workspace/raspberry5-433mhz-rpi-lgpio-public/autosend.py /home/pi/workspace/raspberry5-433mhz-rpi-lgpio-public/" + rfMatch , function(err, stdout, stderr) {
                                    if (err) {
                                        console.error(stderr); 
                                    }
                                    console.log(stdout);
                                });
                            }
                        }
                        const subQuery = sendAirTable('DELETE', '/v0/appXXX/YourTable/' + json.records[index].id, '', function(res) {
                            // console.log(`statusCodeDel1: ${res.statusCode}`);
                        });
                      }
                    }
                }
            }
        });
        // res.on('error', (error) => {;
        //     console.error(error);
        // });
    });

}, 5000);

