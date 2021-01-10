const language = 'es';

const spanish = {
  'REQUEST': 'request',
  'DOCUMENT': 'document',
  'SCRAPPER': 'scrapper',
  'LOAD': 'load',
  'SLEEP_60_MINUTES': `\n Sleeping 60 minutes...\n`,
  'REVIEWS_NORMAL': `reviews-${language}`,
  'REVIEWS_ERROR': `reviews-${language}-error`,
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
  },
  range: {
    start: parseInt(process.argv[2]),
    end: parseInt(process.argv[3])
  },
  proxy: {
    range: {
      min: 52,
      max: 62
    }
  },
  sleep: {
    shortMinutes: 5,
    longMinutes: 60,
    multipleCheck: 1000,
    milisecondsConverter: 60000
  },
  mongodb: {
    database: 'filmaffinity-db',
    collection: 'reviews-es-test',
    collection_error: 'reviews-es-test-error',
  }
}

module.exports = {
  spanish,
  config
};
