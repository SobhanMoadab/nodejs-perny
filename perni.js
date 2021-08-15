const http = require('http');
const app = require('./app');

const port = process.env.PORT || 8446;

const server = http.createServer(app);

server.listen(port, (err) => {
    if (err) console.log({ err })
    else console.log("Server Connected on port = " + port)
});
