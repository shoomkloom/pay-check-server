const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userTlushDataSchema = new mongoose.Schema({
    userid:{
        type: String,
        required: true
    },
    periodyear: {
        type: Number,
        required: true
    },
    periodmonth: {
        type: Number,
        required: true
    },
    fronthtml: {
        type: String,
        required: true
    },
    backhtml: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        required: true
    },
    updatedDate: {
        type: Date
    }
},{collection: 'usertlushdatas'});

const UserTlushData = mongoose.model('UserTlushData', userTlushDataSchema, 'usertlushdatas');

//Utilities
function validateUserTlushData(userTlushData){
    const userTlushDataSchema = {
        userid: Joi.string().required(),
        periodyear: Joi.number().required(),
        periodmonth: Joi.number().required(),
        fronthtml: Joi.string().required(),
        backhtml: Joi.string().required()
    }
    return Joi.validate(userTlushData, userTlushDataSchema);
};

exports.UserTlushData = UserTlushData;
exports.validateUserTlushData = validateUserTlushData;
exports.userTlushDataSchema = userTlushDataSchema;