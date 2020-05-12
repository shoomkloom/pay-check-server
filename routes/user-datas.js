const auth = require('../middleware/auth');
const {UserData, validateUserData} = require('../models/user-data');
const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const log4js = require('log4js');
const logger = log4js.getLogger('user-datas');

router.get('/', auth, async function (req, res) {
    logger.debug('GET / - Invoked');
    //Get the list of user-datas
    const userDatas = await UserData.find();
    res.send(userDatas);
});

router.get('/:userid', auth, async function (req, res) {
    logger.debug(`GET /${req.params.userid} - Invoked`);
    
    //Find requested user data
    let userData = await UserData.findOne({ userid: req.params.userid });
    if(!userData){
        logger.error(`Could not find a user data with id=${req.params.id}`);
        return res.status(404).send(`Could not find a user data with id=${req.params.id}`);
    }
    
    //Send the requested user data
    res.send(userData);
});

router.post('/', auth, async function (req, res) {
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

    let relatedUser = await User.findOne({ _id: req.body.userid });
    if(!relatedUser){
        logger.error(`Could not find a user with id=${req.body.userid}`);
        return res.status(404).send(`Could not find a user with id=${req.body.userid}`);
    }

    //Create a new user data object and add to db
    userData = new UserData();

    var keys = Object.keys(req.body);
    for(var i = 0, length = keys.length; i < length; i++) {
        userData[keys[i]] = req.body[keys[i]];
    }

    userData.createdDate = new Date();
    await userData.save();

    relatedUser.fullyregestered = true;
    relatedUser.updatedDate = new Date();
    await relatedUser.save();

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
        userData[keys[i]] = req.body[keys[i]];
    }

    userData.updatedDate = new Date();
    await userData.save();

    //Send the updated user data
    res.send(userData);
});

module.exports = router;