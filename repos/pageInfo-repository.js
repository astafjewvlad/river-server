const fs = require('fs');
const path = require('path');

const byRoot = (filepath) => path.join(__dirname, filepath);

const getAbout = new Promise((resolve, reject) => {
  fs.readFile(byRoot('about.json'), (err, data) => {
    if (err) return reject(err);
    return resolve(JSON.parse(data));
  });
});

const getSocialLinks = new Promise((resolve, reject) => {
  fs.readFile(byRoot('socials.json'), (err, data) => {
    if (err) return reject(err);
    return resolve(JSON.parse(data).socialLinks);
  });
});

module.exports = {
  getAbout,
  getSocialLinks,
};
