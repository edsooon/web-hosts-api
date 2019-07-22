'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/hosts-controller');

router.post('/', controller.post);
router.put('/:id', controller.put);
router.delete('/:id', controller.delete);
router.get('/', controller.getByName);
router.get('/all', controller.getAll);
router.get('/inject', controller.inject);



module.exports = router;