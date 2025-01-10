const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const createOrUpdateTables = async (typeId, attributes, data) => {
    try {
        const tableName = `type_${typeId}`;
        const columns = {};

        //convert attributes into sequelise column definations
        attributes.forEach((field) => {
            columns[field.name] = {
                type: field.type === 'string' ? DataTypes.STRING : DataTypes.INTEGER,
                allowNull: true,
            };
        });

        //check if the table exists
        const existingTable = await sequelize.getQueryInterface().describeTable(tableName).catch(() => null);

        if(existingTable){
            console.log(`Table ${tableName} already exists. Altering schema if neccessary`);

            for (const [columnName, columnDefination] of Object.entries(columns)){
                if(!existingTable[columnName]){
                    console.log(`Adding column ${columnName} to table ${tableName}`);
                    await sequelize.getQueryInterface().addColumn(tableName, columnName, columnDefination);
                }
            }
        } else {
            console.log(`Creating table ${tableName}`);
            const DynamicModel = sequelize.define(tableName, columns, {
                tableName,
                timestamps: false
            });
            await DynamicModel.sync();
        }
        console.log(`Table ${tableName} is ready`);

        //Inserting the data
        if (data && Array.isArray(data)){
            for (const row of data){
                await DynamicModel.create(row);
            }
            console.log(`Data inserted successfully into table ${tableName}`);
        }

    }catch(error){
        console.error(`Error creating or updating the table ${tableName}: `, error.message);
    }
};

module.exports = createOrUpdateTables;
