'use strict';

const repository =  require('../repositories/host-repository');
const Host = require('../models/hosts');
const HOST_PADRAO = 'PADRAO';
const TITLE_SEPARATOR_LEFT = '#-------------------- '
const TITLE_SEPARATOR_RIGHT = ' ---------------------'
const LINE_BREAK = '\n';
const pathArchive = '/etc/hosts';

exports.post = async(req, res, next) => {
    
    try {
       
        await repository.create({
            name: req.body.name,
            description: req.body.description

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

exports.getAll = async(req, res, next) => {
    try {
        var data = await repository.get();  
        data.shift();       
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

         var fs = require('fs');
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
