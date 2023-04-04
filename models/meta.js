const { sequelize } = require("../config/config");
const { DataTypes } = require("sequelize");

const Meta = sequelize.define(
    "Meta",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        key: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        tableName: "metas",
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    },

);
// sync force
// Meta.sync({ force: true });
module.exports = Meta;