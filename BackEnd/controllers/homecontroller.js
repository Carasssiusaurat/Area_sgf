const express = require('express');
const routes = express.Router();
const Users = require('../model/Users');

routes.route('/')
    .get(function(req, res) {
        res.status(404).json({ "message": "tradasse" })
        // Users.find(function(err, users) {
        //     if (err) {
        //         res.status(404).send(err);
        //     }
        //     res.status(200).send(users);
        // })
    })
    .post(function(req, res) {
        const user = new Users();
        user.username = req.body.username;
        user.password = req.body.password;
        user.save(function(err) {
            if (err) {
                res.send(err);
            }
            res.send({message: 'User created'});
        });
    });

module.exports = routes