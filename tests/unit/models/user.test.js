const { User } = require('../../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('user.generateAuthToken', () => {
    it('should return a valid jwt auth token', () => {
        const payload = {
            _id: mongoose.Types.ObjectId().toHexString()/*@@, 
            isAdmin: true*/
        };
        const user = new User(payload);
        const token = user.generateAuthToken();
        const result = jwt.verify(token, config.get('jwtPrivateKey'));

        expect(result).toMatchObject(payload);
    });
});