const { DataTypes} = require('sequelize');
const sequelize = require('../config/db.js');
const Type = require('./types');

const Field = sequelize.define('Field',{
    // id: {
    //     type: DataTypes.INTEGER,
    //     primaryKey: true,
    // },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    datatype: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tyepId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { 
            model: Type,
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
Type.hasMany(Field, {foreignKey: 'typeId', as: 'fields'});
Field.belongsTo(Type, {foreignKey: 'typeId'});

// //Association
// Field.associate = (model) => {
//     Field.belongsTo(model.Type, {
//         foreignKey: 'typeId',
//         as: 'type'
//     });
// };

module.exports = Field;
