const sequelize = require('../config/db');
const {Sequelize, DataTypes } = require('sequelize');
const Type = require('../models/types.js');
// const { createDynamicTable } = require('../models/dbSetup');

//create a new type and corresponding table
exports.createType = async (req, res) => {
    
    try {
        const { name, fields, desc } = req.body;

        //validate the payload
        if(!name || !fields || !Array.isArray(fields) || fields.length === 0){
            return res.status(400).json({error: 'Name and fields required'});
        }

        await Type.sync();
        
        //create a new type entry in the 'types' table
        const newType = await Type.create({name, fields, description: desc});

        //extract the generated type id
        const typeId = newType.id;

        //prepare dynamic table creation SQL
        const tableName = `type_${typeId}`;
        const columns = fields.map(
            (field) => `"${field.name}" ${field.datatype.toUpperCase()}`
        );

        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS "public"."${tableName}"(
            "id" SERIAL PRIMARY KEY,
            ${columns.join(', ')}
        );
    `;
    
    //execute the synamic table creation query
    await sequelize.query(createTableQuery, {type: Sequelize.QueryTypes.RAW });

    res.status(201).json({
        message: 'Type created successfully and tabel created',
        typeId,
        tableName,
    });
    }catch(error){
        console.error('Error creating type: ', error);
        res.status(500).json({error: 'Internal server error'});
    }
};
    //get all types
exports.getAllTypes = async(req, res) => {
    try{
        const types = await Type.findAll();
        res.status(200).json(types);
    }catch(error){
        console.error('Error fetching types: ',error);
        res.status(500).json({message: 'Internal server error'});
    }
}

//get a specific type by id
exports.getTypeById = async(req, res) => {
        const {typeId} = req.params;

        try{
            const type = await Type.findByPk(typeId);
            if(!type){
                return res.status(404).json({message: 'Type not found.'});
            }

            res.status(200).json(type);
        }catch(error){
            console.error('Error fetching type: ',error);
            res.status(500).json({message: 'Internal server error'});
        }
    }

// module.exports = { createType, getAllTypes, getTypeById };
