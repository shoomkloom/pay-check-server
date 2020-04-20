const jwt = require('jsonwebtoken');
const config = require('config');
const log4js = require('log4js');
const logger = log4js.getLogger('auth');

module.exports = function (req, res, next){
    logger.debug('auth middleware - Invoked');
    const token = req.header('x-auth-token');
    
    if(!token) return res.status(401).send('Access denied, token not provided');
    
    try{
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    }
    catch(ex){
        logger.error(`EXCEPTION - ${ex}`);
        res.status(400).send(`Invalid token - ${ex}. ${token}`);
    }
}
