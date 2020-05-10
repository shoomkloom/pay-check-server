const auth = require('../middleware/auth');
const {UserTlushData} = require('../models/user-tlush-data');
const {UserTlushResult, validateUserTlushResult} = require('../models/user-tlush-result');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const log4js = require('log4js');
const logger = log4js.getLogger('user-tlush-datas');

router.get('/', auth, async function (req, res) {
    logger.debug('GET / - Invoked');
    //Get the list of user-tlush-datas
    const userTlushResults = await UserTlushResult.find();
    res.send(userTlushResults);
});

router.get('/:userid', auth, async function (req, res) {
    logger.debug(`GET /${req.params.userid} - Invoked`);
    
    //Find requested list of user tlush results
    let userTlushResults = await UserTlushResult.find({ userid: req.params.userid });
    if(!userTlushResults){
        logger.error(`Could not find user tlush results with user id=${req.params.userid}`);
        return res.status(404).send(`Could not find user tlush results with user id=${req.params.userid}`);
    }
    
    //Send the requested user tlush result
    res.send(userTlushResults);
});

router.get('/:usertlushdataid', auth, async function (req, res) {
    logger.debug(`GET /${req.params.usertlushdataid} - Invoked`);
    
    //Find requested list of user tlush results
    let userTlushResults = await UserTlushResult.find({ usertlushdataid: req.params.usertlushdataid });
    if(!userTlushResults){
        logger.error(`Could not find user tlush results with user id=${req.params.usertlushdataid}`);
        return res.status(404).send(`Could not find user tlush results with user id=${req.params.usertlushdataid}`);
    }
    
    //Send the requested user tlush result
    res.send(userTlushResults);
});

router.post('/', async function (req, res) {
    logger.debug('POST / - Invoked');

    //Validate requested details
    const result = validateUserTlushResult(req.body);
    if(result.error){
        logger.error(`ERROR - ${result.error}`);
        return res.status(400).send(result.error.message);
    }

    let userTlushResult = await UserTlushResult.findOne({ 
        usertlushdataid: req.body.usertlushdataid
    });
    
    if(userTlushResult){
        let error = `ERROR - User tlush result already exists for ${req.body.usertlushdataid}`;
        logger.error(error);
        return res.status(400).send(error);
    }

    //Create a new user tlush result object and add to db
    let newUserTlushResult = new UserTlushResult();

    var keys = Object.keys(req.body);
    for(var i = 0, length = keys.length; i < length; i++) {
        newUserTlushResult[keys[i]] = req.body[keys[i]];
    }

    //Find related user data
    let userTlushData = await UserTlushData.findOne({ _id: req.body.usertlushdataid });
    if(!userTlushData){
        logger.error(`Could not find related user data with id=${req.body.usertlushdataid}`);
        return res.status(404).send(`Could not find related user data with id=${req.body.usertlushdataid}`);
    }

    //Update user data object
    userTlushData.processtlushDate = null;
    userTlushData.updatedDate = new Date();
    userTlushData.save();

    //Save user tlush result object
    newUserTlushResult.createdDate = new Date();
    await newUserTlushResult.save();

    //Send the created user tlush result
    res.send(newUserTlushResult);
});

module.exports = router;