const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

const server = {
  host: 'localhost',
  port: 5500,
};

const byRoot = (filepath) => path.join(__dirname, filepath);

app.use(express.static('public'));

app.set('view engine', 'pug');
app.set('views', './templates');

app.get('/', (req, res) => {
  fs.readFile(byRoot('/repos/tracks.json'), (tracksErr, tracksData) => {
    const { tracks } = (tracksErr) ? [] : JSON.parse(tracksData);
    fs.readFile(byRoot('/repos/socials.json'), (linksErr, linksData) => {
      const { socialLinks } = (linksErr) ? [] : JSON.parse(linksData);
      fs.readFile(byRoot('/repos/about.json'), (aboutErr, aboutData) => {
        const about = (aboutErr) ? {} : JSON.parse(aboutData);
        res.render('index', { tracks, socialLinks, about });
      });
    });
  });
});

app.listen(server.port, server.host, () => {
  console.log(`Server started! Listening ${server.host}:${server.port}`);
});
