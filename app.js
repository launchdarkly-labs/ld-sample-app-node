const LaunchDarkly = require('@launchdarkly/node-server-sdk');
const dotenv = require('dotenv').config();
const nunjucks = require('nunjucks');
const express = require('express');
const app = express();
const hostname = "0.0.0.0";
const port = 3000;
const ldclient = LaunchDarkly.init(process.env.LD_SDK_KEY);
const path = require('path');
const publicDirectoryPath = path.join(__dirname, 'src/public');
const fs = require('fs');

const context = {
    "kind": "multi",
    "user": {
        "key": "user-018e7bd4-ab96-782e-87b0-b1e32082b481",
        "name": "Miriam Wilson",
        "language": "en",
        "tier": "premium",
        "userId": "mwilson",
        "role": "developer",
        "email": "miriam.wilson@example.com",
    },
    "device": {
        "key": "device-018e7bd4-ab96-782e-87b0-b1e32082b481",
        "os": "macOS",
        "osVersion": "15.6",
        "model": "MacBook Pro",
        "manufacturer": "Apple",
    },
};

nunjucks.configure('src/templates', {
    autoescape: true,
    express: app
});

ldclient.on('ready', () => {
    console.log("LaunchDarkly client is ready");
});

fs.writeFile('src/public/static/js/keys.js', 'const clientKey = "' + process.env.LD_CLIENT_KEY + '";', (err) => {
    if (err) {
        console.error('Error writing file:', err);
        return;
    }
    console.log('File "keys.js" has been written successfully!');
});

app.use(express.static(publicDirectoryPath));

app.get('/', async (req, res) => {
    var currentRouteRule = req.originalUrl
    var homePageSlider = await ldclient.variation('release-home-page-slider', context, false);
    var coffeePromo1 = await ldclient.variation("coffee-promo-1", context, false);
    var coffeePromo2 = await ldclient.variation("coffee-promo-2", context, false);

    res.render('index.html', {
        currentRouteRule: currentRouteRule,
        homePageSlider: homePageSlider,
        coffeePromo1: coffeePromo1,
        coffeePromo2: coffeePromo2
    });
});

app.get('/about', async (req, res) => {
    var currentRouteRule = req.originalUrl
    res.render('about.html', { currentRouteRule: currentRouteRule });
});

app.get('/contact', async (req, res) => {
    var currentRouteRule = req.originalUrl
    res.render('contact.html', { currentRouteRule: currentRouteRule });
});

app.get('/products', async (req, res) => {
    var currentRouteRule = req.originalUrl
    res.render('products.html', { currentRouteRule: currentRouteRule });
});

app.get('/api/banner', async (req, res) => {
    var bannerText = await ldclient.variation("banner-text", context, "No banner text found!");
    res.json({ primaryBanner: bannerText });
});

const server = app.listen(port, () => {
    console.log(`Express server listening at http://${hostname}:${port}`);
});

// close the ld client connectio when the server stops
server.on("close", function () {
    console.log("Closing LaunchDarkly connection...");
    ldclient.flush();
    ldclient.close();
})

// close the server on ^C
process.on("SIGINT", () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
})
