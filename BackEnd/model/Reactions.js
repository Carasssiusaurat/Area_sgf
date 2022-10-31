const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reactionSchema = new Schema({
    args: [String]
});

module.exports = mongoose.model('Reactions', reactionSchema);