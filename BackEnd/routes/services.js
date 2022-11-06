const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { protect, admin } = require('../middleware/authMiddleware');

const serviceController = require('../controllers/serviceController');

router.get('/service', protect, serviceController.getAllservice)

router.post('/service', admin, upload.none(), serviceController.newservice)

router.delete('/service', admin, serviceController.delAllservice)

router.get('/service/:name', protect, serviceController.getservice)

router.get('service/:id', protect, serviceController.getservicebyid)

router.put('/service/:name', admin, serviceController.updateservice)

router.put('/service/:id', admin, serviceController.updateservicebyid)

router.delete('/service/:name', admin, serviceController.delOneservice)

router.delete('/service/:id', admin, serviceController.delOneservicebyid)

// router.post('/service/:id/action', serviceController.addaction)

// router.post('/service/:id/reaction', serviceController.addreaction)

module.exports = router;