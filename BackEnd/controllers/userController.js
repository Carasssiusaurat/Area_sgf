const Users = require('../model/Users');
const express = require('express');
const routes = express.Router();
const bcrypt = require('bcryptjs');

const newuser = (req, res) => {
    Users.findOne({username: req.body.username}, (err, data) => {
        if (!data) {
            if (req.body.username == null || req.body.password == null)
            res.status(500).json({'message': 'internal server error'});
            bcrypt.hash(req.body.password, 10, function(err, crypted) {
                const new_user = new Users({
                    username: req.body.username,
                    password: crypted,
                    service: []
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
        return res.json(data);
    });
}

const moduser = (req, res) => {
    res.json({message: "GET user with id"});
}

const delAlluser = (req, res) => {
    res.json({message: "GET user with id"});
}

const delOneuser = (req, res) => {
    res.json({message: "GET user with id"});
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

module.exports = {
    newuser,
    getuser,
    getusers,
    moduser,
    login,
    delAlluser,
    delOneuser,
};