const auth = require('../middleware/auth');
const {Chore, validateChore} = require('../models/chore');
const {User} = require('../models/user');
const {ChoreTemplate} = require('../models/chore-template');
const express = require('express');
const _ = require('lodash');
const router = express.Router();
const log4js = require('log4js');
const logger = log4js.getLogger('chores');

router.get('/', auth, async function (req, res) {
    logger.debug('GET / - Invoked');
    //Get the list of chores
    const chores = await Chore.find().sort('date');
    res.send(_.map(chores, _.partialRight(_.pick, ['_id', 'choreTemplateId', 'name', 'imageUrl', 'details', 'masterId', 'slaveId', 'state', 'date', 'comment', 'createdDate', 'updatedDate'])));
});

router.get('/mine/:id', auth, async function (req, res) {
    logger.debug(`GET /mine/${req.params.id} - Invoked`);
    //Get the list of chores assigned to me
    const chores = await Chore.find({slaveId: req.params.id}).sort('date');
    res.send(_.map(chores, _.partialRight(_.pick, ['_id', 'choreTemplateId', 'name', 'imageUrl', 'details', 'masterId', 'slaveId', 'state', 'date', 'comment', 'createdDate', 'updatedDate'])));
});

router.get('/me/:id', auth, async function (req, res) {
    logger.debug(`GET /me/${req.params.id} - Invoked`);
    //Get the list of chores that I assigned or were assigned to me
    const chores = await Chore.find({$or:[{slaveId: req.params.id},{masterId: req.params.id}]}).sort('date');
    res.send(_.map(chores, _.partialRight(_.pick, ['_id', 'choreTemplateId', 'name', 'imageUrl', 'details', 'masterId', 'slaveId', 'state', 'date', 'comment', 'createdDate', 'updatedDate'])));
});

router.get('/:id', auth, async function (req, res) {
    logger.debug(`GET /${req.params.id} - Invoked`);
    //Find requested chore
    const chore = await Chore.findById(req.params.id);

    if(!chore){
        logger.error(`Could not find a chore with id=${req.params.id}`);
        return res.status(404).send(`Could not find a chore with id=${req.params.id}`);
    }
    
    //Get the requested chore
    res.send(_.pick(chore, ['_id', 'choreTemplateId', 'name', 'imageUrl', 'details', 'masterId', 'slaveId', 'state', 'date', 'comment', 'createdDate', 'updatedDate']));
});

router.post('/', auth, async function (req, res) {
    logger.debug('POST / - Invoked');

    //Validate requested  details
    const result = validateChore(req.body);
    if(result.error){
        logger.error(`EXCEPTION - ${result.error}`);
        return res.status(400).send(result.error.message);
    }

    const masterUser = await User.findById(req.body.masterId);
    if(!masterUser){
        logger.error(`Could not find a user with id=${req.body.masterId}`);
        return res.status(404).send(`Could not find a user with id=${req.body.masterId}`);
    }

    const choreTemplate = await ChoreTemplate.findById(req.body.choreTemplateId);
    if(!choreTemplate){
        logger.error(`Could not find a chore template with id=${req.body.choreTemplateId}`);
        return res.status(404).send(`Could not find a chore template with id=${req.body.choreTemplateId}`);
    }

    //Create a new chore
    let chore = new Chore({
        name: choreTemplate.name,
        choreTemplateId: req.body.choreTemplateId,
        details: choreTemplate.details,
        masterId: req.body.masterId,
        slaveId: req.body.slaveId,
        scheduledDates: req.body.scheduledDates,
        comment: req.body.comment,
        state: req.body.state,
        date: req.body.date,
        createdDate: new Date()
    });

    chore = await chore.save();
    res.send(_.pick(chore, ['_id', 'choreTemplateId', 'name', 'imageUrl', 'details', 'masterId', 'slaveId', 'state', 'date', 'comment', 'createdDate', 'updatedDate']));
});

router.put('/:id', auth, async function (req, res) {
    logger.debug(`PUT /${req.params.id} - Invoked`);
    let chore = await Chore.findById(req.params.id);
    if(!chore){
        logger.error(`Could not find a chore with id=${req.params.id}`);
        return res.status(404).send(`Could not find a chore with id=${req.params.id}`);
    }

    //Update requested chore
    if(req.body.state){
        chore.state = req.body.state;
    }
    if(req.body.comment){
        chore.comment = req.body.comment;
    }

    chore.updatedDate = new Date();

    chore = await chore.save();

    //Send the updated chore
    res.send(_.pick(chore, ['_id', 'choreTemplateId', 'name', 'imageUrl', 'details', 'masterId', 'slaveId', 'state', 'date', 'comment', 'createdDate', 'updatedDate']));
});

router.delete('/:id', auth, async function (req, res) {
    logger.debug(`DEL /${req.params.id} - Invoked`);
    //Find and delete requested chore
    const chore = await Chore.findByIdAndRemove(req.params.id);
    if(!chore){
        logger.error(`Could not find a chore with id=${req.params.id}`);
        return res.status(404).send(`Could not find a chore with id=${req.params.id}`);
    }
    
    //Send the deleted chore
    res.send(_.pick(chore, ['_id', 'choreTemplateId', 'name', 'imageUrl', 'details', 'masterId', 'slaveId', 'state', 'date', 'comment', 'createdDate', 'updatedDate']));
});

module.exports = router;