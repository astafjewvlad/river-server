const fs = require('fs');
const path = require('path');

const byRoot = (filepath) => path.join(__dirname, filepath);

const getAll = new Promise((resolve, reject) => {
  fs.readFile(byRoot('./tracks.json'), (err, data) => {
    if (err) return reject(err);
    const { tracks } = JSON.parse(data);
    return resolve(tracks);
  });
});

module.exports = {
  getAll,
};
