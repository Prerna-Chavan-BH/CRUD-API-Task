const sequelize = require('../config/db');
const Type = require('./types');

const initDB = async () => {
    try{
        await sequelize.authenticate();
        console.log('Database connected successfully');
        await Type.sync({alter: true});  //create types table if not exists, alter true will update the db schema to matchg the models
        console.log('Database schema synced successfully');
    } catch(err){
        console.error('Database connection error: ', err);
    }
};

module.exports = initDB;