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
    
    if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'){
        mongoose.connect(config.get('connection-string'), { useNewUrlParser: true })        
            .then(() => logger.info(`Connected to ${config.get('connection-string')}...`))
            .catch(() => logger.error(`ERROR: Could not connect to ${config.get('connection-string')}...`));    
    }
    else{
        mongoose.connect(config.get('mongodb.connection-string'), { useNewUrlParser: true, dbName: config.get('mongodb.dbName') })        
            .then(() => logger.info(`Connected to ${config.get('mongodb.connection-string')}...`))
            .catch(() => logger.error(`ERROR: Could not connect to ${config.get('mongodb.dbName')}...`));    
    }
}