const Data = require('./data');
const User = require('./user');
const File = require('./file');

User.hasMany(File, { foreignKey: 'user_id' });
File.belongsTo(User, { foreignKey: 'user_id' });

File.hasMany(Data, { foreignKey: 'file_id' });
Data.belongsTo(File, { foreignKey: 'file_id' });

module.exports = {
    Data,
    User,
    File,
};

