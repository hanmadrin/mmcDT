const { sequelize } = require("../config/config");
const { DataTypes } = require("sequelize");

const Company = sequelize.define(
    "Company",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        code:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    },
    {
        tableName: "companies",
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    },

);
// sync force
// Company.sync({ force: true });

module.exports = Company;