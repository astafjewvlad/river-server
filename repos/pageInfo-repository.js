const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);

const byRoot = (filepath) => path.join(__dirname, filepath);

const getAbout = new Promise((resolve, reject) => {
  readFile(byRoot('about.json'))
    .then((data) => resolve(JSON.parse(data)))
    .catch(reject);
});

const getAboutOr = (byDefault) => new Promise((resolve) => {
  getAbout
    .then(resolve)
    .catch(() => resolve(byDefault));
});

const getSocialLinks = new Promise((resolve, reject) => {
  readFile(byRoot('socials.json'))
    .then((data) => resolve(JSON.parse(data).socialLinks))
    .catch(reject);
});

const getSocialLinksOr = (byDefault) => new Promise((resolve) => {
  getSocialLinks
    .then(resolve)
    .catch(() => resolve(byDefault));
});

module.exports = {
  getAbout,
  getAboutOr,
  getSocialLinks,
  getSocialLinksOr,
};
