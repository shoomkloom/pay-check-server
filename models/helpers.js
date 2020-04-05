'use strict';

const crypto = require('crypto');
const config = require('config');
const log4js = require('log4js');
const logger = log4js.getLogger('helpers');

const ENCRYPTION_KEY = config.get('cryptopass'); // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

function encrypt(text) {
    logger.debug('encrypt - Invoked');

    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(encryptedtext) {
    logger.debug('decrypt - Invoked');

    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}

exports.encrypt = encrypt;
exports.decrypt = decrypt;