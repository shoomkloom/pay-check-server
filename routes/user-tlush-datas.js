const auth = require('../middleware/auth');
const {UserData} = require('../models/user-data');
const {UserTlushData, validateUserTlushData} = require('../models/user-tlush-data');
const {encrypt, decrypt} = require('../models/helpers');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const log4js = require('log4js');
const logger = log4js.getLogger('user-tlush-datas');

router.get('/', auth, async function (req, res) {
    logger.debug('GET / - Invoked');
    //Get the list of user-tlush-datas
    const userTlushDatas = await UserTlushData.find();
    res.send(userTlushDatas);
});

router.get('/:userid', auth, async function (req, res) {
    logger.debug(`GET /${req.params.userid} - Invoked`);
    
    //Find requested list of user tlush datas
    let userTlushDatas = await UserTlushData.find({ userid: req.body.userid });
    if(!userTlushDatas){
        logger.error(`Could not find user tlush datas with id=${req.params.id}`);
        return res.status(404).send(`Could not find user tlush datas with id=${req.params.id}`);
    }
    
    //Send the requested user tlush data
    res.send(userTlushDatas);
});

router.get('/:userid/:year/:month', auth, async function (req, res) {
    logger.debug(`GET /${req.params.year}/${req.params.month} - Invoked`);

    try{
        const userTlushData = await UserTlushData.find({'userid': userData.userid, 'periodyear':req.params.year, 'periodmonth':req.params.month});
        if(!userTlushData){
            const error = `Could not find a user tlush data with id=${req.params.id}, periodyear=${req.params.year}, periodmonth=${req.params.month}`;
            logger.error(error + ` - ${ex}`);
            return res.status(404).send(error);
        }
        
        //Send the requested user tlush data
        res.send(userTlushDatas);
    }
    catch(ex){
        const error = `Could not find a user tlush data with id=${req.params.id}, periodyear=${req.params.year}, periodmonth=${req.params.month}`;
        logger.error(`${error} Exception=${ex}`);
        return res.status(500).send(error);
    }
});

router.post('/', async function (req, res) {
    logger.debug('POST / - Invoked');

/*@@    
    //Validate requested details
    const result = validateUserTlushData(req.body);
    if(result.error){
        logger.error(`ERROR - ${result.error}`);
        return res.status(400).send(result.error.message);
    }
@@*/

    let userTlushData = await UserTlushData.findOne({ 
        userid: req.body.userid, 
        periodyear: req.body.periodyear, 
        periodmonth: req.body.periodmonth 
    });
    
    if(userTlushData){
        let error = `ERROR - User Tlush Data already exists for ${req.body.userid}/${req.body.periodyear}/${req.body.periodmonth}`;
        logger.error(error);
        return res.status(400).send(error);
    }

    //Create a new user tlush data object and add to db
    let newUserTlushData = new UserTlushData();

    var keys = Object.keys(req.body);
    for(var i = 0, length = keys.length; i < length; i++) {
        newUserTlushData[keys[i]] = req.body[keys[i]];
    }

    //Find related user data
    let userData = await UserData.findOne({ userid: req.body.userid });
    if(!userData){
        logger.error(`Could not find related user data with id=${req.params.id}`);
        return res.status(404).send(`Could not find related user data with id=${req.params.id}`);
    }

    //Update user data object
    userData.gettlushDate = null;
    userData.updatedDate = new Date();
    userData.save();

    //Save user tlush data object
    newUserTlushData.createdDate = new Date();
    await newUserTlushData.save();

    //Send the created user tlush data
    res.send(newUserTlushData);
});

/*@@
router.put('/:userid', auth, async function (req, res) {
    logger.debug(`PUT /${req.params.userid} - Invoked`);

    //Validate requested details
    const result = validateUserTlushData(req.body);
    if(result.error){
        logger.error(`ERROR - ${result.error.message}`);
        return res.status(400).send(result.error.message);
    }

    let userTlushData = await UserTlushData.findOne({ userid: req.params.userid });
    if(!userTlushData){
        logger.error('ERROR - User Data does not exist');
        return res.status(400).send('User Data does not exist');
    }

    //Update requested userData
    var keys = Object.keys(req.body);
    for(var i = 0, length = keys.length; i < length; i++) {
        userTlushData[keys[i]] = req.body[keys[i]];
    }

    userTlushData.updatedDate = new Date();
    await userTlushData.save();

    //Send the updated user data
    res.send(userTlushData);
});
@@*/

module.exports = router;