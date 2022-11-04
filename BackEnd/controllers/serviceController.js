const Service = require('../model/Services');

const newservice = (req, res) => {
    const base_action_id = req.body.action_id.split(',');
    const base_reaction_id = req.body.react_id.split(',');
    const servName = req.body.servName;


    if(!base_action_id || !base_reaction_id || !servName) {
        res.status(400)
        throw new Error('missing field : cannot add service')
    }
    const action_id = [...new Set(base_action_id)];
    const reaction_id = [...new Set(base_reaction_id)];

    Service.findOne({name: servName}, (err, data) => {
        if (!data) {
        const new_service = new Service({
            action_id: action_id,
            reaction_id: reaction_id,
            name: servName
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

const getservices = (req, res) => {
    Services.find({}, (err, data) => {
        if (err)
            return res.json({Error: err});
        return res.json(data);
    });
}

const getservice = (req, res) => {
    if (!req.body.name) {
        res.status(400)
        return res.send("get service error: incomplete or erroneous request")
    }

    Service.findOne({name:req.body.name}, (err, data) => {
        if (err)
            return res.json({Error: err});
        if (!data) {
            res.status(404)
            return res.send("service not found")}
        return res.json(data);
    });
}

const delAllservice = (req, res) => {
    Services.deleteMany({}, (err, data) => {
        if (err)
            return res.json({Error: err});
        return res.json(data);
    });
}

const delOneservice = (req, res) => {
    if (!req.body.name) {
        res.status(400)
        return res.send("del service error: incomplete or erroneous request")
    }
    Service.deleteOne({name:req.body.name}, (err, data) => {
        if (err) {
            return res.json({Error: err});
        }
        res.status(200)
        return res.json(data);
    });
}

const updateservice = (req, res) => {
    const base_action_id = req.body.action_id.split(',');
    const base_reaction_id = req.body.react_id.split(',');
    const servName = req.body.servName;

    if (!base_action_id || !base_reaction_id || !servName) {
        res.status(400)
        throw new Error('missing field : cannot update service')
    }
    const action_id = [...new Set(base_action_id)];
    const reaction_id = [...new Set(base_reaction_id)];
    Service.updateOne({name:servName}, {$set: {"action_id": action_id, "reaction_id": reaction_id}}, (err, data) => {
        if (err) {
            res.status(400)
            return res.json({Error: err});}
        return res.json(data);
    });
}

module.exports = {
    updateservice,
    newservice,
    getservices,
    delAllservice,
    getservice,
    delOneservice,
}