const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const log4js = require('log4js');
const logger = log4js.getLogger('auth');

router.post('/', async function (req, res) {
    logger.debug('POST / - Invoked');

    //Validate requested  details
    const result = validateUser(req.body);
    if(result.error){
        logger.error(`Validation error for ${req.body}: ${result}`);
        return res.status(400).send(result.error.message);
    }

    let user = await User.findOne({ email: req.body.email });
    if(!user){
        logger.error(`Invalid email for ${req.body}`);
        return res.status(400).send('Invalid email or password');
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) {
        logger.error(`Invalid password`);
        return res.status(400).send('Invalid email or password');
    }

    user.token = user.generateAuthToken();
    res.send(_.omit(user.toObject(), ['password', '__v']));
});

//Utilities
function validateUser(req){
    logger.debug('validateUser(.) - Invoked');

    const schema = {
        email: Joi.string().min(5).max(255).email().required(),
        password: Joi.string().min(5).max(255).required()
    }
    return Joi.validate(req, schema);
};

module.exports = router;