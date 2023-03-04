const fs = require('fs');
const { File, User, Data } = require('../models');
const ExpressError = require('../utilities/expressError');
const { pdfToText } = require('../utilities/pdfToText');
const { renameFile } = require('../utilities/renameFile');

module.exports.parsePdf = async (req, res, next) => {
    try {
        // create uploads folder if it doesn't exist
        if (!fs.existsSync('./public/uploads')) {
            fs.mkdirSync('./public/uploads');
        }

        const response = await pdfToText(req.file.path);
        if (response.error)
            throw new ExpressError(400, response.error);

        renameFile(`./${req.file.path}`, `./${req.file.path}.pdf`);

        response.originalName = req.file.originalname;

        res.json({
            file: `${req.file.path.replace('public/', '')}.pdf`,
            response
        });
    } catch (err) {
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

        const username = req.cookies.username;
        const user = await User.findOne({
            where: {
                username,
            },
        });
        if (!user)
            throw new ExpressError(400, "Invalid username");

        const savedFile = await File.create({
            file_name: originalName,
            time_string: new Date().getTime(),
            user_id: user.id,
        });
        if (!savedFile)
            throw new ExpressError(500, "Error saving file");

        const savedData = await Data.bulkCreate([
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
        const { processedBy } = req.query;

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
        if (!latestData)
            throw new ExpressError(400, "No data available");

        latestData.status = processedBy;
        await latestData.save();
        res.json(latestData);
    } catch (err) {
        next(err);
    }
};

module.exports.updateExtensionDataStatus = async (req, res, next) => {
    try {
        const { dataId } = req.params;

        const updatedData = await Data.update(
            {
                status: 'completed'
            },
            {
                where: {
                    id: dataId,
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