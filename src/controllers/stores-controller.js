'use strict';

const repository =  require('../repositories/store-repository');
const Host = require('../models/stores');
const ValidationContract = require('../validators/validator');

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

exports.post = async(req, res, next) => {

    let contract = new ValidationContract();
    contract.isRequired(req.body.storeId, 'Store Id is required');
   
    // Se os dados forem inválidos
    if (!contract.isValid()) {
        res.status(400).send({ message : { errors: contract.errors() } }).end();
        return;
    }
    
    try {
       
        await repository.create({
            storeId: req.body.storeId
        });
       
        res.status(201).send({
            message: 'Store Id cadastrado com sucesso!'
        });

    } catch (e) {
        console.log(e);        
        res.status(500).send({
            message: e
        });
    }
};


exports.put = async(req, res, next) => {

    let contract = new ValidationContract();
    contract.isRequired(req.body.storeId, 'Store Id is required');

    // Se os dados forem inválidos
    if (!contract.isValid()) {
        res.status(400).send({ message : { errors: contract.errors() } }).end();
        return;
    }

    try {

       await repository.update(req.params.id, req.body);
          res.status(200).send({
          message: 'Store atualizado com sucesso!'
        });        
        
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};

exports.delete = async(req, res, next) => {
    try {
        await repository.delete(req.params.id);
        res.status(204).send({
            message: 'Store deletado com sucesso!'
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};