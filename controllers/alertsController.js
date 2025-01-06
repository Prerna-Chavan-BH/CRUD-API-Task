const sequelize = require('../config/db');
const { QueryTypes } = require('sequelize');
const jsonschema = require('jsonschema');

//POST /alerts
exports.createAlerts = async (req, res) => {

    const { typeId, alerts } = req.body;
    try{
        //validate inputs
        if(!typeId || !alerts || !Array.isArray(alerts) || alerts.length === 0) {
            return res.status(400).json({error: 'Both types and alerts are required'});
        }

        //getting type fields from the database
        const type = await sequelize.query(`SELECT fields FROM public.type WHERE id = :typeId`,
            {
                replacements: { typeId },
                type: QueryTypes.SELECT,
            }
        );

        // console.log('Raw fields: ', type[0].fields);
        // console.log('TypeId: ', typeId);
        //console.log('Type Result: ', type);

        //checking if type exists
        if (!type || type.length === 0){
            return res.status(404).json({error: 'Type not Found'});
        }
        //console.log('Type Fields: ', type);

        //parse fields data from database
        let fields = type[0].fields; 
        
        //validate fields data using jsonschema
        const result = jsonschema.validate(fields, fieldsSchema);
        if(!result.valid){
            console.error('Invalid fields data: ', result.errors);
            return res.status(404).json({error: 'Invalid fields data in the db 1'});
        }
        //checking for circular references
        try{
            JSON.stringify(fields);
        }catch(err){
            console.error('Circular reference detected: ', err.message);
            return res.status(500).json({error: 'Invalid fields data in the db 2'});
        }

        //Checking if fields is an array
        if (Array.isArray(fields)){
            //convert fields array to JSON string
            fields = JSON.stringify(fields);
        }

        try{ 
            fields = JSON.parse(type[0].fields)
        }catch(err){
            console.error('Error parsing fields: ', err.message)
            return res.status(500).json({error: 'Invalid fields data in the db 3'});
        }
        // console.log('Raw fields from DB: ', type[0].fields);

        //validate fields data
        if (!fields || !Array.isArray(fields)){
            console.error('Invalid fields data');
            return res.status(500).json({error: 'Invalid fields data in the db 4'});
        }

        //generate fields defination
        const fieldDefination = fields.map(field => `${field.name} ${field.dataType}`).join(', ');
        console.log('Parsed fields: ', fieldDefination);

        //generate create table query
        const fieldsQuery = fields.map(field => `${field.name} ${field.datatype}`).join(', ');
        console.log('Generated fields query: ', fieldsQuery);

        //create the dynamic alerts table
        await sequelize.query(`CREATE TABLE IF NOT EXISTS public.type_${typeId} (${fields});`);

        //Insert alerts
        const insertQuery = alerts.map(alert =>`(${Object.values(alert).map(value => `'${value}'`).join(', ')})`).join(',');

        await sequelize.query(`INSERT INTO public.type_${typeId} VALUES ${insertQuery};`);

        res.status(201).json({message: 'Alerts created successfully'});

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
        const selectFields = fields.lenght > 0 ? fields.join(", ") : "*";

        //Build WHERE clause
        const whereConditions = where.conditions.map(cond => {
            const values = cond.values.map(v => `'${v}'`).join(", ");
            return `${cond.field} ${cond.operator} (${values})`;
        }).join(` ${where.combine} `);

        //Build orderBy clause
        const orderBy = sorting.map(sort => `${sort.field} ${sort.order}`).join(", ");

        //paging
        const { pageSize, pageNumber } = paging;
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