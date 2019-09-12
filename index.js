const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

const server = {
  ip: process.env.OPENSHIFT_NODE_JS_IP || '128.0.0.1',
  port: process.env.OPENSHIFT_NODE_JS_PORT || 8080,
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

app.listen(server.port, server.ip, () => {
  console.log(`Server started! Listening ${server.ip}:${server.port}`);
});
