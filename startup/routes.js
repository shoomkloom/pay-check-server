const express = require('express');
const choreTemplates = require('../routes/chore-templates');
const chores = require('../routes/chores');
const groups = require('../routes/groups');
const users = require('../routes/users');
const userDatas = require('../routes/user-datas');
const userTlushDatas = require('../routes/user-tlush-datas');
const auth = require('../routes/auth');
const error = require('../middleware/error');

module.exports = function(app) {
    //Support using json in express
    app.use(express.json({limit: '50mb'}));
    app.use(express.static('public'));
    app.use('/api/chore-templates', choreTemplates);    
    app.use('/api/chores', chores);
    app.use('/api/groups', groups);
    app.use('/api/users', users);
    app.use('/api/user-datas', userDatas);
    app.use('/api/user-tlush-datas', userTlushDatas);
    app.use('/api/auth', auth);

    //Must be last!
    app.use(error);
}