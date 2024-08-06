// models/Poll.js
const mongoose = require('mongoose');

const PollSchema = new mongoose.Schema({
    title: { type: String, required: true },
    options: [{ text: String, votes: { type: Number, default: 0 } }],
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Poll', PollSchema);
