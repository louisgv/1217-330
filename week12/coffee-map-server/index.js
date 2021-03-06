const http = require('http');

const coffee = require('./coffee-data.js');

const building = require('./building-data.js');

const port = process.env.PORT || process.env.NODE_PORT || 8000;

const onRequest = (req, res,) => {

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    res.writeHead(200, headers);

    switch (req.url) {
        case '/coffee.json':
            res.write(JSON.stringify(coffee));
            break;
        case '/building.json':
            res.write(JSON.stringify(building));
            break;
        default:
            res.writeHead(404, headers);
            res.write(JSON.stringify(new Error('URL not recognized')));
    }

    res.end();
}

http.createServer(onRequest).listen(port);

console.log(`Listening on localhost:${port}`);
