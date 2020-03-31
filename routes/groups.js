const auth = require('../middleware/auth');
const {Group, validateGroup} = require('../models/group');
const {User} = require('../models/user');
const express = require('express');
const _ = require('lodash');
const router = express.Router();
const mongoose = require('mongoose');
const log4js = require('log4js');
const logger = log4js.getLogger('groups');

router.get('/', auth, async function (req, res) {
    logger.debug('GET / - Invoked');
    //Get the list of groups
    const groups = await Group.find().sort('name');
    res.send(_.map(groups, _.partialRight(_.pick, ['_id', 'name', 'masterId', 'slaveIds', 'createdDate', 'updatedDate'])));
});

router.get('/me/:masterId', auth, async function (req, res) {
    logger.debug('GET /me/:masterId - Invoked');
    //Get the list of groups created by masterId
    const groups = await Group.find({masterId: req.params.masterId}).sort('name');
    
    res.send(_.map(groups, _.partialRight(_.pick, ['_id', 'name', 'masterId', 'slaveIds', 'createdDate', 'updatedDate'])));
});

router.get('/:id', auth, async function (req, res) {
    logger.debug(`GET /${req.params.id} - Invoked`);
    //Find requested group
    const group = await Group.findById(req.params.id);

    if(!group){
        logger.error(`Could not find a group with id=${req.params.id} - ` + ex);
        return res.status(404).send(`Could not find a group with id=${req.params.id}`);
    }
    
    //Get the requested group
    res.send(_.pick(group, ['_id', 'name', 'masterId', 'slaveIds', 'createdDate', 'updatedDate']));
});

router.get('/:id/users', auth, async function (req, res) {
    logger.debug(`GET /${req.params.id}/users - Invoked`);
    //Find requested group
    const group = await Group.findById(req.params.id);

    if(!group){
        logger.error(`Could not find a group with id=${req.params.id} - ` + ex);
        return res.status(404).send(`Could not find a group with id=${req.params.id}`);
    }

    //collect all group users to array
    let groupUsers = [];
    
    const masterUser = await User.findById(group.masterId);
    if(!masterUser){
        logger.error(`Could not find the group master with id=${group.masterId}`);
        return res.status(404).send(`Could not find a group master with id=${group.masterId}`);
    }
    groupUsers.push(masterUser);

    for(let groupSlaveId of group.slaveIds) {
        let slaveUser = await User.findById(groupSlaveId);
        if(!slaveUser){
            logger.error(`Could not find the group slave with id=${groupSlaveId}`);
            return res.status(404).send(`Could not find a group slave with id=${groupSlaveId}`);
        }
        groupUsers.push(slaveUser);
    }
    
    //Get the requested group users
    res.send(_.map(groupUsers, _.partialRight(_.pick, ['_id', 'name', 'email'])));
});

router.get('/master/:masterid', auth, async function (req, res) {
    logger.debug(`GET /${req.params.masterid} - Invoked`);
    //Find groups with this masterId
    const groups = await Group.find({ masterId: masterid });

    //Get the found groups
    res.send(_.map(groups, _.partialRight(_.pick, ['_id', 'name', 'masterId', 'slaveIds', 'createdDate', 'updatedDate'])));
});

router.get('/slave/:slaveid', auth, async function (req, res) {
    logger.debug(`GET /${req.params.slaveid} - Invoked`);

    //Find groups that has this slaveId
    const groups = await Group.find(
        {
           $elemMatch: {"slaveIds" : req.params.slaveid } 
        });

    //Get the found groups
    res.send(_.map(groups, _.partialRight(_.pick, ['_id', 'name', 'masterId', 'slaveIds', 'createdDate', 'updatedDate'])));
});

router.post('/', auth, async function (req, res) {
    logger.debug('POST / - Invoked');
    
    //Validate requested details
    const result = validateGroup(req.body);
    if(result.error){
        logger.error(`ERROR - ${result.error.message}`);
        return res.status(400).send(result.error.message);
    }

    const masterUser = await User.findById(req.body.masterId);
    if(!masterUser){
        logger.error(`Could not find a user with id=${req.body.id}`);
        return res.status(404).send(`Could not find a user with id=${req.body.id}`);
    }

    //Create a new group
    let group = new Group({
        name: req.body.name,
        masterId: req.body.masterId,
        createdDate: new Date()
    });

    if(req.body.slaveIds){
        req.body.slaveIds.forEach(slaveId => {
            group.slaveIds.push(slaveId);
        });
    }

    group = await group.save();

    //Send the created group
    res.send(_.pick(group, ['_id', 'name', 'masterId', 'slaveIds', 'createdDate', 'updatedDate']));
});

router.put('/:id/addUser', auth, async function (req, res) {
    logger.debug(`PUT /${req.params.id}/addUser with userId: ${req.body.userId} - Invoked`);
    let group = await Group.findById(req.params.id);

    if(!group){
        logger.error(`Could not find a group with id=${req.params.id}`);
        return res.status(404).send(`Could not find a group with id=${req.params.id}`);
    }

    //Find the customer by id in the request
    const slaveUser = await User.findById(req.body.userId);
    if(!slaveUser){
        logger.error(`Could not find a user with id=${req.body.userId}`);
        return res.status(404).send(`Could not find a user with id=${req.body.userId}`);
    }
    
    //Update requested group
    if(group.slaveIds.indexOf(req.body.userId) > -1){
        logger.info(`Group already has a user with id=${req.body.userId}`);
        return res.status(204).send(`Group already has a user with id=${req.body.userId}`);
    }
    else{
        group.slaveIds.push(req.body.userId);
        group.updatedDate = new Date();
        group = await group.save();
    }

    //Send the updated group
    res.send(_.pick(group, ['_id', 'name', 'masterId', 'slaveIds', 'createdDate', 'updatedDate']));
});

router.put('/:id/removeUser', auth, async function (req, res) {
    logger.debug(`PUT /${req.params.id}/removeUser userId: ${req.body.userId} - Invoked`);
    let group = await Group.findById(req.params.id);

    if(!group){
        logger.error(`Could not find a group with id=${req.params.id}`);
        return res.status(404).send(`Could not find a group with id=${req.params.id}`);
    }

    //Find the customer by id in the request
    const slaveUser = await User.findById(req.body.userId);
    if(!slaveUser){
        logger.error(`Could not find a user with id=${req.body.userId}`);
        return res.status(404).send(`Could not find a user with id=${req.body.userId}`);
    }
    
    //Update requested group
    const index = group.slaveIds.indexOf(req.body.userId);
    if (index > -1) {
        group.slaveIds.splice(index, 1);
    }
    group.updatedDate = new Date();
    group = await group.save();

    //Send the updated group
    res.send(_.pick(group, ['_id', 'name', 'masterId', 'slaveIds', 'createdDate', 'updatedDate']));
});

router.put('/:id', auth, async function (req, res) {
    logger.debug(`PUT /${req.params.id} - Invoked`);

    let group = await Group.findById(req.params.id);

    if(!group){
        logger.error(`Could not find a group with id=${req.params.id}`);
        return res.status(404).send(`Could not find a group with id=${req.params.id}`);
    }
    
    //Validate requested details
    const result = validateGroup(req.body);
    if(result.error){
        logger.error(`ERROR - ${result.error.message}`);
        return res.status(400).send(result.error.message);
    }

    const masterUser = await User.findById(req.body.masterId);
    if(!masterUser){
        logger.error(`Could not find a user with id=${req.body.id}`);
        return res.status(404).send(`Could not find a user with id=${req.body.id}`);
    }
    
    //Update requested group
    group.name = req.body.name;

    if(req.body.slaveIds){
        group.slaveIds = [];
        
        req.body.slaveIds.forEach(slaveId => {
            group.slaveIds.push(slaveId);
        });
    }
    
    group.updatedDate = new Date();
    group = await group.save();

    //Send the updated group
    res.send(_.pick(group, ['_id', 'name', 'masterId', 'slaveIds', 'createdDate', 'updatedDate']));
});

router.delete('/:id', auth, async function (req, res) {
    logger.debug(`DEL /${req.params.id} - Invoked`);
    //Find and delete requested group
    const group = await Group.findByIdAndRemove(req.params.id);
    if(!group){
        logger.error(`Could not find a group with id=${req.params.id}`);
        return res.status(404).send(`Could not find a group with id=${req.params.id}`);
    }
    
    //Send the deleted group
    res.send(_.pick(group, ['_id', 'name', 'masterId', 'slaveIds', 'createdDate', 'updatedDate']));
});

module.exports = router;