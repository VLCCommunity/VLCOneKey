const express = require('express');

function startServer({ host, port, onSuccess }) {
  const app = express();

  app.set('view engine', 'ejs');
  app.use(express.static('public'));
  app.use(express.json());
  app.use(require('./router/authentication'));
  app.use(require('./router/redirects'));

  // Start the server
  app.listen({ host, port }, onSuccess);
}

module.exports = startServer;
