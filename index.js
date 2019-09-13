const express = require('express');

const app = express();

const homeRouter = require('./routes/home-router');

const server = {
  ip: process.env.IP || process.env.OPENSHIFT_NODE_JS_IP || '0.0.0.0',
  port: process.env.PORT || process.env.OPENSHIFT_NODE_JS_PORT || 8080,
};

app.use(express.static('public'));

app.set('view engine', 'pug');
app.set('views', './templates');

app.use('/', homeRouter);

app.listen(server.port, server.ip, () => {
  console.log(`Server started! Listening ${server.ip}:${server.port}`);
});
