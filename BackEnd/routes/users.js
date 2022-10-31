const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const userController = require('../controllers/userController');

//admin
router.get('/user', userController.getusers)

router.post('/user', upload.none(), userController.newuser)

//admin
router.delete('/user', userController.delAlluser)

router.get('/user/:id', userController.getuser)

router.put('/user/:username', userController.moduser)

router.delete('/user/:username', userController.delOneuser)

router.post('/login', userController.login)

module.exports = router;