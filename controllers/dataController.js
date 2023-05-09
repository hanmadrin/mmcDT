const fs = require('fs');
const { File, User, Data, Meta } = require('../models');
const ExpressError = require('../utilities/expressError');
const { pdfToText } = require('../utilities/pdfToText');
const { renameFile } = require('../utilities/renameFile');
const { deleteFile } = require('../utilities/deleteFile');
const { Op } = require("sequelize");
const { asyncForEach } = require('../utilities/asyncForEach');

module.exports.isPdfExists = async (req, res, next) => {
    try {
        const { fileName } = req.params;
        const isDataExists = await File.findOne({
            where: {
                file_name: fileName,
            },
            include: [
                {
                    model: Data,
                    attributes: ['id'],
                }
            ],
        });
        res.json({ isPdfExists: isDataExists?.dataValues?.Data?.length > 0 });
    } catch (err) {
        next(err);
    }
};

module.exports.parsePdf = async (req, res, next) => {
    try {
        // create uploads folder if it doesn't exist
        if (!fs.existsSync('./public/uploads')) {
            fs.mkdirSync('./public/uploads');
        }

        const response = await pdfToText(req.file.path);
        if (response.error)
            throw new ExpressError(400, response.error);

        // renameFile(`./${req.file.path}`, `./${req.file.path}.pdf`);

        response.originalName = req.file.originalname;
        // delete file
        deleteFile(`./${req.file.path}`);
        res.json({
            // file: `${req.file.path.replace('public/', '')}.pdf`,
            response
        });
    } catch (err) {
        try{
            deleteFile(`./${req.file.path}`);
        }catch(err){next(err);return;}
        next(err);
    }
};

module.exports.savePdfData = async (req, res, next) => {
    try {
        const {
            header,
            body,
            footer,
            originalName,
        } = req.body;

        const isPdfExists = await File.findOne({
            where: {
                file_name: originalName,
            },
            include: [
                {
                    model: Data,
                    attributes: ['id'],
                }
            ],
        });

        let savedFile;
        if (isPdfExists?.dataValues?.Data?.length > 0) {
            savedFile = isPdfExists;
        } else {
            const username = req.cookies.username;
            const user = await User.findOne({
                where: {
                    username,
                },
            });
            if (!user)
                throw new ExpressError(400, "Invalid username");

            savedFile = await File.create({
                file_name: originalName,
                time_string: new Date().getTime(),
                user_id: user.id,
            });
            if (!savedFile)
                throw new ExpressError(500, "Error saving file");
        }

        await Data.bulkCreate([
            ...body.map((data, index) => ({
                header: JSON.stringify(header),
                body: JSON.stringify(data),
                footer: JSON.stringify(footer),
                file_id: savedFile.id,
            }))
        ]);

        res.json({ message: "Data saved successfully" });
    } catch (err) {
        next(err);
    }
};

module.exports.getExtensionData = async (req, res, next) => {
    try {
        const { deviceId } = req.body;
        if(!deviceId){
            res.json({
                action: 'settingError',
                message: 'Device id is required',
            });
            return;
        }
        const extensionSwitch = await Meta.findOne({
            where: {
                key: 'extensionSwitch',
            }
        });
        if (!extensionSwitch){
            res.json({
                action: 'settingError',
                message: "Extension switch doesn't exists"
            });
            return;
        }
        const isExtensionSwitchOn = extensionSwitch.value === 'on';
        if(!isExtensionSwitchOn){
            res.json({
                action: 'tryAgainLater',
                message: 'The extension is currently turned off',
            });
            return;
        }
        const currentUSHour = new Date(new Date().toLocaleString("en-US", {timeZone: "America/New_York"})).getHours(); 
        if(currentUSHour < 9 || currentUSHour > 17){
            res.json({
                action: 'tryAgainLater',
                message: 'The extension is only available between 9am and 5pm EST',
            });
            return;
        }
        const latestData = await Data.findOne({
            where: {
                status: null,
            },
            include: [
                {
                    model: File,
                    attributes: ['file_name'],
                }
            ],
            order: [
                ['id', 'ASC']
            ],
        });
        if (!latestData){
            res.json({
                action: 'tryAgainLater',
                message: 'No data available to work on',
            });
            return;
        }
        
        latestData.status = deviceId;
        await latestData.save();
        res.json({
            action: 'workOnItem',
            item: latestData,
        });
    } catch (err) {
        next(err);
    }
};

module.exports.updateExtensionDataStatus = async (req, res, next) => {
    try {
        const { id,status } = req.body;

        const updatedData = await Data.update(
            {
                status: status
            },
            {
                where: {
                    id: id,
                },
            }
        );
        if (!updatedData)
            throw new ExpressError(500, "Error updating data");

        res.json({ message: "Data updated successfully" });
    } catch (err) {
        next(err);
    }
};

module.exports.getFilesWithStatus = async (req, res, next) => {
    const { page = 1, status, username, date, fileName } = req.query;

    let rowCount = 0;
    let dataConditions = {};
    let userConditions = {};
    let where = {};

    if (status === 'completed') {
        dataConditions = {
            status: {
                [Op.eq]: 'completed'
            }
        }
    } else if (status === 'error') {
        dataConditions = {
            status: {
                [Op.in]: ['error', 'fileError']
            }
        }
    } else if (status === 'inQueue') {
        dataConditions = {
            status: {
                [Op.is]: null,
            }
        }
    } else if (status === 'processing') {
        dataConditions = {
            status: {
                [Op.and]: {
                    [Op.notIn]: ['completed', 'error', 'fileError'],
                    [Op.not]: null
                }
            }
        }
    }

    if (username) {
        userConditions = {
            username: {
                [Op.like]: `%${username}%`
            }
        }
    }

    if (date) {
        const timeString = new Date(date).setHours(0);
        const nextDay = new Date(date).setHours(0) + 86400000;
        where = {
            time_string: {
                [Op.between]: [timeString, nextDay]
            }
        };
    }

    if (fileName) {
        where = {
            ...where,
            file_name: {
                [Op.like]: `%${fileName}%`
            }
        };
    }

    let files = await File.findAndCountAll({
        where,
        include: [
            {
                model: Data,
                attributes: ['id', 'status'],
                where: {
                    ...dataConditions,
                },
            },
            {
                model: User,
                attributes: ['username'],
                where: {
                    ...userConditions,
                },
            }

        ],
        order: [
            ['id', 'DESC']
        ],
        distinct: true,
        limit: 10,
        offset: (page - 1) * 10,
    });

    rowCount = files.count;
    files = await File.findAll({
        where: {
            id: {
                [Op.in]: files.rows.map(file => file.id)
            },
        },
        include: [
            {
                model: Data,
                attributes: ['id', 'status']
            },
            {
                model: User,
                attributes: ['username']
            }
        ],
        order: [
            ['id', 'DESC']
        ],
    });

    files = files.map(file => {
        const { Data, ...rest } = file.dataValues;
        const status = [];
        if (Data.length > 0) {
            const errorStatus = Data.find(data => data.status === 'error' || data.status === 'fileError');
            if (errorStatus) {
                status.push('error');
            }
            const completedStatus = Data.find(data => data.status === 'completed');
            if (completedStatus) {
                status.push('completed');
            }
            const inQueueStatus = Data.find(data => data.status === null);
            if (inQueueStatus) {
                status.push('inQueue');
            }
            const processingStatus = Data.find(data => data.status !== 'completed' && data.status !== 'error' && data.status !== 'fileError' && data.status !== null);
            if (processingStatus) {
                status.push('processing');
            }
        }
        else {
            status.push('noDataFound');
        }
        return {
            ...rest,
            status,
        };
    });
    res.json({
        count: rowCount,
        rows: files,
    });
};

module.exports.getAllFileData = async (req, res, next) => {
    try {
        const { id } = req.params;

        const data = await Data.findAll({
            where: {
                file_id: id,
            },
            attributes: ['id', 'header', 'body', 'footer', 'status'],
        });

        res.json(data);
    } catch (err) {
        next(err);
    }
};

module.exports.updatePdfData = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            header,
            body,
            footer,
            deletedRows
        } = req.body;

        if (deletedRows.length) {
            await asyncForEach(deletedRows, async (id, index) => {
                const deletedData = await Data.destroy({
                    where: {
                        id: id,
                    }
                });
                if (!deletedData)
                    throw new ExpressError(500, "Error deleting data");
            });
        }

        const filteredBody = body.filter(data => !deletedRows.includes(data.id));

        const username = req.cookies.username;
        const user = await User.findOne({
            where: {
                username,
            },
        });
        if (!user)
            throw new ExpressError(400, "Invalid username");

        const updatedFile = await File.update(
            {
                user_id: user.id,
                time_string: new Date().getTime(),
            },
            {
                where: {
                    id: id,
                }
            }
        );

        if (!updatedFile)
            throw new ExpressError(500, "Error saving file");

        if (filteredBody.length) {
            await asyncForEach(filteredBody, async (data, index) => {
                const updatedData = await Data.update(
                    {
                        header: JSON.stringify(header),
                        body: JSON.stringify(data),
                        footer: JSON.stringify(footer),
                        status: data.status=='inQueue' ? null : data.status,
                    },
                    {
                        where: {
                            file_id: id,
                            id: data.id,
                        }
                    }
                );
                if (!updatedData)
                    throw new ExpressError(500, "Error saving data");
            });
        }

        res.json({ message: "Data updated successfully" });
    } catch (err) {
        next(err);
    }
};