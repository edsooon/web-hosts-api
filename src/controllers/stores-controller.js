'use strict';

const repository =  require('../repositories/store-repository');
const Host = require('../models/stores');

exports.getAll = async(req, res, next) => {
    try {
        var data = await repository.get();  
                        
        res.status(200).send(data);
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: e
        });
    }
}
