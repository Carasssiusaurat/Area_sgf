const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const userController = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

//admin
router.get('/user', admin, userController.getusers)
router.post('/user', upload.none(), userController.newuser)
//admin
router.delete('/user', admin, userController.delAlluser)
router.get('/user/:id', protect, userController.getuser)
router.put('/user/:id', protect, userController.moduser)
router.delete('/user/:id', protect, userController.delOneuser)
router.put('/user/:id/service', protect, userController.addservice)
router.put('/user/:uid/service/:sid', protect, upload.none(), userController.modservice)
router.put('/user/:uid/service/:sid/status', protect, userController.updatestate)
router.delete('/user/:uid/service/:sid', protect, userController.delOneservice)
router.delete('/user/:uid/service', protect, userController.delAllservice)
router.post('/login', userController.login)

module.exports = router;