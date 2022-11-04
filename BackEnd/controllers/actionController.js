const Action = require('../model/Actions');

const newAction = (req, res) => {
    if (req.body.args) {
        const arguments = req.body.args
        const new_action = new Action({
            args: arguments
        });
        new_action.save((err, data) => {
            if (err)
                return res.json({Error: err})
            return res.json(data);
        });
    };
}

const getAction = (req, res) => {
    if (!req.body.id) {
        res.status(400)
        return res.send("get Action error: incomplete or erroneous request")
    }

    Action.findOne({_id:req.body.id}, (err, data) => {
        if (err)
            return res.json({Error: err});
        if (!data) {
            res.status(404)
            return res.send("Action not found")}
        return res.json(data);
    });
}

const getAllAction = (req, res) => {
    Action.find({}, (err, data) => {
        if (err)
            return res.json({Error: err});
        if (!data) {
            res.status(404)
            return res.send("Action not found")}
        return res.json(data);
    });
}

const deleteAction = (req, res) => {
    if (!req.body.id) {
        res.status(400)
        return res.send("del Action error: incomplete or erroneous request")
    }
    Action.deleteOne({_id:req.body.id}, (err, data) => {
        if (err) {
            return res.json({Error: err});
        }
        res.status(200)
        return res.json(data);
    });
}

const updateAction = (req, res) => {
    const arguments = req.body.arguments;

    if (!req.body.id || !arguments) {
        res.status(400)
        throw new Error('missing field : cannot update Action')
    }
    Action.updateOne({_id:req.body.id}, {$set: {"args": arguments}}, (err, data) => {
        if (err) {
            res.status(400)
            return res.json({Error: err});}
        return res.json(data);
    });
}


module.exports = {
    newAction,
    getAction,
    getAllAction,
    deleteAction,
    updateAction
}