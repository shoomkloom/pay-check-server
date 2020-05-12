const log4js = require('log4js');
const logger = log4js.getLogger('error');

module.exports = function(err, req, res, next){
    logger.error(err.message, err);

    res.status(500).send('Error: Something went wrong');
}