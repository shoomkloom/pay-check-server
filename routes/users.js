const auth = require('../middleware/auth');
const {User, validateUser, validateUserUpdate} = require('../models/user');
const {UserTlushData} = require('../models/user-tlush-data');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const {encrypt, decrypt} = require('../models/helpers');
const log4js = require('log4js');
const logger = log4js.getLogger('users');

router.get('/', auth, async function (req, res) {
    logger.debug('GET / - Invoked');
    //Get the list of users
    const users = await User.find().sort('name');
    res.send(_.map(users, _.partialRight(user => _.omit(user.toObject(), ['password', '__v']))));
});

router.get('/:id', auth, async function (req, res) {
    logger.debug(`GET /${req.params.id} - Invoked`);
    //Find requested user
    const user = await User.findById(req.params.id);
    if(!user){
        logger.error(`Could not find a user with id=${req.params.id} - ` + ex);
        return res.status(404).send(`Could not find a user with id=${req.params.id}`);
    }
    
    //Send the requested user
    res.send(_.omit(user.toObject(), ['password', '__v']));
});

router.post('/', async function (req, res) {
    logger.debug('POST / - Invoked');

    //Validate requested details
    const result = validateUser(req.body);
    if(result.error){
        logger.error(`ERROR - ${result.error}`);
        return res.status(400).send(result.error.message);
    }

    let user = await User.findOne({ email: req.body.email });
    if(user){
        logger.error('ERROR - User already registered');
        return res.status(400).send('User already registered');
    }

    //Create a new user and add to db
    user = new User(_.pick(req.body, ['name', 'email', 'password', 'phone']));
    user.fullyregestered = false;
    user.createdDate = new Date();

    const salt = await bcrypt.genSalt(10);   
    user.password = await bcrypt.hash(user.password, salt) ;
    
    await user.save();

    user.token = user.generateAuthToken();
    res.send(_.pick(user, ['_id', 'name', 'email', 'phone', 'fullyregestered']));
});

router.put('/:id', auth, async function (req, res) {
    logger.debug(`PUT /${req.params.id} - Invoked`);

    //Validate requested details
    const result = validateUserUpdate(req.body);
    if(result.error){
        logger.error(`ERROR - ${result.error.message}`);
        return res.status(400).send(result.error.message);
    }

    let user = await User.findById(req.params.id);
    if(!user){
        logger.error(`Could not find a user with id=${req.params.id} - ` + ex);
        return res.status(404).send(`Could not find a user with id=${req.params.id}`);
    }

    //Update user
    var keys = Object.keys(req.body);
    for(var i = 0, length = keys.length; i < length; i++) {
        if(keys[i] != 'gettlushDate' && 
            keys[i] != 'processtlushDate' &&
            keys[i] != 'createdDate' &&
            keys[i] != 'updatedDate'){

            user[keys[i]] = req.body[keys[i]];
        }
    }
        
    //Save encrypted tlush password
    user.tlushpassword = encrypt(req.body['tlushpassword']);
    user.updatedDate = new Date();
    await user.save();

    //Send the updated user
    res.send(_.omit(user.toObject(), ['password', '__v']));
});

router.get('/:id/cleartlushcred', auth, async function (req, res) {
    logger.debug(`GET /${req.params.id}/cleartlushcred - Invoked`);
    
    //Find requested user data
    let user = await User.findOne({ _id: req.params.id });
    if(!user){
        logger.error(`Could not find a user with id=${req.params.id}`);
        return res.status(404).send(`Could not find a user with id=${req.params.id}`);
    }

    user.tlushpassword = null;
    user.save();
    logger.info(`tlushpassword cleared for user id=${user._id}`);
    
    //Send the requested user
    res.send(_.omit(user.toObject(), ['password', '__v']));
});

router.get('/usertlushdata/:year/:month', auth, async function (req, res) {
    logger.debug(`GET /usertlushdata/${req.params.year}/${req.params.month} - Invoked`);

    try{
        //Find list of users that don't have usertlushdata for this period
        let users = await User.find({"tlushpassword" : { $ne : null }});
        for (let user of users){
            //If this gettlushDate is less than hour, skip to the next one
            let nowDate = new Date();
            if(!user.gettlushDate || 
                Math.abs(nowDate.getTime() - user.gettlushDate.getTime())/(1000 * 60) > 1/*@@60*/){
                //For each user try to find a usertlushdata object
                //for this month
                let foundUserTlushData = await UserTlushData.findOne({'userid': user._id, 'periodyear':req.params.year, 'periodmonth':req.params.month}).exec();
                if(!foundUserTlushData){
                    //Send the first user object we find that does not have a
                    //usertlushdata for the requested month
                    user.gettlushDate = nowDate;
                    await user.save();

                    user.tlushpassword = decrypt(user.tlushpassword);
                    return res.send(_.omit(user.toObject(), ['password', '__v']));
                }
            }
        }
    }
    catch(ex){
        let error = `Could not get list of user objects for year=${req.params.year}, month=${req.params.month}`;
        logger.error(`${error} Exception=${ex}`);
        return res.status(500).send(error);
    }
    return res.send({});
});


module.exports = router;