const express = require('express');
const { getExtensionData, updateExtensionDataStatus } = require('../controllers/dataController');
// const { isLoggedIn } = require('../middlewares/auth');
const Meta = require('../models/meta');
const router = express.Router();
const Data = require('../models/data');
const { Op } = require("sequelize");
router.post('/get-extension-data', getExtensionData);

router.post('/update-extension-data-status', updateExtensionDataStatus)

router.post('/get-switch-status', async (req, res) => {
    const extensionSwitch = await Meta.findOne({
        where: {
            key: 'extensionSwitch'
        }
    });
    console.log(extensionSwitch)
    res.json({ extensionSwitch: extensionSwitch.value=='on'?true:false });
});
router.post('/set-switch-status', async (req, res) => {
    const { extensionSwitch } = req.body;
    const extensionSwitchMeta = await Meta.findOne({ where:{key: 'extensionSwitch'} });
    extensionSwitchMeta.value = extensionSwitch?'on':'off';
    await extensionSwitchMeta.save();
    res.json({ type:'success',message: 'Extension switch status updated' });
});
router.post('/is-last-of-file', async (req, res) => {
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
});
module.exports = router;