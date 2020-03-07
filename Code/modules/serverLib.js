/*
GameJS - serverLib.js
Version 1.0.0-alpha1
License: MIT
Copyright (c) 2020 Jack KA Freund
*/

const http = require("http");
const fs = require("fs");

exports.startServer = function (host, port, name, data) {
    console.log(`Starting server for ${name}`);
    function handle (req, res) {
        console.log(data);
        try {
            var fileData = fs.readFileSync(data["files"][req.url]);
            res.writeHead(200, {"Content-Type":"text/html"}); // Send heads with the content type
            res.write(fileData); // write the corresponding file from 'data'
        } catch(err) {
            console.log("\nError encountered in sending file: " + err);
            console.log("Sending 404\n");
            res.writeHead(404, {"Content-Type":"text/html"}); // Send heads with 404
        };
        
        res.end();

    }
    var app = http.createServer(handle); // create the server with the function handling
    app.listen(port, host); // start the server
}