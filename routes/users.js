const auth = require('../middleware/auth');
const {User, validateUser} = require('../models/user');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const log4js = require('log4js');
const logger = log4js.getLogger('users');

router.get('/', auth, async function (req, res) {
    logger.debug('GET / - Invoked');
    //Get the list of users
    const users = await User.find().sort('name');
    res.send(_.map(users, _.partialRight(_.pick, ['_id', 'name', 'email'])));
});

router.get('/:id', auth, async function (req, res) {
    logger.debug(`GET /${req.params.id} - Invoked`);
    //Find requested user
    const user = await User.findById(req.params.id);

    if(!user){
        logger.error(`Could not find a user with id=${req.params.id} - ` + ex);
        return res.status(404).send(`Could not find a user with id=${req.params.id}`);
    }
    
    //Get the requested user
    res.send(_.pick(user, ['_id', 'name', 'email']));
});

router.post('/', async function (req, res) {
    logger.debug('POST / - Invoked');

    console.log('req.body: ', req.body);

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
    user.createdDate = new Date();

    const salt = await bcrypt.genSalt(10);   
    user.password = await bcrypt.hash(user.password, salt) ;
    
    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;