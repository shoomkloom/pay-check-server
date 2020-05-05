const mongoose = require('mongoose');
const Joi = require('joi');

const userTlushResultSchema = new mongoose.Schema({
    userid:{
        type: String,
        required: true
    },
    usertlushdataid:{
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
},{collection: 'usertlushresults'});

const UserTlushResult = mongoose.model('UserTlushResult', userTlushResultSchema, 'usertlushresults');

//Utilities
function validateUserTlushResult(userTlushResult){
    const userTlushResultSchema = {
        userid: Joi.string().required(),
        usertlushdataid: Joi.string().required()
    }
    return Joi.validate(userTlushResult, userTlushResultSchema);
};

exports.UserTlushResult = UserTlushResult;
exports.validateUserTlushResult = validateUserTlushResult;
exports.userTlushResultSchema = userTlushResultSchema;