const mongoose = require('mongoose');
const Joi = require('joi');

const choreTemplateSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true,
        minlength:4,
        maxlength:50
    },
    imageUrl: {
        type: String
    },
    details: { 
        type: String, 
        required: true,
        trim: true,
        minlength:5,
        maxlength:1024
    },
    state: { 
        type: String, 
        required: true,
    },
    creatorId: {
        type: String, 
        required: true,
        trim: true
    },
    createdDate: {
        type: Date,
        required: true
    },
    updatedDate: {
        type: Date
    }
},{collection: 'choreTemplates'});

const ChoreTemplate = mongoose.model('ChoreTemplate', choreTemplateSchema, 'choreTemplates');

//Utilities
function validateChoreTemplate(choreTemplate){
    const choreTemplateSchema = {
        name: Joi.string().min(4).max(50).required(),
        details: Joi.string().min(4).max(1024).required(),
        creatorId: Joi.objectId().required()
    }
    return Joi.validate(choreTemplate, choreTemplateSchema);
};

exports.ChoreTemplate = ChoreTemplate;
exports.validateChoreTemplate = validateChoreTemplate;