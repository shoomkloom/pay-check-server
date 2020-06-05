const mongoose = require('mongoose');
const Joi = require('joi');

const userTlushResultSchema = new mongoose.Schema({
    userid:{
        type: String,
        required: true
    },
    usertlushdataid:{
        type: String
    },
    status:{
        type: String,
        required: true
    },
    errors:{
        type: Array
    },
    createdDate: {
        type: Date,
        required: true
    },
    updatedDate: {
        type: Date
    }
},{collection: 'usertlushresults'});

const UserTlushResult = mongoose.model('UserTlushResult', userTlushResultSchema, 'usertlushresults');

//Utilities
function validateUserTlushResult(userTlushResult){
    const userTlushResultSchema = {
        userid: Joi.string().required(),
        usertlushdataid: Joi.string().required(),
        status: Joi.string().required(),
        errors: Joi.array()
    }
    return Joi.validate(userTlushResult, userTlushResultSchema);
};

exports.UserTlushResult = UserTlushResult;
exports.validateUserTlushResult = validateUserTlushResult;
exports.userTlushResultSchema = userTlushResultSchema;