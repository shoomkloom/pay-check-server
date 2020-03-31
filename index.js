const log4js = require('log4js');
const express = require('express');
const app = express();

//Do startup actions
require('./startup/logging')(); //Must be first
require('./startup/validation')();
require('./startup/routes')(app);
require('./startup/database')();
require('./startup/config')();
require('./startup/prod')(app);

const logger = log4js.getLogger('index');
logger.info('=========== Starting Pay-Check Server ===========');

app.get('/', (req, res) => {
    //Say Hello on root
    res.send('-- This is Pay-Check Master Server --');
});

//Start listening on port...
var port = process.env.PORT || 3000;
const server = app.listen(port, () => logger.info(`Listening on port ${port}...`));

module.exports = server;