import { createServer } from "node:http";
import ld from "@launchdarkly/node-server-sdk";

// Setup initial parameters
const hostname = "127.0.0.1";
const port = 3000;
const client = ld.init(process.env.LD_SDK_KEY);

// set initial flag value
var flagValue = false;

// create the context for the flag
const context = {
    "kind": 'device',
    "key": '018ee279-5afe-7ed7-a362-3a41867e8ad6',
    "name": 'Linux'
};

// get the startup flag value
client.once('ready', () => {
    client.variation('test-flag', context, false,
        (err, flagval) => {
            flagValue = flagval;
        });
});

// create server instance
const server = createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Hello World! The flag value is '" + flagValue + "'")
    console.log("Connection made");
});

// create launchdarkly listener to listen for flag updates
client.on("update:test-flag", () => {
    client.variation("test-flag", context, false, (err, value) => {
        flagValue = value;
        console.log("The test-flag value has changed. It is now '" + flagValue + "'")
    });
})

// close the ld client connectio when the server stops
server.on("close", function () {
    console.log("Stopping server...");
    client.flush();
    client.close();
})

// close the server on ^C
process.on("SIGINT", function () {
    server.close(function () {
        process.exit(0);
    });
})

// run the server
server.listen(port, hostname, () => {
    console.log("Server running at http://${hostname}:${port}/");
});
