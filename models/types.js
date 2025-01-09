const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Types = sequelize.define('types',{
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        // unique: true
    },
    fields: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    desc: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'types',
    schema: 'public',
    timestamps: false,
});

module.exports = Types;
