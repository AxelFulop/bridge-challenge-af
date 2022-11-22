'use strict';

const urlscan = require('.');

var scanner = urlscan({
  apiKey: process.env.HYDRA_URLSCAN_API_KEY,
  public: true
});

scanner
.scanUrl('https://gabnews.com')
.then((response) => {
  console.log('urlscan.io response', response);
})
.catch((error) => {
  console.log('urlscan.io error', error);
});
