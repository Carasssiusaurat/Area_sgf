const IP = require('ip');
const Services = require('../model/Services');
const asyncHandler = require('express-async-handler');

const getAboutJson = asyncHandler(async (req, res) => {
    const host = IP.address();
    const current_time = new Date().getTime();
    const services_not_filtered = await Services.find();
    const services = services_not_filtered.map(function(service) {
        return {
            name: service.name,
            actions: service.action_id,
            reactions: service.reaction_id
        }
    });
    console.log(services);
    res.json({
        "Clients": {"host": host},
        "Server": {"current_time": current_time, services}
    });
});

module.exports = { getAboutJson };