const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

async function createDynamicTable(typeID, fields) {
    try{
        const tableName = `type_${typeID}`;
        const attributes = {};

        //convert fields into sequelize attributes
        fields.forEach((field) => {
            attributes[field.name] = {
                type: DataTypes[field.datatype.toUpperCase()],
            };
        });

        const dynamicModel = sequelize.define(tableName, attributes,{
            tableName,
            timestamps: false,
        });

        await dynamicModel.sync();     //create the table iof doesnt exits
        console.log(`Table ${tableName} created successfully.`);
    }catch(error){
        console.log('Error creating dynamic table: ', error);
    }
}

module.exports = { createDynamicTable };