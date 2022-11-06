const Users = require('../model/Users');
const Services = require('../model/Services');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    })
}

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

const login = asyncHandler(async (req, res) => {
    Users.findOne({username: req.body.username}).then(user => {
        if (!user) {
            return res.status(401).json({message: 'username doesnt exist'});
        }
        bcrypt.compare(req.body.password, user.password).then(valid => {
            if (!valid) {
                return res.status(401).json({message: 'password incorrect'});
            }
            res.status(200).json({userId: user._id, token: generateToken(user._id)});

        }).catch(err => res.status(500).json({err}));
    }).catch(err => res.status(500).json({err}));
})

const addservice = async (req, res) => {
    const user_to_update = await Users.findOne({_id: req.params.id});
    const service_to_add = await Services.findOne({name: req.body.name});
    if (!user_to_update || !service_to_add)
        return res.status(404).json({Error: "not found"})
    try {
        if (user_to_update.services.some(service => service.id == service_to_add._id))
            return res.status(200).json({message: "Service already used"});
        user_to_update.services.push({_id: service_to_add._id, actif: true, token: 'TOKEN'});
        user_to_update.save();
        return res.status(200).json({message: "Service added"});
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

const delAllservice = async (req, res) => {
    try {
        const user_to_update = await Users.findOne({_id: req.params.uid});
        user_to_update.services = [];
        user_to_update.save();
        return res.status(200).json({message: "User updated"});
    } catch (err) {
        console.log("delAllservice", err)
    }
}

module.exports = {
    newuser,
    getuser,
    getusers,
    moduser,
    delAlluser,
    delOneuser,
    addservice,
    modservice,
    delOneservice,
    delAllservice
};