const Users = require('../model/Users');
const bcrypt = require('bcryptjs');
const Services = require('../model/Services');

const newuser = (req, res) => {
    Users.findOne({username: req.body.username}, (err, data) => {
        if (!data) {
            if (req.body.username == null || req.body.password == null)
                return res.status(500).json({'message': 'internal server error'});
            bcrypt.hash(req.body.password, 10, function(err, crypted) {
                const new_user = new Users({
                    username: req.body.username,
                    password: crypted,
                    service: [],
                    role: req.body.username == 'admin' ? 'admin' : 'user'
                });
                new_user.save((err, data) => {
                    if (err)
                        return res.json({Error: err});
                    return res.json(data);
                });
            });
        } else {
            if (err)
                return res.json(`Something went wrong, please try again.${err}`);
            return res.json({message: "user already exists"});
        }
    });
}

const getusers = (req, res) => {
    Users.find({}, (err, data) => {
        if (err)
            return res.json({Error: err});
        return res.json(data);
    });
}

const getuser = (req, res) => {
    Users.findOne({_id: req.params.id}, (err, data) => {
        if (err)
            return res.json({Error: err});
        if (!data)
            return res.json({message: "User doesn't exist !"});
        return res.json(data);
    });
}

const moduser = async (req, res) => {
    try {
        const user_to_update = await Users.findOne({_id: req.params.id});
        user_to_update.username = req.body.username
        user_to_update.save();
        return res.status(200).json({message: "User updated"});
    } catch (err) {
        console.log("moduser", err)
        return res.status(500).json({ "error": 'internal error' });
    }
}

const delAlluser = (req, res) => {
    Users.deleteMany({}, err => {
        if (err)
            return res.json({message: "Complete delete failed"});
        return res.json({message: "Complete delete successful"});
    })
}

const delOneuser = (req, res) => {
    Users.deleteOne({_id: req.params.id}, (err, data) => {
        if (data.deleteCount == 0)
            return res.json({message: "User doesn't exist !"})
        else if (err)
            return res.json({message: "something went wrong !"});
        return res.json(data);
    });
}

const login = (req, res) => {
    Users.findOne({username: req.body.username}).then(user => {
        if (!user) {
            return res.status(401).json({message: 'username doesn\'t exist'});
        }
        bcrypt.compare(req.body.password, user.password).then(valid => {
            if (!valid) {
                return res.status(401).json({message: 'password incorrect'});
            }
            res.status(200).json({userId: user._id, token: 'TOKEN'});
        }).catch(err => res.statuts(500).json({err}));
    }).catch(err => res.status(500).json({err}));
}

// try {
//     const user_to_update = await Users.findOne({_id: req.params.id});
//     user_to_update.username = req.body.username
//     user_to_update.save();
//     return res.status(200).json({message: "User updated"});
// } catch (err) {
//     console.log("moduser", err)
//     return res.status(500).json({ "error": 'internal error' });
// }

const addservice = async (req, res) => {
    try {
        const user_to_update = await Users.findOne({_id: req.params.id});
            try {
                const service_to_add = Services.findOne({name: req.body.name}, (err, data) => {
                    if (err)
                        return res.json({Error: err});
                    if (!data)
                        return res.json({message: "Service doesn't exist !"});
                    user_to_update.services.push({_service_id: data._id, actif: true});
                    user_to_update.save();
                    return res.json(data);
                });
            } catch (err) {
                console.log("addservice", err)
                return res.status(500).json({ "error": 'internal error' });
            }
    } catch (err) {
        console.log("addservice", err)
        return res.status(500).json({ "error": 'internal error' });
    }
}

const modservice = (req, res) => {
    Users.findOne({_id: req.params.uid}, (err, data) => {
        if (err)
            return res.json({Error: err});
        if (!data)
            return res.json({message: "User doesn't exist !"});
        data.service[req.params.sid].actif = req.body.actif;
        data.save()
        return res.json(data);
    });
}

const delOneservice = (req, res) => {
    Users.findOne({_id: req.params.uid}, (err, data) => {
        if (err)
            return res.json({Error: err});
        if (!data)
            return res.json({message: "User doesn't exist !"});
        data.service.splice(req.params.sid, 1);
        data.save()
        return res.json(data);
    });
}

module.exports = {
    newuser,
    getuser,
    getusers,
    moduser,
    login,
    delAlluser,
    delOneuser,
    addservice,
    modservice,
    delOneservice
};