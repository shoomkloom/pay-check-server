const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userDataSchema = new mongoose.Schema({
    userid:{
        type: String,
        required: true
    },
    ahuzeimisra: {
        type: Number,
        required: true
    },
    hachshara: {
        type: String,
        required: true
    },
    vetekyears: {
        type: Number,
        required: true
    },
    teudathoraa: {
        type: Boolean,
        required: true
    },
    rishyonhoraa: {
        type: Boolean,
        required: true
    },
    ofekhadash: {
        type: Boolean,
        required: true
    },
    createdDate: {
        type: Date,
        required: true
    },
    updatedDate: {
        type: Date
    }
},{collection: 'userdatas'});

const UserData = mongoose.model('UserData', userDataSchema, 'userdatas');

//Utilities
function validateUserData(userData){
    const userDataSchema = {
        userid: Joi.string().required(),
        ahuzeimisra: Joi.number().required(),
        hachshara: Joi.string().required(),
        vetekyears: Joi.number().required(),
        teudathoraa: Joi.boolean().required(),
        rishyonhoraa: Joi.boolean().required(),
        ofekhadash: Joi.boolean().required()
    }
    return Joi.validate(userData, userDataSchema);
};

exports.UserData = UserData;
exports.validateUserData = validateUserData;
exports.userDataSchema = userDataSchema;