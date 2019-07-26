'use strict';

const repository =  require('../repositories/host-repository');
const Host = require('../models/hosts');
const HOST_PADRAO = 'PADRAO';
const TITLE_SEPARATOR_LEFT = '#-------------------- '
const TITLE_SEPARATOR_RIGHT = ' ---------------------'
const LINE_BREAK = '\n';
const pathArchive = '/path/hosts';
const fs = require('fs');
const ValidationContract = require('../validators/validator');

exports.post = async(req, res, next) => {

    let contract = new ValidationContract();
    contract.isRequired(req.body.name, 'Name Host is required');
    contract.isRequired(req.body.description, 'Host is required');
    contract.isRequiredSelect(req.body.storeId, 'Store is required');



    // Se os dados forem inválidos
    if (!contract.isValid()) {
        res.status(400).send({ message : { errors: contract.errors() } }).end();
        return;
    }
    
    try {
       
        await repository.create({
            name: req.body.name,
            description: req.body.description,
            storeId: req.body.storeId

        });
       
        res.status(201).send({
            message: 'Host cadastrado com sucesso!'
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
    contract.isRequired(req.body.name, 'Name Host is required');
    contract.isRequired(req.body.description, 'Host is required');
    contract.isRequiredSelect(req.body.storeId, 'Store is required');

    // Se os dados forem inválidos
    if (!contract.isValid()) {
        res.status(400).send({ message : { errors: contract.errors() } }).end();
        return;
    }

    try {

       await repository.update(req.params.id, req.body);
          res.status(200).send({
          message: 'Host atualizado com sucesso!'
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
            message: 'Host deletado com sucesso!'
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};

exports.getAll = async(req, res, next) => {
    try {
        var data = await repository.get();  
        data.shift();

        var fileContent = fs.readFileSync(pathArchive).toString();      
        
        for(var d in data) {   
            const regex = new RegExp('\\b' + data[d].name + '\\b');
            if (regex.test(fileContent)) {
                data[d].setado = 'checked';                
           }
        }
                
        res.status(200).send(data);
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: e
        });
    }
}

exports.getByName = async(req, res, next) => {
    try {
        var data = await repository.getByName(req.query.name);       
        res.status(200).send(data);
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: e
        });
    }
}


exports.inject = async(req, res, next) => {
    
    try {
  
        var padrao  = await repository.getByName(HOST_PADRAO); 
                      
        var hosts  = await repository.getByName(req.query.name);

        for(var h in hosts) {
            padrao.push(hosts[h]);
        }

        var description;
       
        for(var p in padrao) {
            var host = new Host(padrao[p]);
            
            if(description == null){
                description = (TITLE_SEPARATOR_LEFT.concat(host.name).concat(TITLE_SEPARATOR_RIGHT)).concat(LINE_BREAK).concat(host.description);;
            } else {
                description += LINE_BREAK.concat(LINE_BREAK).concat(TITLE_SEPARATOR_LEFT.concat(host.name).concat(TITLE_SEPARATOR_RIGHT)).concat(LINE_BREAK).concat(host.description);
            }

         }

        
         fs.writeFileSync(pathArchive, description);
         var hostsReturn = fs.readFileSync(pathArchive).toString();

        res.status(200).send({
            hostsReturn: hostsReturn
        });
    } catch (e) {
        res.status(500).send({
            message: e
        });
    }
};
