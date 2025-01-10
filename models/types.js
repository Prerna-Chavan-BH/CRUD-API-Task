const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/db.js');
const { v4: uuidv4 } = require('uuid');

console.log(DataTypes);
const Type = sequelize.define('Type',{
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,      //Automatically generateds a uuid for each new entry
        primaryKey: true,
        autoIncrement: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fields: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    desc: {
        type: DataTypes.STRING,
    },
}, {
    tableName: 'types',
    schema: 'public',
    timestamps: true,
});

module.exports = Type;
