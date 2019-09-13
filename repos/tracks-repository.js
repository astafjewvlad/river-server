const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const byRoot = (filepath) => path.join(__dirname, filepath);

const readFile = promisify(fs.readFile);

const getAll = new Promise((resolve, reject) => {
  readFile(byRoot('tracks.json'))
    .then((data) => {
      const { tracks } = JSON.parse(data);
      return resolve(tracks);
    })
    .catch(reject);
});

const getAllOr = (orDefault) => new Promise((resolve) => {
  getAll
    .then(resolve)
    .catch(() => resolve(orDefault));
});

module.exports = {
  getAll,
  getAllOr,
};
