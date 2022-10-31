const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const actionSchema = new Schema({
    args: [String]
});

module.exports = mongoose.model('Actions', actionSchema);