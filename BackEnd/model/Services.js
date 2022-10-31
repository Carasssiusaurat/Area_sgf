const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    name: String,
    action_id: [mongoose.SchemaTypes.ObjectId],
    reaction_id: [mongoose.SchemaTypes.ObjectId],
});

module.exports = {
    servicesModel: mongoose.model('Services', serviceSchema),
    serviceSchema
}