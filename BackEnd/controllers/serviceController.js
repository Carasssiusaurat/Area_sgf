const Services = require('../model/Services');

const newservice = (req, res) => {
    Services.findOne({name: req.body.name}, (err, data) => {
        if (!data) {
            const new_service = new Services({
                name: req.body.name,
                action_id: [],
                reaction_id: []
            });
            new_service.save((err, data) => {
                if (err)
                    return res.json({Error: err});
                return res.json(data);
            });
        } else {
            if (err)
                return res.json(`Something went wrong, please try again.${err}`);
            return res.json({message: "service already exists"});
        }
    });
}

const getservices = (req, res) => {
    Services.find({}, (err, data) => {
        if (err)
            return res.json({Error: err});
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

const getservice = (req, res) => {
    Services.findOne({_id: req.params.id}, (err, data) => {
        if (err)
            return res.json({Error: err});
        if (!data)
            return res.json({message: "Service doesn't exist !"});
        return res.json(data);
    });
}

const modservice = async (req, res) => {
    try {
        const service_to_update = await Services.findOne({_id: req.params.id});
        service_to_update.name = req.body.name
        service_to_update.save();
        return res.status(200).json({message: "Service updated"});
    } catch (err) {
        console.log("modservice", err)
        return res.status(500).json({ "error": 'internal error' });
    }
}

const delOneservice = (req, res) => {
    Services.deleteOne({_id: req.params.id}, (err, data) => {
        if (err)
            return res.json({Error: err});
        return res.json(data);
    });
}

module.exports = {
    newservice,
    getservices,
    delAllservice,
    getservice,
    modservice,
    delOneservice,
}