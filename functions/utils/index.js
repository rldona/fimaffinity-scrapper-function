function getUrl (id, language) {
  return `https://www.filmaffinity.com/${language}/film${id}.html`
}

module.exports = {
  getUrl
}
