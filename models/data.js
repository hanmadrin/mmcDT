const { sequelize } = require("../config/config");
const { DataTypes } = require("sequelize");

const Data = sequelize.define(
    "Data",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        header: {
            type: DataTypes.STRING(1000),
            allowNull: false,
        },
        body: {
            type: DataTypes.STRING(5000),
            allowNull: false,
        },
        footer: {
            type: DataTypes.STRING(1000),
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(10),
            allowNull: true,
            defaultValue: null,
        },
        file_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        tableName: "datas",
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    },

);

module.exports = Data;