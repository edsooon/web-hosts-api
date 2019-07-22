'use strict';
const mongoose = require('mongoose');
const Host = mongoose.model('Hosts');

exports.get = async() => {
    const res = await Host.find();
    return res;
}

exports.create = async(data) => {
    var host = new Host(data);
    await host.save();
}

exports.update = async(id, data) => {
    await Host
        .findByIdAndUpdate(id, {
            $set: {
              name: data.name,
              description: data.description,
              storeId: data.storeId
            }
        });
}

exports.delete = async(id) => {
    await Host
        .findByIdAndDelete(id);
}

exports.getByName = async(name) => {
    const res = await Host
        .find({name: name});
    return res;
}


