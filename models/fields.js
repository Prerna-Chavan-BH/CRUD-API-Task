const { DataTypes} = require('sequelize');
const sequelize = require('../config/db.js');
const Type = require('./types');

const Field = sequelize.define('Field',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        // unique: true,
    },
    datatype: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    typeId: {
        type: DataTypes.INTEGER,
        // allowNull: false,
        references: { 
            model: 'type',
            key: 'id',
        },
    },
}, 
{
    tableName: 'fields',
    schema: 'public',
    timestamps: false,
});

//Establishing the relationship
Field.belongsTo(Type, {foreignKey: 'typeId'});

// //Association
// Field.associate = (model) => {
//     Field.belongsTo(model.Type, {
//         foreignKey: 'typeId',
//         as: 'type'
//     });
// };
console.log(Type);
module.exports = Field;
