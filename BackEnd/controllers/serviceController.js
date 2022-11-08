const { isValidObjectId } = require('mongoose');
const Services = require('../model/Services');

const newservice = (req, res) => {
    const base_action_id = req.body.action_id.split(',');
    const base_reaction_id = req.body.react_id.split(',');
    const logo = req.body.logo_url;
    const connection = req.body.connection_url;
    const service_name = req.body.service_name;

    if(!base_action_id || !base_reaction_id || !service_name) {
        return res.status(400).send('missing field : cannot add service')
    }
    const action_id = [...new Set(base_action_id)];
    const reaction_id = [...new Set(base_reaction_id)];

    Services.findOne({name: service_name}, (err, data) => {
        if (!data) {
        const new_service = new Services({
            action_id: action_id,
            reaction_id: reaction_id,
            name: service_name,
            img_url: logo,
            connection_url: connection
        });
        new_service.save((err, data) => {
            if (err)
                return res.json({Error: err});
            res.status(201)
            return res.json(data);
        });
        }
        else {
            //if err findone?
            res.status(409)
            res.send("service already exists")
        }
    })
}

const getAllservice = (req, res) => {
    Services.find({}, (err, data) => {
        if (err)
            return res.json({Error: err});
        return res.json(data);
    });
}

const getservice = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).send("get service error: incomplete or erroneous request")
    }
    // console.log(req.params.id)
    const servicebyid = await Services.findOne({_id: req.params.id});
    // console.log(servicebyid)
    if (!servicebyid) {
        // const servicebyname = await Services.findOne({name: req.params.id});
        // if (!servicebyname)
            return res.status(404).send("get service error: service not found")
        // return res.json(servicebyname);
    }
    return res.json(servicebyid);
}

const delAllservice = (req, res) => {
    Services.deleteMany({})
}

//delete service by name or by id
const delOneservice = async (req, res) => {
    if (!req.params.id)
        return res.status(400).send("del service error: incomplete or erroneous request")
    const servicetoremove = isValidObjectId(req.params.id) ? await Services.findByIdAndDelete(req.params.id) : await Services.findOneAndDelete({name: req.params.id});
    if (!servicetoremove)
        return res.status(404).send("del service error: service not found")
    servicetoremove.remove();
    return res.json(servicetoremove);
}

const updateservice = (req, res) => {
    const base_action_id = req.body.action_id.split(',');
    const base_reaction_id = req.body.reaction_id.split(',');
    const service_name = req.params.id;

    if (!base_action_id || !base_reaction_id || !service_name) {
        return res.status(400).send('missing field : cannot update service')
    }
    const action_id = [...new Set(base_action_id)];
    const reaction_id = [...new Set(base_reaction_id)];
    Services.updateOne({_id: service_name}, {$set: {"action_id": action_id, "reaction_id": reaction_id}}, (err, data) => {
        if (err) {
            return res.status(400).json({Error: err});}
        return res.json(data);
    });
}

const getActions = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).send('missing field : cannot get service actions')
    }
    const service = await Services.findOne({_id: req.params.id});
    if (!service) {
        return res.status(404).send('service not found')
    }
    return res.json(service.action_id);
};

const getReactions = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).send('missing field : cannot get service reactions')
    }
    const service = await Services.findOne({_id: req.params.id});
    if (!service) {
        return res.status(404).send('service not found')
    }
    return res.json(service.reaction_id);
};

module.exports = {
    updateservice,
    newservice,
    getAllservice,
    delAllservice,
    getservice,
    delOneservice,
    getActions,
    getReactions
}