const auth = require('../middleware/auth');
const {User} = require('../models/user');
const {UserTlushData} = require('../models/user-tlush-data');
const {UserTlushResult} = require('../models/user-tlush-result');
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

router.get('/usertlushresult', auth, async function (req, res) {
    logger.debug(`GET /usertlushresult - Invoked`);

    try{
        //Find list of usertlushdatas that don't have usertlushresult
        let userTlushDatas = await UserTlushData.find();
        let nowDateTime = new Date().getTime();
        for (let userTlushData of userTlushDatas){
            //If this processtlushDate is less than 5 minutes, skip to the next one
            if(!userTlushData.processtlushDate || 
                Math.abs(nowDateTime - userTlushData.processtlushDate.getTime())/(1000 * 60) > 5){
                //For each usertlushdata try to find a usertlushresult object
                let foundUserTlushResult = await UserTlushResult.findOne({usertlushdataid: userTlushData._id});
                if(!foundUserTlushResult){
                    //Send the first usertlushdata object we find that does not have a usertlushresult
                    userTlushData.processtlushDate = nowDateTime;
                    await userTlushData.save();
                    return res.send(_.omit(userTlushData.toObject(), ['fronthtml', 'backhtml', '__v']));
                }
            }
        }
    }
    catch(ex){
        let error = 'Could not get usertlushdata object';
        logger.error(`${error} Exception=${ex}`);
        return res.status(500).send(error);
    }
    return res.send({});
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
    logger.debug(`GET /${req.params.userid}/${req.params.year}/${req.params.month} - Invoked`);

    try{
        const userTlushData = await UserTlushData.find({'userid': req.params.userid, 'periodyear':req.params.year, 'periodmonth':req.params.month});
        if(!userTlushData){
            const error = `Could not find a user tlush data with id=${req.params.userid}, periodyear=${req.params.year}, periodmonth=${req.params.month}`;
            logger.error(error + ` - ${ex}`);
            return res.status(404).send(error);
        }
        
        //Send the requested user tlush data
        res.send(userTlushDatas);
    }
    catch(ex){
        const error = `Could not find a user tlush data with id=${req.params.userid}, periodyear=${req.params.year}, periodmonth=${req.params.month}`;
        logger.error(`${error} Exception=${ex}`);
        return res.status(500).send(error);
    }
});

router.post('/', auth, async function (req, res) {
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

    //Create a new usertlushdata object and add to db
    let newUserTlushData = new UserTlushData();

    var keys = Object.keys(req.body);
    for(var i = 0, length = keys.length; i < length; i++) {
        newUserTlushData[keys[i]] = req.body[keys[i]];
    }

    //Find related user
    let user = await User.findOne({ _id: req.body.userid });
    if(!user){
        logger.error(`Could not find related user with id=${req.body.userid}`);
        return res.status(404).send(`Could not find related user with id=${req.body.userid}`);
    }

    //Update user data object
    user.gettlushDate = null;
    user.updatedDate = new Date();
    user.save();

    //Save user tlush data object
    newUserTlushData.createdDate = new Date();
    await newUserTlushData.save();

    //Send the created user tlush data
    res.send(newUserTlushData);
});

module.exports = router;