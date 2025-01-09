const { Sequelize } = require('sequelize');

//(databasename, username, password)
const sequelize = new Sequelize('postgres', 'postgres', 'Mermaidpc@0313',{
    host: 'localhost',
    dialect: 'postgres',
    //logging : console.log,
});

(async () => {
    try{
        await sequelize.authenticate();
        console.log('Database connected successfully.');
    }catch(error){
        console.error('Unable to connect with the database', error);
    }
}) ();
module.exports = sequelize;