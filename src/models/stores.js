'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    storeId: {
        type: String,        
        trim: true,
    }
});

module.exports = mongoose.model('Stores', schema);