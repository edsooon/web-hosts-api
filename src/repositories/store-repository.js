'use strict';
const mongoose = require('mongoose');
const Store = mongoose.model('Stores');

exports.get = async() => {
    const res = await Store.find();
    return res;
}




