const Data = require('./data');
const User = require('./user');
const File = require('./file');
const Meta = require('./meta');
const Company = require('./company');

Company.hasMany(User, { foreignKey: 'company_id' });
User.belongsTo(Company, { foreignKey: 'company_id' });

Company.hasMany(Meta, { foreignKey: 'company_id' });
Meta.belongsTo(Company, { foreignKey: 'company_id' });

User.hasMany(File, { foreignKey: 'user_id' });
File.belongsTo(User, { foreignKey: 'user_id' });

File.hasMany(Data, { foreignKey: 'file_id' });
Data.belongsTo(File, { foreignKey: 'file_id' });

module.exports = {
    Data,
    User,
    File,
    Meta,
    Company
};

