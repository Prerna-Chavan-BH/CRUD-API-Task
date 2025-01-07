const { Sequelize } = require('sequelize');

//(databasename, username, password)
const sequelize = new Sequelize('postgres', 'postgres', 'Mermaidpc@0313',{
    host: 'localhost',
    dialect: 'postgres',
    //logging : console.log,
});

module.exports = sequelize;