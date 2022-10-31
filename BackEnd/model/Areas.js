const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const areaSchema = new Schema({
    user_id: mongoose.SchemaTypes.ObjectId,
    action_id: [mongoose.SchemaTypes.ObjectId],
    reaction_id: [mongoose.SchemaTypes.ObjectId],
    actif: Boolean
});

module.exports = mongoose.model('Areas', areaSchema);