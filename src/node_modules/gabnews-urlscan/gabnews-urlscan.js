// urlscan-api.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

'use strict';

const request = require('request-promise-native');

class UrlScanner {

  constructor (options) {
    var scanner = this;
    scanner.options = options;
  }

  scanUrl (url) {
    var scanner = this;
    var requestOptions = {
      method: 'POST',
      uri: 'https://urlscan.io/api/v1/scan/',
      headers: {
        'Content-Type': 'application/json',
        'API-Key': scanner.options.apiKey
      },
      body: {
        url: url,
        public: scanner.options.public ? 'on' : undefined
      },
      json: true
    };
    return request(requestOptions);
  }

  getResult (scanUuid) {
    var scanner = this;
    var requestOptions = {
      method: 'GET',
      uri: `https://urlscan.io/api/v1/result/${scanUuid}/`,
      headers: {
        'Content-Type': 'application/json',
        'API-Key': scanner.options.apiKey
      },
      json: true
    };
    return request(requestOptions);
  }
}

module.exports = (globalOptions) => {
  return new UrlScanner(globalOptions);
};