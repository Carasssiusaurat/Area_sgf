const Areas = require('../model/Areas');

const newArea = (req, res) => {
    const base_action_id = req.body.action_id.split(',');
    const base_reaction_id = req.body.react_id.split(',');
    if (base_action_id && base_reaction_id && req.body.id) {
        const act_id = [...new Set(base_action_id)];
        const react_id = [...new Set(base_reaction_id)];

        const new_area = new Areas({
            user_id: req.body.id,
            action_id: act_id,
            reaction_id: react_id,
            actif: True
        });
        new_area.save((err, data) => {
            if (err) {
                return res.json({Error: err})
            };
            return res.json(data);
        });
    };
    res.status(400)
    return res.send("could not create area: field missing")
}

const getArea = (req, res) => {
    if (!req.body.id) {
        res.status(400)
        return res.send("get Area error: incomplete or erroneous request")
    }

    Areas.findOne({_id:req.body.id}, (err, data) => {
        if (err)
            return res.json({Error: err});
        if (!data) {
            res.status(404)
            return res.send("Area not found")}
        return res.json(data);
    });
}

const getAreaAct = (req, res) => {
    if (!req.body.id) {
        res.status(400)
        return res.send("get Area error: incomplete or erroneous request")
    }

    Areas.findOne({_id:req.body.id}, {"action_id": 1}, (err, data) => {
        if (err)
            return res.json({Error: err});
        if (!data) {
            res.status(404)
            return res.send("Area not found")}
        return res.json(data);
    });
}

const getAreaReact = (req, res) => {
    if (!req.body.id) {
        res.status(400)
        return res.send("get Area error: incomplete or erroneous request")
    }

    Areas.findOne({_id:req.body.id}, {"reaction_id": 1}, (err, data) => {
        if (err)
            return res.json({Error: err});
        if (!data) {
            res.status(404)
            return res.send("Area not found")}
        return res.json(data);
    });
}

const getAllArea = (req, res) => {
    if (!req.body.id) {
        res.status(400)
        return res.send("get Area error: incomplete or erroneous request")
    }

    Areas.find({_id:req.body.id}, (err, data) => {
        if (err)
            return res.json({Error: err});
        if (!data) {
            res.status(404)
            return res.send("no Area found for user")}
        return res.json(data);
    });
}

const updateArea = (req, res) => {
    const base_action_id = req.body.action_id.split(',');
    const base_reaction_id = req.body.react_id.split(',');
    //const actif = req.body.actif;//no idea if should update that here too?

    if (!req.body.id || !base_action_id || !base_reaction_id) {
        res.status(400)
        throw new Error('missing field : cannot update area')
    }
    const action_id = [...new Set(base_action_id)];
    const reaction_id = [...new Set(base_reaction_id)];
    Areas.updateOne({_id: req.body.id}, {$set: {"action_id": action_id, "reaction_id": reaction_id}}, (err, data) => {
        if (err) {
            res.status(400)
            return res.json({Error: err});}
        return res.json(data);
    });
}

const updateAreaState = (req, res) => {
    if (!req.body.id || !req.body.state) {
        res.status(400)
        throw new Error('missing field : cannot update area')
    }
    Areas.updateOne({_id: req.body.id}, {$set: {"actif": req.body.state}}, (err, data) => {
        if (err) {
            res.status(400)
            return res.json({Error: err});}
        return res.json(data);
    });
}

const deleteArea = (req, res) => {
    if (!req.body.id) {
        res.status(400)
        return res.send("del Area error: incomplete or erroneous request")
    }
    Areas.deleteOne({_id:req.body.id}, (err, data) => {
        if (err) {
            return res.json({Error: err});
        }
        res.status(200)
        return res.json(data);
    });
}

module.exports = {
    newArea,
    getArea,
    getAreaAct,
    getAreaReact,
    getAllArea,
    deleteArea,
    updateArea,
    updateAreaState,
}