const language = 'es';

const spanish = {
  'REQUEST': 'request',
  'DOCUMENT': 'document',
  'LOAD': 'load'
}

const config = {
  runtimeOpts: {
    region: 'europe-west1',
    timeoutSeconds: 60,
    memory: '2GB'
  },
  language: language,
  databaseURL: 'https://filmaffinity-api.firebaseio.com',
  headless: true,
  ignoreHTTPSErrors: true,
  args: {
    noSandbox: '--no-sandbox',
    disableSetuid: '--disable-setuid-sandbox'
  },
  setRequestInterception: true,
  view: {
    width: 1024,
    height: 2500
  }
}

module.exports = {
  spanish,
  config
};
