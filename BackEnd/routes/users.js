const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const userController = require('../controllers/userController');
const serviceController = require('../controllers/serviceController');
const { newService, getService, getAllService, deleteService, updateService} = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');

//admin
router.get('/user', userController.getusers)

router.post('/user', upload.none(), userController.newuser)

//admin
router.delete('/user', userController.delAlluser)

router.get('/user/:id', userController.getuser)

router.put('/user/:username', userController.moduser)

router.delete('/user/:username', userController.delOneuser)

router.post('/login', userController.login)

//(add a new service)
router.post('/service', protect, newService)
//router.post('/service', upload.none(), protect, serviceController.newService)

//should get one specific service? all?
router.get('/services', protect, getAllService)
//
router.get('/service', protect, getService)

router.delete('/service', protect, deleteService)

router.patch('/service', protect, updateService)

module.exports = router;