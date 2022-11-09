const IP = require('ip');
const Services = require('../model/Services');
const Actions = require('../model/Actions')
const Reactions = require('../model/Reactions')

const getAboutJson = async (req, res) => {
    const host = IP.address();
    const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress);
    console.log(host)
    console.log(ip)
    const current_time = new Date().getTime();
    const services_not_filtered = await Services.find();
    const services = services_not_filtered.map(function(service) {
        return {
            name: service.name,
            actions: service.action_id,
            reactions: service.reaction_id
        }
    });
    res.json({
        "Clients": {"host": ip},
        "Server": {"current_time": current_time, services}
    });
};

module.exports = { getAboutJson };