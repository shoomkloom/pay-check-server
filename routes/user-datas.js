const auth = require('../middleware/auth');
const {UserData, validateUserData} = require('../models/user-data');
const {UserTlushData} = require('../models/user-tlush-data');
const {encrypt, decrypt} = require('../models/helpers');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const log4js = require('log4js');
const logger = log4js.getLogger('users');

router.get('/', auth, async function (req, res) {
    logger.debug('GET / - Invoked');
    //Get the list of user-datas
    const userDatas = await UserData.find();
    res.send(userDatas);
});

router.get('/:userid', auth, async function (req, res) {
    logger.debug(`GET /${req.params.userid} - Invoked`);
    
    //Find requested user data
    let userData = await UserData.findOne({ userid: req.body.userid });
    if(!userData){
        logger.error(`Could not find a user data with id=${req.params.id}`);
        return res.status(404).send(`Could not find a user data with id=${req.params.id}`);
    }
    
    //Send the requested user data
    res.send(userData);
});

router.get('/:userid/cleartlushcred', auth, async function (req, res) {
    logger.debug(`GET /${req.params.userid}/cleartlushcred - Invoked`);
    
    //Find requested user data
    let userData = await UserData.findOne({ userid: req.params.userid });
    if(!userData){
        logger.error(`Could not find a user data with id=${req.params.id}`);
        return res.status(404).send(`Could not find a user data with id=${req.params.id}`);
    }

    userData.tlushpassword = null;
    userData.save();
    logger.info(`tlushpassword cleared for user data userid=${userData.userid}`);
    
    //Send the requested user data
    res.send(userData);
});

router.get('/:year/:month', auth, async function (req, res) {
    logger.debug(`GET /${req.params.year}/${req.params.month} - Invoked`);

    try{
        //Find list of user datas that don't have usertlushdata for this period
        let userDatas = await UserData.find({"tlushpassword" : { $ne : null }});
        for (let userData of userDatas){
            //If this gettlushDate is less than hour, skip to the next one
            let nowDate = new Date();
            if(userData.gettlushDate){
                logger.info(`userData.userid=${userData.userid}, min diff=${Math.abs(nowDate.getTime() - userData.gettlushDate.getTime())/(1000 * 60)}`);
            }
            else{
                logger.info(`userData.userid=${userData.userid}, userData.gettlushDate=null`);
            }
            if(!userData.gettlushDate || 
                Math.abs(nowDate.getTime() - userData.gettlushDate.getTime())/(1000 * 60) > 1/*@@60*/){
                //For each user data try to find a usertlushdata object
                //for this month
                let foundUserTlushData = await UserTlushData.findOne({'userid': userData.userid, 'periodyear':req.params.year, 'periodmonth':req.params.month}).exec();
                if(!foundUserTlushData){
                    //Send the first user data object we find that does not have a
                    //usertlushdata for the requested month
                    userData.gettlushDate = nowDate;
                    await userData.save();

                    userData.tlushpassword = decrypt(userData.tlushpassword);
                    logger.info(`userData.userid=${userData.userid}, calling res.send`);
                    return res.send(userData);
                }
            }
        }
    }
    catch(ex){
        let error = `Could not get list of user data objects for year=${req.params.year}, month=${req.params.month}`;
        logger.error(`${error} Exception=${ex}`);
        return res.status(500).send(error);
    }
    logger.info('Calling res.send({})');
    return res.send({});
});

router.post('/', async function (req, res) {
    logger.debug('POST / - Invoked');

    //Validate requested details
    const result = validateUserData(req.body);
    if(result.error){
        logger.error(`ERROR - ${result.error}`);
        return res.status(400).send(result.error.message);
    }

    let userData = await UserData.findOne({ userid: req.body.userid });
    if(userData){
        logger.error('ERROR - User Data already exists');
        return res.status(400).send('User Data already exists');
    }

    //Create a new user data object and add to db
    userData = new UserData();

    var keys = Object.keys(req.body);
    for(var i = 0, length = keys.length; i < length; i++) {
        if(keys[i] != 'tlushpassword'){
            userData[keys[i]] = req.body[keys[i]];
        }
    }

    //Save encrypted tlush password
    userData.tlushpassword = encrypt(req.body['tlushpassword']);

    userData.createdDate = new Date();
    await userData.save();

    //Send the created user data
    res.send(userData);
});

router.put('/:userid', auth, async function (req, res) {
    logger.debug(`PUT /${req.params.userid} - Invoked`);

    //Validate requested details
    const result = validateUserData(req.body);
    if(result.error){
        logger.error(`ERROR - ${result.error.message}`);
        return res.status(400).send(result.error.message);
    }

    let userData = await UserData.findOne({ userid: req.params.userid });
    if(!userData){
        logger.error('ERROR - User Data does not exist');
        return res.status(400).send('User Data does not exist');
    }

    //Update requested userData
    var keys = Object.keys(req.body);
    for(var i = 0, length = keys.length; i < length; i++) {
        if(keys[i] != 'tlushpassword'){
            userData[keys[i]] = req.body[keys[i]];
        }
    }

    //Save encrypted tlush password if exists
    if(req.body['tlushpassword']){
        userData.tlushpassword = encrypt(req.body['tlushpassword']);
    }

    userData.updatedDate = new Date();
    await userData.save();

    //Send the updated user data
    res.send(userData);
});

module.exports = router;