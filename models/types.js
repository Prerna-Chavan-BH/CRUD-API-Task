const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Type = sequelize.define('Type',{
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
    // fields: {
    //     type: DataTypes.JSON,
    //     allowNull: false,
    // },
    desc: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'type',
    schema: 'public',
    timestamps: false,
});

//Association
Type.associate = (models) => {
    Type.hasMany(models.Fields, {
        foreignKey: 'typeId', 
        as: 'fields',
        onDelete: 'CASCADE',
    });
};

module.exports = Type;
