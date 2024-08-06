// routes/polls.js
const express = require('express');
const Poll = require('../models/Poll');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authenticate, async (req, res) => {
    try {
        const poll = new Poll({ ...req.body, creator: req.user.id });
        await poll.save();
        res.status(201).json(poll);
    } catch (error) {
        res.status(500).json({ error: 'Error creating poll' });
    }
});

router.get('/', async (req, res) => {
    try {
        const polls = await Poll.find();
        res.json(polls);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching polls' });
    }
});

router.post('/:id/vote', async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        const option = poll.options.id(req.body.optionId);
        if (option) {
            option.votes += 1;
            await poll.save();
            res.json(poll);
        } else {
            res.status(404).send('Option not found');
        }
    } catch (error) {
        res.status(500).json({ error: 'Error voting' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        if (!poll) {
            return res.status(404).json({ error: 'Poll not found' });
        }
        res.json(poll);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching poll' });
    }
});

router.delete('/:id', authenticate, async (req, res) => {
    try {
        const poll = await Poll.findByIdAndDelete(req.params.id);
        if (!poll) {
            return res.status(404).json({ error: 'Poll not found' });
        }
        res.status(204).send(); // No content
    } catch (error) {
        res.status(500).json({ error: 'Error deleting poll' });
    }
});

module.exports = router;
