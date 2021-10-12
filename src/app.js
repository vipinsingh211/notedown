const express = require('express');
const compression = require('compression');
const helmet = require('helmet');

const { localStorage } = require('./route/localStorageRoute');

const app = express();
app.use(compression());
app.use(helmet());
app.use(express.json());

app.use('/local_storage', localStorage);

module.exports = app;
