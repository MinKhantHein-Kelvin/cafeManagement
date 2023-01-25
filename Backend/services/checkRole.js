var dotenv = require ('dotenv');
dotenv.config();

function checkRole(req,res,next){
    if(res.locals.role == process.env.USER){
       return res.sendStatus(401)
    }
    next();
}

module.exports = {checkRole : checkRole}