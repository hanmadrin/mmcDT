const { Data, File, User, Meta, Company } = require("../models");
const {Op} = require("sequelize");
const ExpressError = require('../utilities/expressError');
const jwt = require('jsonwebtoken');

module.exports.getExtensionData = async (req, res, next) => {
    try {
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
        // if(currentUSHour < 9 || currentUSHour > 21){
        //     res.json({
        //         action: 'tryAgainLater',
        //         message: 'The extension is only available between 9am and 5pm EST',
        //     });
        //     return;
        // }
        // const latestData = await Data.findOne({
        //     where: {
        //         status: null,
                
        //     },
        //     include: [
        //         {
        //             model: File,
        //             attributes: ['file_name'],
        //         }
        //     ],
        //     order: [
        //         ['id', 'ASC']
        //     ],
        // });
        // if (!latestData){
        //     res.json({
        //         action: 'tryAgainLater',
        //         message: 'No data available to work on',
        //     });
        //     return;
        // }
        // latestData.status = req.bot.company_code;
        // await latestData.save();
        // res.json({
        //     action: 'workOnItem',
        //     item: latestData,
        // });
        // return; 

        const file = await File.findOne({
            where: {
                user_id: {
                    [Op.in]: req.bot.team_ids,
                }
            },
            attributes: ['file_name'],
            order: [
                ['id', 'ASC']
            ],
            include: [
                {
                    model: Data,
                    where: {
                        // null or  equal to company code
                        [Op.or]: [
                            {status: null},
                            {status: req.bot.company_code},
                        ]
                    },
                    order: [
                        ['id', 'ASC']
                    ]
                    // find one
                }
            ]
        });
        if(!file){
            res.json({
                action: 'tryAgainLater',
                message: 'No data available to work on',
            });
            return;
        }
        const item = file.Data[0];
        item.status = req.bot.company_code;
        await item.save();
        res.json({
            action: 'workOnItem',
            item:{
                ...item.dataValues,
                File: {
                    file_name: file.file_name,
                }
            },
        });
        // {
        //     "action": "workOnItem",
        //     "item": {
        //         "id": 303,
        //         "header": "{\"Invoice Number\":\"12364\",\"Invoice Date\":\"7/20/2023\",\"Vendor\":null,\"RO Number\":\"10420\",\"Discount %\":\"25.0\",\"Phone\":\"(570) 523-1256\",\"Fax\":null,\"Insurance\":\"ERIE INSURANCE GROUP\",\"Claim Number\":\"A00005070618-1\"}",
        //         "body": "{\"Line\":\"18\",\"Description\":\"Emission label w/o hybrid\",\"Part Number\":\"68470511AA\",\"Part Type\":\"OEM\",\"RO List $\":\"6.85\",\"RO Sales $\":\"6.85\",\"Received Qty\":\"1\",\"Invoice List $\":\"6.85\",\"Unit Cost $\":\"5.14\",\"Discount %\":\"25.0\",\"Extended Cost $\":\"5.14\"}",
        //         "footer": "{\"Received Items\":\"13\",\"Subtotal\":\"1,534.51\",\"Tax\":\"0.00\",\"Freight\":\"0.00\",\"Grand Total\":\"1,534.51\"}",
        //         "status": "xentola",
        //         "file_id": 15,
        //         "File": {
        //             "file_name": "8007826_UBLAISE15_123641.pdf"
        //         }
        //     }
        // }
    } catch (err) {
        next(new ExpressError(500, {
            action: 'settingError',
            message: err.message,
        }));
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
        next(new ExpressError(500, ));
    }
};

module.exports.isLastOfFile = async (req, res, next) => {
    const { file_id } = req.body;
    const countNotCompleted = await Data.count({
        where: {
            file_id,
            status: {
                [Op.or]: {
                    [Op.not]: 'completed',
                    [Op.is]: null
                }
            }
        },
    });
    if(countNotCompleted==0) {
        res.json({ message: "This invoice doesn't exist" });
        return;
    }
    res.json({ isLastOne: countNotCompleted==1 });
};

module.exports.isFirstOfFile = async (req, res, next) => {
    const { file_id } = req.body;
    const countCompleted = await Data.count({
        where: {
            file_id,
            status: 'completed'
        },
    });
    res.json({ isFirstOne: countCompleted==0 });
    // res.json({ isFirstOne: true })
}

module.exports.test = async (req, res, next) => {
    try {
        res.json({ message: "Hello world" });
    } catch (err) {
        next(err);
    }
};