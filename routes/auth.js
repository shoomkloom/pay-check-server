const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const log4js = require('log4js');
const logger = log4js.getLogger('auth');

router.post('/', async function (req, res) {
    logger.debug('POST / - Invoked');

    //Validate requested  details
    const result = validateUser(req.body);
    if(result.error) return res.status(400).send(result.error.message);

    let user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send('Invalid email or password');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email or password');

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email', 'phone', 'fullyregestered']));
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