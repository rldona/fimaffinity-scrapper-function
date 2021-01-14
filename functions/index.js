const functions = require('firebase-functions');
const puppeteer = require('puppeteer');

const { config, spanish } = require('./config');
const { getUrl } = require('./utils');
const { getFilmaffinityReview } = require('./scrapper-page');

exports.scrapper = functions.runWith(config.runtimeOpts).region(config.runtimeOpts.region).https.onRequest(async (req, res) => {
  const index = parseInt(req.query.index) || null;

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

  page.on(spanish.REQUEST, (request) => {
    if (request.resourceType() === spanish.DOCUMENT) {
      request.continue();
    } else {
      request.abort();
    }
  });

  const url = getUrl(index);

  let browserLoad = await page.goto(url, { waitUntil: spanish.LOAD, timeout: 0 });

  if (browserLoad.status() === 200) {
    const review = await getFilmaffinityReview(page);
    const doc = { index, ...review, url };
    res.json(doc);
  } else {
    res.send(null);
  }

  await browser.close();

});
