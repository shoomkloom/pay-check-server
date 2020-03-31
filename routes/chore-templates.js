const auth = require('../middleware/auth');
const {ChoreTemplate, validateChoreTemplate} = require('../models/chore-template');
const {User} = require('../models/user');
const express = require('express');
const _ = require('lodash');
const router = express.Router();
const log4js = require('log4js');
const logger = log4js.getLogger('chore-templates');

router.get('/', auth, async function (req, res) {
    logger.debug('GET / - Invoked');
    //Get the list of choreTemplates
    const choreTemplates = await ChoreTemplate.find().sort('name');
    res.send(_.map(choreTemplates, _.partialRight(_.pick, ['_id', 'name', 'imageUrl', 'details', 'creatorId', 'createdDate', 'updatedDate'])));
});

router.get('/:id', auth, async function (req, res) {
    logger.debug(`GET /${req.params.id} - Invoked`);
    //Find requested choreTemplate
    const choreTemplate = await ChoreTemplate.findById(req.params.id);

    if(!choreTemplate){
        logger.error(`Could not find a choreTemplate with id=${req.params.id}`);
        return res.status(404).send(`Could not find a choreTemplate with id=${req.params.id}`);
    }
    
    //Get the requested choreTemplate
    res.send(_.pick(choreTemplate, ['_id', 'name', 'imageUrl', 'details', 'creatorId', 'createdDate', 'updatedDate']));
});

router.post('/', auth, async function (req, res) {
    logger.debug('POST / - Invoked');
    //Validate requested  details
    const result = validateChoreTemplate(req.body);
    if(result.error){
        logger.error(`EXCEPTION - ${result.error}`);
        return res.status(400).send(result.error.message);
    }

    const choreTemplateCount = await ChoreTemplate.find({name: req.body.name, creatorId: req.body.creatorId}).countDocuments()
    if(choreTemplateCount > 0){
        logger.info('A chore template with this name already exists for this user');
        return res.status(204).send('A chore template with this name already exists for this user');
    }
    
    const creatorUser = await User.findById(req.body.creatorId);
    if(!creatorUser){
        logger.error(`Could not find a user with id=${req.body.id}`);
        return res.status(404).send(`Could not find a user with id=${req.body.id}`);
    }

    //Create a new choreTemplate
    let choreTemplate = new ChoreTemplate({
        name: req.body.name,
        details: req.body.details,
        creatorId: req.body.creatorId,
        state: 'enabled',
        createdDate: new Date()
    });

    choreTemplate = await choreTemplate.save();
    res.send(_.pick(choreTemplate, ['_id', 'name', 'imageUrl', 'details', 'creatorId', 'createdDate', 'updatedDate']));
});

router.put('/:id/enable', auth, async function (req, res) {
    logger.debug(`PUT /${req.params.id}/enable - Invoked`);
    let choreTemplate = await ChoreTemplate.findById(req.params.id);
    if(!choreTemplate){
        logger.error(`Could not find a choreTemplate with id=${req.params.id}`);
        return res.status(404).send(`Could not find a choreTemplate with id=${req.params.id}`);
    }

    //Update requested choreTemplate
    choreTemplate.state = 'enabled';
    choreTemplate.updatedDate = new Date();
    choreTemplate = await choreTemplate.save();

    //Send the updated choreTemplate
    res.send(_.pick(choreTemplate, ['_id', 'name', 'imageUrl', 'details', 'creatorId', 'createdDate', 'updatedDate']));
});

router.put('/:id/disable', auth, async function (req, res) {
    logger.debug(`PUT /${req.params.id}/disable - Invoked`);
    let choreTemplate = await ChoreTemplate.findById(req.params.id);
    if(!choreTemplate){
        logger.error(`Could not find a choreTemplate with id=${req.params.id}`);
        return res.status(404).send(`Could not find a choreTemplate with id=${req.params.id}`);
    }

    //Update requested choreTemplate
    choreTemplate.state = 'disabled';
    choreTemplate.updatedDate = new Date();
    choreTemplate = await choreTemplate.save();

    //Send the updated choreTemplate
    res.send(_.pick(choreTemplate, ['_id', 'name', 'imageUrl', 'details', 'creatorId', 'createdDate', 'updatedDate']));
});

router.delete('/:id', auth, async function (req, res) {
    logger.debug(`DEL /${req.params.id} - Invoked`);
    //Find and delete requested choreTemplate
    const choreTemplate = await ChoreTemplate.findByIdAndRemove(req.params.id);
    if(!choreTemplate){
        logger.error(`Could not find a choreTemplate with id=${req.params.id}`);
        return res.status(404).send(`Could not find a choreTemplate with id=${req.params.id}`);
    }
    
    //Send the deleted choreTemplate
    res.send(_.pick(choreTemplate, ['_id', 'name', 'imageUrl', 'details', 'creatorId', 'createdDate', 'updatedDate']));
});

module.exports = router;