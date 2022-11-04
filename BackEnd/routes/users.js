const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const userController = require('../controllers/userController');
const serviceController = require('../controllers/serviceController');
const actionController =  require('../controllers/actionController')
const reactionController =  require('../controllers/reactionController')
const areaController =  require('../controllers/areaController')
const { newService, getService, getAllService, deleteService, updateService} = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');

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

//(put past this point into own files:
router.post('/service', protect, newService)
router.get('/services', protect, getAllService)
router.get('/service', protect, getService)
router.delete('/service', protect, deleteService)
router.patch('/service', protect, updateService)


router.post('/action', protect, actionController.newAction)
router.get('/action', protect, actionController.getAction)
router.delete('/action', protect, actionController.deleteAction)
router.patch('/action', protect, actionController.updateAction)

router.post('/reaction', protect, reactionController.newReaction)
router.get('/reaction', protect, reactionController.getReaction)
router.delete('/reaction', protect, reactionController.deleteReaction)
router.patch('/reaction', protect, reactionController.updateReaction)

router.post('/area', protect, areaController.newArea)
router.get('/area/Act', protect, areaController.getAreaAct)
router.get('/area/React', protect, areaController.getAreaReact)
router.get('/area', protect, areaController.getArea)
router.get('/area', protect, areaController.getAllArea)
router.delete('/area', protect, areaController.deleteArea)
router.patch('/area', protect, areaController.updateArea)
router.patch('/area/state', protect, areaController.updateAreaState)


module.exports = router;