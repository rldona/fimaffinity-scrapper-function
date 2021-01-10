const functions = require('firebase-functions');
const puppeteer = require('puppeteer');

const { config, spanish } = require('./config');
const { getUrl } = require('./utils');
const { getFilmaffinityReview } = require('./scrapper-page');
const { initialize, getCollection, updateDocumentFromCollection } = require('./db/mongodb');

exports.scrapper = functions.runWith(config.runtimeOpts).region(config.runtimeOpts.region).https.onRequest(async (req, res) => {
  const index = req.query.index;

  const mongodb = await initialize();
  const mongodbCollection = await getCollection(mongodb, config.mongodb.database, config.mongodb.collection);
  const mongodbCollectionError = await getCollection(mongodb, config.mongodb.database, config.mongodb.collection_error);

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

  try {
    let browserLoad = await page.goto(url, { waitUntil: spanish.LOAD, timeout: 0 });

    if (browserLoad.status() === 200) {
      const review = await getFilmaffinityReview(page);
      const doc = { index, ...review, url };
      const item = await mongodbCollection.find({ 'index' : index }).limit(1).count();

      if (item) {
        await updateDocumentFromCollection(mongodbCollection, index, review, true);
      } else {
        await mongodbCollection.insertOne(doc);
      }

      res.json(doc);
    }
  } catch (error) {
    const log = { index, error: `${error}` };
    await mongodbCollectionError.insertOne(log);
    res.json(log);
  } finally {
    await browser.close();
  }
});
