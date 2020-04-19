const config = require('config');
const mongoose = require('mongoose');
const log4js = require('log4js');
const logger = log4js.getLogger('database');

module.exports = function(){
    mongoose.set('debug', false);
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);

    logger.info(`process.env.NODE_ENV = ${process.env.NODE_ENV}`);
    logger.info('Connecting to mongoConnectionString...');

    let connectionStringDisplay = String(config.get('connection-string')).slice(0, 21) + '*************' + String(config.get('connection-string')).slice(34);

    if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'){
        mongoose.connect(config.get('connection-string'), { useNewUrlParser: true })
            .then(() => logger.info(`Connected to ${connectionStringDisplay}...`))
            .catch(error => logger.error(`ERROR: Could not connect to ${connectionStringDisplay}. error=${error}`));
    }
    else{
        mongoose.connect(config.get('connection-string'), { useNewUrlParser: true })
            .then(() => logger.info(`Connected to ${connectionStringDisplay}...`))
            .catch(error => logger.error(`ERROR: Could not connect to ${connectionStringDisplay}. error=${error}`));
    }
}