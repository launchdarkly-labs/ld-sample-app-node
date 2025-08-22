# LaunchDarkly Sample App for NodeJS and JavaScript

## Requirements

* npm 11 or higher
* NodeJS 24 or higher
* LaunchDarkly Flags:
  - **Release: UI Enhancements**, key: `release-ui-enhancements`
  - **Release: Home Page Slider**, key: `release-home-page-slider`
  - **Coffee Promo 1**, key: `coffee-promo-1`
  - **Coffee Promo 2**, key: `coffee-promo-2`
  - **Banner Text**, key: `banner-text`

## Setup

To get started, clone this repo locally

```
git clone https://github.com/launchdarkly-labs/ld-sample-app-node.git
cd ld-sample-app-node
```

Install libraries

```
npm install
```

Add LaunchDarkly keys

* Rename `.env.example` to `.env`
* In the `.env` file, replace the fake keys with your LaunchDarkly SDK key and client-side key

## Run

To run the site:

```
node app.js
```

In your browser, navigate to:

```
http://localhost:3000
```

Enjoy!