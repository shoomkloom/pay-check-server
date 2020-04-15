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
    gmuleihishtalmut: {
        type: String,
        required: true
    },
    ofekhadash: {
        type: Boolean,
        required: true
    },
    vetekformaly: {
        type: Number,
        required: true
    },
    vetekformalystart: {
        type: Number,
        required: true
    },
    veteknotformaly: {
        type: Number,
        required: true
    },
    vetekzahalpolice: {
        type: Number,
        required: true
    },
    sadirmonths: {
        type: Number,
        required: true
    },
    zahalkevayears: {
        type: Number,
        required: true
    },
    policesherutyears: {
        type: Number,
        required: true
    },
    zahalhoraa: {
        type: Boolean,
        required: true
    },
    policehoraa: {
        type: Boolean,
        required: true
    },
    madrichshelach: {
        type: Boolean,
        required: true
    },
    vetekprofessional: {
        type: Number,
        required: true
    },
    vetekminhalit: {
        type: Number,
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
        gmuleihishtalmut: Joi.string().required(),
        ofekhadash: Joi.boolean().required(),
        vetekformaly: Joi.number().required(),
        vetekformalystart: Joi.number().required(),
        veteknotformaly: Joi.number().required(),
        vetekzahalpolice: Joi.number().required(),
        sadirmonths: Joi.number().required(),
        zahalkevayears: Joi.number().required(),
        policesherutyears: Joi.number().required(),
        zahalhoraa: Joi.boolean().required(),
        policehoraa: Joi.boolean().required(),
        madrichshelach: Joi.boolean().required(),
        vetekprofessional: Joi.number().required(),
        vetekminhalit: Joi.number().required()
    }
    return Joi.validate(userData, userDataSchema);
};

exports.UserData = UserData;
exports.validateUserData = validateUserData;
exports.userDataSchema = userDataSchema;