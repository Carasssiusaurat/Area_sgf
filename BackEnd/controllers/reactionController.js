const Reaction = require('../model/Reactions');

const newReaction = (req, res) => {
    if (req.body.args) {
        const arguments = req.body.args
        const new_reaction = new Reaction({
            args: arguments
        });
        new_reaction.save((err, data) => {
            if (err) {
                return res.json({Error: err})
            };
            return res.json(data);
        });
    };
}

const getReaction = (req, res) => {
    if (!req.body.id) {
        res.status(400)
        return res.send("get Reaction error: incomplete or erroneous request")
    }

    Reaction.findOne({_id: req.body.id}, (err, data) => {
        if (err)
            return res.json({Error: err});
        if (!data) {
            res.status(404)
            return res.send("Reaction not found")}
        return res.json(data);
    });
}

const deleteReaction = (req, res) => {
    if (!req.body.id) {
        res.status(400)
        return res.send("del Reaction error: incomplete or erroneous request")
    }
    Reaction.deleteOne({_id :req.body.id}, (err, data) => {
        if (err) {
            return res.json({Error: err});
        }
        res.status(200)
        return res.json(data);
    });
}

const updateReaction = (req, res) => {
    const arguments = req.body.arguments;

    if (!req.body.id || !arguments) {
        res.status(400)
        throw new Error('missing field : cannot update Reaction')
    }
    Reaction.updateOne({_id:req.body.id}, {$set: {"args": arguments}}, (err, data) => {
        if (err) {
            res.status(400)
            return res.json({Error: err});}
        return res.json(data);
    });
}

module.exports = {
    newReaction,
    getReaction,//from ID
    //getAllAction,//from AREA! not here! make more sense that way
    deleteReaction,
    updateReaction
}