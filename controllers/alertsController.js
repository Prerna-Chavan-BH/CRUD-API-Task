const sequelize = require('../config/db');
const { QueryTypes } = require('sequelize');
const jsonschema = require('jsonschema');
const Field = require('../models/fields');
const Type = require('../models/types')

//POST /alerts
exports.createAlerts = async (req, res) => {

    const { typeId, alerts } = req.body;
    try{
        //validate inputs
        if(!typeId || !alerts || !Array.isArray(alerts) || alerts.length === 0) {
            return res.status(400).json({error: 'Both types and alerts are required'});
        }
         
        //Retrieve type and its fields from the database
        const type = await Type.findOne({
            where: {id: typeId},
            include: [
                {
                    model: Field,
                    as: 'fields'
                }
            ]
        });

        //checking if the type exists
        if(!type){
            return res.status(404).json({error: 'Type not found'});
        }

        //Chevk if type has fields associated
        if (!type.fields || type.fields.length === 0){
            return res.status(404).json({error: 'Type has no fields'});
        }

        //Fetch fields associated with the typeId from the Field table
        const fields = await Field.findAll({where: { typeId }});
        
        //checking if type exists
        if (!fields || fields.length === 0){
            return res.status(404).json({error: 'Type not Found or has no fields'});
        }

        //Assuming alerts need to be inserted into a table dynamically
        const fieldNames = fields.map(field => `${field.name} ${field.datatype}`).join(', ');
        console.log('Fields: ', fieldNames);
        
        //Build SQL query for creating alerts table dynamically
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS public.alerts_${typeId}(
            id SERIAL PRIMARY KEY,
            ${fieldNames})`;

        //Execute the query to create a dynamic alerts table for the type
        await sequelize.query(createTableQuery);

        //Insert alerts into the created table
        const insertQuery = `
            INSERT INTO public.alerts_${typeId} (${fields.map(field => field.name).join(', ')})
            VALUES (${alerts.map(alert => `(${Object.values(alert).map(value => `'${value}'`).join(', ')})`).join(', ')});
            `;

        await sequelize.query(insertQuery);

        //Respond with success message
        res.status(201).json({message : 'Alerts created successfully'});

    } catch(err){
        console.error('Error creating alerts: ',err);
        res.status(500).json({error: err.message});
    }
    //console.log('Request body: ', res.body);
};

//Search alerts
exports.searchAlerts = async (req, res) => {
    try{
        const { fields, typeId, where, sorting, paging } = req.body;

        //Ensure typeID is provided
        if(!typeId){
            return res.status(400).json({error: "typeId is required"});
        }

        //build the SELECT fields
        const selectFields = fields.lenght ? fields.join(", ") : "*";

        //Build WHERE clause
        const whereConditions = where ? where.conditions.map(cond => {
            const values = cond.values.map(v => `'${v}'`).join(", ");
            return `${cond.field} ${cond.operator} (${values})`;
        }).join(` ${where.combine} `): '';

        //Build orderBy clause
        const orderBy = sorting ? sorting.map(sort => `${sort.field} ${sort.order}`).join(", "): '';

        //paging
        const pageSize = paging ?.pageSize || 10;
        const pageNumber= paging ?.pageNumber || 1;
        const limit = pageSize;
        const offset = (pageNumber - 1) * pageSize;

        //Final query
        const query = `
            SELECT ${selectFields}
            FROM public.type_${typeId}
            WHERE ${whereConditions}
            ORDER BY ${orderBy}
            LIMIT ${limit} OFFSET ${offset};
        `;

        //Execute the query
        const [results] = await sequelize.query(query, { type: QueryTypes.SELECT});
        
        //Respond with data
        res.status(200).json({
            count: results.length,
            data: results
        });
    }catch(err){
        res.status(500).json({error: err.message});
    }
};