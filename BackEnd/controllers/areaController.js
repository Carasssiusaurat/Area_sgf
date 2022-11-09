const Areas = require('../model/Areas');
const Actions = require('../model/Actions');
const Reactions = require('../model/Reactions');

const newArea = (req, res) => {
    // console.log(req.body)
    // return res.status(200).json({message: "Area created"});
    const base_action_id = req.body.action_id.split(',');
    const base_reaction_id = req.body.reaction_id.split(',');
    if (base_action_id && base_reaction_id && req.body.user_id) {
        const act_id = [...new Set(base_action_id)];
        const react_id = [...new Set(base_reaction_id)];

        const new_area = new Areas({
            user_id: req.body.user_id,
            action_id: act_id,
            reaction_id: react_id,
            actif: true
        });
        new_area.save();
        return res.status(200).json({message: "Area created"});
    }
    return res.status(400).send("could not create area: field missing")
}

const getArea = (req, res) => {
    if (!req.params.id) {
        res.status(400)
        return res.send("get Area error: incomplete or erroneous request")
    }
    Areas.findOne({_id:req.params.id}, (err, data) => {
        if (err)
            return res.json({Error: err});
        if (!data) {
            res.status(404)
            return res.send("Area not found")}
        return res.json(data);
    });
}

const getAllArea = (req, res) => {
    Areas.find({}, (err, data) => {
        if (err)
            return res.json({Error: err});
        if (!data) {
            res.status(404)
            return res.send("no Area found")}
        return res.json(data);
    });
}

const getAreaAct = async (req, res) => {
    if (!req.params.id)
        return res.status(400).send("get Area error: incomplete or erroneous request")
    const area = await Areas.findById(req.params.id);
    if (!area)
        return res.status(404).send("Area not found")
    console.log(area.action_id)
    const action = await Actions.find({"_id":area.action_id});
    if (!action)
        return res.status(404).send("Action not found")
    return res.status(200).json(action);
}

const getAreaReact = async (req, res) => {
    if (!req.params.id)
        return res.status(400).send("get Area error: incomplete or erroneous request")
    const area = await Areas.findById(req.params.id);
    if (!area)
        return res.status(404).send("Area not found")
    const reaction = await Reactions.findById(area.reaction_id);
    if (!reaction)
        return res.status(404).send("Reaction not found")
    return res.status(200).json(reaction);
}

const updateArea = (req, res) => {
    const base_action_id = req.body.action_id.split(',');
    const base_reaction_id = req.body.react_id.split(',');
    if (!req.params.id || !base_action_id || !base_reaction_id) {
        res.status(400)
        throw new Error('missing field : cannot update area')
    }
    const action_id = [...new Set(base_action_id)];
    const reaction_id = [...new Set(base_reaction_id)];
    Areas.updateOne({_id: req.params.id}, {$set: {"action_id": action_id, "reaction_id": reaction_id}}, (err, data) => {
        if (err) {
            res.status(400)
            return res.json({Error: err});}
        return res.json(data);
    });
}

const updateAreaState = async (req, res) => {
    if (!req.params.id)
        return res.status(400).send('area id missing')
    const area_to_update = await Areas.findOne({_id: req.params.id});
    try {
        if (area_to_update) {
            area_to_update.actif = !area_to_update.actif
            area_to_update.save();
            return res.status(200).json({message: "Area updated"});
        }
    } catch (err) {
        return res.status(500).json({ "error": 'internal error' });
    }
}

const delOneArea = (req, res) => {
    try {
        if (!req.params.id) {
            res.status(400)
            return res.send("del Area error: incomplete or erroneous request")
        }
        Areas.deleteOne({_id:req.params.id}, (err, data) => {
            if (err)
                return res.json({Error: err});
            res.status(200)
            return res.json(data);
        });
    } catch (err) {
        return res.status(500).send('internal error');
    }
}

const delAllArea = async (req, res) => {
    const area_deleted = await Areas.deleteMany({})
    if (area_deleted.deletedCount === 0)
        return res.status(404).send("no Area found")
    return res.status(200).json({message: "All Area deleted"});
}

module.exports = {
    newArea,
    getArea,
    getAreaAct,
    getAreaReact,
    getAllArea,
    delOneArea,
    delAllArea,
    updateArea,
    updateAreaState,
}