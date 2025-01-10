const { DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const Alerts = sequelize.define('alerts',{
    // id: {
    //     type: DataTypes.UUID,
    //     defaultValue: uuidv4,
    //     primaryKey: true,
    //     autoIncrement: false,
    // },
    type_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'types',
            key: 'id'
        }
    },
    payload: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    
}, 
{
    tableName: 'alerts',
    schema: 'public',
    timestamps: true,
});


// console.log(Type);
module.exports = Alerts;
