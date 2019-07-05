'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    storeId: {
        type: String,
        required: true,
        trim: true
    },
    setado: {
        type: String,
        default:''
    }
});

module.exports = mongoose.model('Hosts', schema);