const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true,
        minlength:3,
        maxlength:50
    },
    email: {
        type: String, 
        required: true,
        unique: true,
        trim: true,
        minlength:5,
        maxlength:255,
        validate: /[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,4}/
    },
    phone: {
        type: String, 
        trim: true,
        minlength:5,
        maxlength:20
    },
    password: {
        type: String, 
        required: true,
        trim: true,
        minlength:5,
        maxlength:1024
    },
    imageUrl: {
        type: String
    },
    fullyregestered: {
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
},{collection: 'users'});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User', userSchema, 'users');

//Utilities
function validateUser(user){
    const userSchema = {
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(255).email().required(),
        password: Joi.string().min(5).max(1024).required(),
        fullyregestered: Joi.boolean().required(),
        phone: Joi.string().min(5).max(20)
    }
    return Joi.validate(user, userSchema);
};

function validateUserUpdate(user){
    const userSchema = {
        _id: Joi.string(),
        name: Joi.string().min(3).max(50),
        email: Joi.string().min(5).max(255).email(),
        password: Joi.string().min(5).max(1024),
        phone: Joi.string().min(5).max(20),
        fullyregestered: Joi.boolean()
    }
    return Joi.validate(user, userSchema);
};

exports.User = User;
exports.validateUser = validateUser;
exports.validateUserUpdate = validateUserUpdate;
exports.userSchema = userSchema;