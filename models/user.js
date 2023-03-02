const { sequelize } = require("../config/config");
const { DataTypes } = require("sequelize");

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM,
            values: ['active', 'inactive'],
            defaultValue: 'active'
        }
    },
    {
        tableName: "users",
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        scopes: {
            login: {
                attributes: ['id', 'username', 'status']
            }
        }
    },

);

module.exports = User;