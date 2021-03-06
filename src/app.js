'use stritc'

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();
const router = express.Router();

// Connecta ao banco
mongoose.connect(config.connectionString);

// Carrega os Models
const hosts = require('./models/hosts');
// Carrega os Models
const stores = require('./models/stores');


// Carrega as Rotas
const indexRoute = require('./routes/index-route');
const hostRoute = require('./routes/hosts-route');
const storeRoute = require('./routes/stores-route');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.use('/', indexRoute);
app.use('/hosts', hostRoute);
app.use('/stores', storeRoute);
module.exports = app;