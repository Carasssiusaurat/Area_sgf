const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reactionSchema = new Schema({
    name: String,
    descritpion: String,
    args: [String]
});

module.exports = mongoose.model('Reactions', reactionSchema);