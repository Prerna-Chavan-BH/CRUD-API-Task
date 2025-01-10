const sequelize = require('../config/db');
const Alerts = require('../models/alerts');
const createOrUpdateTables = require('../models/createOrUpdateTables');
const Type = require('../models/types')

//POST /alerts
exports.createAlerts = async(req, res) => {
   try{
    const payload = req.body;
    const { typeId, alerts } = payload;

    if(!typeId || !alerts || !Array.isArray(alerts)){
        return res.status(400).send({error: 'Invalid payload structure'});
    }

    //extract attributes from the first alerts
    const attributes = Object.keys(alerts[0]).map((key) => ({
        name: key,
        type: typeof alerts[0][key],    //infering the datatypes
    }));

    //create or update the dynamic table
    await createOrUpdateTables(typeId, attributes);
    return res.status(200).send({message: 'Alerts processed successfully'});

   }catch(error){
    console.error('Error processing alerts payload: ', error.message);
    return res.status(500).send({error: 'Internal server error'});
   }
};

// //Search alerts by type and payload filter
// async function searchAlerts(req, res){
//         const { fields, type_id, where, sorting, paging } = req.body;

//         //Ensure typeID is provided
//         if(!typeId){
//             return res.status(400).json({error: "typeId is required"});
//         }

//         //build the SELECT fields
//         const selectFields = fields.lenght ? fields.join(", ") : "*";

//         //Build WHERE clause
//         const whereConditions = where ? where.conditions.map(cond => {
//             const values = cond.values.map(v => `'${v}'`).join(", ");
//             return `${cond.field} ${cond.operator} (${values})`;
//         }).join(` ${where.combine} `): '';

//         //Build orderBy clause
//         const orderBy = sorting ? sorting.map(sort => `${sort.field} ${sort.order}`).join(", "): '';

//         //paging
//         const pageSize = paging ?.pageSize || 10;
//         const pageNumber= paging ?.pageNumber || 1;
//         const limit = pageSize;
//         const offset = (pageNumber - 1) * pageSize;

//         //Final query
//         const query = `
//             SELECT ${selectFields}
//             FROM public.type_${typeId}
//             WHERE ${whereConditions}
//             ORDER BY ${orderBy}
//             LIMIT ${limit} OFFSET ${offset};
//         `;

//         //Execute the query
//         const [results] = await sequelize.query(query, { type: QueryTypes.SELECT});
        
//         //Respond with data
//         res.status(200).json({
//             count: results.length,
//             data: results
//         });
//     }catch(err){
//         res.status(500).json({error: err.message});
//     }
// };

