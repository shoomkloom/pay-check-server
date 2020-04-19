const log4js = require('log4js');
require('express-async-errors');
    
module.exports = function(){

    if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'){
        log4js.configure({
            appenders: {
                appLogs: { 
                    type: 'file', 
                    filename: './log/pay-check-server.log',
                    maxLogSize: 1024,
                    backups: 10,
                    pattern: '%d [%t] %p %logger [%x] - %m'
                },
                console: { type: 'console' }
            },
            categories: {
            default: { appenders: ['console', 'appLogs'], level: 'trace' }
            }
        });
    }
    else{
        log4js.configure({
            appenders: {
                appLogs: { 
                    type: 'file', 
                    filename: './log/pay-check-server.log',
                    maxLogSize: 1024,
                    backups: 10,
                    pattern: '%d [%t] %p %logger [%x] - %m'
                },
                console: { type: 'console' },
                azureLogs: {
                    type: 'log4js-azure-append-blob-appender',
                    azureStorageConnectionString: 'DefaultEndpointsProtocol=https;AccountName=paycheckdiag;AccountKey=kKgjINJnV/Sl6lRCaH2s7aQcIULN/3yZd7AL4MELq/Sn4mXX87oi1hw+4Cc03TPL9VIhxGzZO1djC1EQphQfGg==;EndpointSuffix=core.windows.net',
                    container: 'applogs',
                    appendBlob: 'pay-check-server.log',
                    pattern: '%d [%t] %p %logger [%x] - %m'
                }
            },
            categories: {
            default: { appenders: ['console', 'appLogs', 'azureLogs'], level: 'trace' }
            }
        });
    }

    const logger = log4js.getLogger('unhandled');
    
    //Catch synchronous exceptions
    process.on('uncaughtException', (ex) => {
        logger.error(ex.message);
        process.exit(1);
    });

    //Catch unhadled rejections
    process.on('unhandledRejection', (ex) => {
        logger.error(ex.message);
        process.exit(1);
    });
}