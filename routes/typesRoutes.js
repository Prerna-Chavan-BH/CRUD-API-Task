const express = require('express');
const { createType, getAllTypes, getTypeById } = require('../controllers/typesController');

const router = express.Router();

//POST /types: create a new type
router.post('/types', createType);

//GET /types: get all types
router.get('/types', getAllTypes);

//GET /types/:typeId: get a specific type by ID
router.get('/types/:typeId', getTypeById);

module.exports = router;
