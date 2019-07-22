'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: [true, 'The field Name Host is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'The field Host is required'],
        trim: true
    },
    storeId: {
        type: String,
        required: [true, 'The field Store Host is required'],
        trim: true
    },
    setado: {
        type: String,
        default:''
    }
});

module.exports = mongoose.model('Hosts', schema);