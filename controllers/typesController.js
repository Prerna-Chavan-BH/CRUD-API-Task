const Type = require('../models/types.js');
const Field = require('../models/types.js');

//POST type
exports.createType = async(req, res) => {
        const {id, name, fields, desc} = req.body;

        try
        {
            //check if the type already exists
            const existingType = await Type.findOne({ where: {name} });
            if(existingType){
                return res.status(400).json({
                    error: `Type with name "${name}" already exists`,
                });
            }

            //validate the required fields
            if(!id || !name || !Array.isArray(fields) || fields.length === 0 || !desc) {
                return res.status(400).json({error: 'Invalid data. "id", "name", "fields" and "desc" are required'});
            }

            //create the type
            const newType = await Type.create({id, name, desc});

            //create the fields record and associate them with the type
            const fieldPromises = fields.map((field) => {
                if(!field.name || !field.datatype) {
                    throw new Error('Each filed must have "name" and "datatype"');
                }
                return Field.create({...field, typeId: newType.id});
            });

            await Promise.all(fieldPromises);

            res.status(201).json({
                message: 'Type and fields created successfully', 
                data: newType
            });

        } catch(error){
            console.error('Error creating type and fields: ', error.message);
            res.status(500).json({error: error.message});
        }
    // console.log(req.body);
};

//GET /types
exports.getAlltypes = async(req, res) => {
    try{
        const types = await Type.findAll();
        res.json(types);
    } catch(err){
        res.status(500).json({error: err.message});
    }
};

//GET /types/:typeID
exports.getTypeById = async(req, res) => {
    try{
        const {typeId} = req.params;
        const type = await Type.findByPk(typeId);
        res.json(type || {});
    } catch(err){
        res.status(500).json({error: err.message});
    }
};
