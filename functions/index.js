const functions = require('firebase-functions');
const puppeteer = require('puppeteer');

const { config, translations } = require('./config');
const { getUrl } = require('./utils');
const { getFilmaffinityReview } = require('./scrapper-page');

exports.scrapper = functions.runWith(config.runtimeOpts).region(config.runtimeOpts.region).https.onRequest(async (req, res) => {
  const index = parseInt(req.query.index) || null;
  const language = req.query.language || 'es';

  if (!index) {
    res.send(null);
  }

  const browser = await puppeteer.launch({
    headless: config.headless,
    ignoreHTTPSErrors: config.ignoreHTTPSErrors,
    args: [config.args.noSandbox, config.args.disableSetuid]
  });

  const page = await browser.newPage();

  await page.setViewport({ width: config.view.width, height: config.view.height });
  await page.setRequestInterception(config.setRequestInterception);

  page.on(translations.es.REQUEST, (request) => {
    if (request.resourceType() === translations.es.DOCUMENT) {
      request.continue();
    } else {
      request.abort();
    }
  });

  const url = getUrl(index, language);

  let browserLoad = await page.goto(url, { waitUntil: translations.es.LOAD, timeout: 0 });

  if (browserLoad.status() === 200) {
    const review = await getFilmaffinityReview(page);
    const doc = { index, ...review, url };
    res.json(doc);
  } else {
    res.send(null);
  }

  await browser.close();

});
