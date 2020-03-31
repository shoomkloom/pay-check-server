const mongoose = require('mongoose');
const Joi = require('joi');

const choreSchema = new mongoose.Schema({
    choreTemplateId: {
        type: String, 
        required: true
    },
    name: { 
        type: String, 
        required: true,
        trim: true,
        minlength:3,
        maxlength:50
    },
    imageUrl: {
        type: String
    },
    details: { 
        type: String, 
        required: true,
        trim: true,
        maxlength:1024
    },
    masterId: {
        type: String, 
        required: true
    },
    slaveId: {
        type: String, 
        required: true
    },
    state: { //Pending, Done, Reject
        type: String, 
        required: true
    },
    date: {
        type: Date,
        required: true
    },
/*@@  
    Should probably add Sun, Mon, Tue... instead of 'everyDay'
    everyDay: {
        type: Boolean
    },
    everyWeek: {
        type: Boolean
    },
    everyMonth: {
        type: Boolean
    },
    everyYear: {
        type: Boolean
    },
    repititions: {
        type: Number
    },
@@*/    
    comment: { 
        type: String, 
        trim: true,
        maxlength:1024
    },
    createdDate: {
        type: Date,
        required: true
    },
    updatedDate: {
        type: Date
    }
},{collection: 'chores'});

const Chore = mongoose.model('Chore', choreSchema, 'chores');

//Utilities
function validateChore(chore){
    const choreSchema = {
        masterId: Joi.objectId().required(),
        choreTemplateId: Joi.objectId().required(),
        slaveId: Joi.objectId().required(),
        state: Joi.string().required(),
        date: Joi.date().required()
    }
    return Joi.validate(chore, choreSchema);
};

exports.Chore = Chore;
exports.validateChore = validateChore;