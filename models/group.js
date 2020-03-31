const mongoose = require('mongoose');
const Joi = require('joi');

const groupSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true,
        minlength:5,
        maxlength:50
    },
    imageUrl: {
        type: String
    },
    masterId: {
        type: String, 
        required: true,
        trim: true
    },
    slaveIds: [{
        type: String, 
        trim: true
    }],
    createdDate: {
        type: Date,
        required: true
    },
    updatedDate: {
        type: Date
    }
},{collection: 'groups'});

const Group = mongoose.model('Group', groupSchema, 'groups');

//Utilities
function validateGroup(group){
    const groupSchema = {
        _id: Joi.objectId(),
        name: Joi.string().min(5).max(50).required(),
        masterId: Joi.objectId().required(),
        slaveIds: Joi.array(),
        createdDate: Joi.date(),
        updatedDate: Joi.date()
    }
    return Joi.validate(group, groupSchema);
};

exports.Group = Group;
exports.validateGroup = validateGroup;