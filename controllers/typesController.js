const sequelize = require('../config/db.js');
const { Type } = require('../models/types.js');
const { createDynamicTable } = require('../models/dbSetup');

//create a new type and corresponding table
async function createType (req, res){
    const { id, name, fields, desc } = req.body;

    try{
        //check if the type alrready exists
        const existingType = await Types.findBypk(id);
        if(existingType){
            return res.status(400).json({message: 'Type with this ID already exists.'});
        }

        //insert into the types table
        await Types.create({ id, name, fields, desc });

        //create dynmaic table for the type
        await createDynamicTable(id, fields);

        res.status(201).json({id});
    }catch(error){
        console.error('Error creating types: ',error);
        res.status(500).json({message: 'Internal server error'});
    }
    }

    //get all types
    async function getAllTypes(req, res){
        try{
            const types = await Types.findAll();
            res.status(200).json(types);
        }catch(error){
            console.error('Error fetching types: ',error);
            res.status(500).json({message: 'Internal server error'});
        }
    }

    //get a specific type by id
    async function getTypeById(req, res){
        const {typeId} = req.params;

        try{
            const type = await Types.findBypk(typeId);
            if(!type){
                return res.status(404).json({message: 'Type not found.'});
            }

            res.status(200).json(type);
        }catch(error){
            console.error('Error fetching type: ',error);
            res.status(500).json({message: 'Internal server error'});
        }
    }

module.exports = { createType, getAllTypes, getTypeById };
