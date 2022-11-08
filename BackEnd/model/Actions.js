const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const actionSchema = new Schema({
    name: String,
    descritpion: String,
    args: [String]
});

module.exports = mongoose.model('Actions', actionSchema);