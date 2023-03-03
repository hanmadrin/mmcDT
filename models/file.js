const { sequelize } = require("../config/config");
const { DataTypes } = require("sequelize");

const File = sequelize.define(
    "File",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        file_name:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        time_string:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        tableName: "files",
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    },

);

module.exports = File;