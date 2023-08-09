const { User, Company } = require("../models");
const expressError = require("../utilities/expressError");

module.exports.fetchUser = async (req,res,next)=>{
    // console.log(req.user_id)
    let result = {};
    try{
        const user = await User.findOne({
            where: {
                id: req.user_id,
                status: "active",
            }
        });
        if(user){
            result = user.dataValues;
            const company_id = user.dataValues.company_id;
            const team = await User.findAll({
                where: {
                    company_id,
                },
                attributes: ['id'],
                include: [
                    {
                        model: Company,
                        attributes: ['id', 'name','code'],
                    }
                ]
            });
            const team_ids = team.map(user => user.dataValues.id);
            // console.log(team)
            // result.company = team.company.dataValues;
            result.company = team[0].Company.dataValues;
            result.company_id = company_id;
            result.team_ids = team_ids;
            
            req.user = result;
            next();
        }else{
            next(new ExpressError(401, "You must be logged in"));
        }
    }catch(err){
        // result.status = 'error';
        // result.message = 'User validation failed';
        // result.error = err;
        next(err)
    }
    // return result;
    
}
module.exports.fetchBot = async (req,res,next)=>{
    const company_code = req.company_code;
    try{
        const company = await Company.findOne({
            where: {
                code: company_code,
            },
            include: [
                {
                    model: User,
                    attributes: ['id'],
                }
            ]
        });
        if(!company){
            next(new expressError(401, {
                action: 'settingError',
                message: 'Company code is invalid',
            }));
        }
        const team_ids = company.Users.map(user => user.dataValues.id);
        req.bot = {
            company_id: company.id,
            company_code: company.code,
            team_ids,
        };
    }catch(err){
        next(new expressError(401, {
            action: 'settingError',
            message: 'Company code is invalid',
        }));
    }
    next();
}

