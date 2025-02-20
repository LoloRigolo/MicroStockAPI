const http = require('http');
const https = require('https');

function verifierExistance(url) {
    return new Promise(function (resolve, reject) {
        const lib = url.startsWith('https') ? https : http;

        const req = lib.get(url, function (res) {
            if (res.statusCode === 200) {
                resolve(true);
            } else if (res.statusCode === 404) {
                resolve(false);
            } else {
                reject(new Error(`Erreur HTTP: ${res.statusCode}`));
            }
        });

        req.on('error', function (err) {
            reject(err);
        });

        req.end();
    });
}


module.exports = { verifierExistance };
