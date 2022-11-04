const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const userController = require('../controllers/userController');

//admin
router.get('/user', userController.getusers)

router.post('/user', upload.none(), userController.newuser)

//admin -> verif jwt -> verif que role == 'admin'
router.delete('/user', userController.delAlluser)

router.get('/user/:id', userController.getuser)

router.put('/user/:id', userController.moduser)

router.delete('/user/:id', userController.delOneuser)

router.put('/user/:id/service', userController.addservice)

router.put('/user/:uid/service/:sid', userController.modservice)

router.delete('/user/:uid/service/:sid', userController.delOneservice)

router.delete('/user/:uid/service', userController.delAllservice)

router.post('/login', userController.login)

module.exports = router;