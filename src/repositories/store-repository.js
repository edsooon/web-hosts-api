'use strict';
const mongoose = require('mongoose');
const Store = mongoose.model('Stores');

exports.get = async() => {
    const res = await Store.find();
    return res;
}

exports.create = async(data) => {
    var store = new Store(data);
    await store.save();
}

exports.update = async(id, data) => {
    await Store
        .findByIdAndUpdate(id, {
            $set: {
              storeId: data.storeId
            }
        });
}

exports.delete = async(id) => {
    await Store
        .findByIdAndDelete(id);
}


