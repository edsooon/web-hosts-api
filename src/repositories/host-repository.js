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

exports.getByName = async(name) => {
    const res = await Host
        .find({name: name});
    return res;
}


