const { config } = require('../config');

function getUrl (id) {
  return `https://www.filmaffinity.com/${config.language}/film${id}.html`
}

module.exports = {
  getUrl
}
