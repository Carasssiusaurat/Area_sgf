const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { protect } = require('../middleware/authMiddleware');

const serviceController = require('../controllers/serviceController');

router.get('/service', protect, serviceController.getAllservice)

router.post('/service', protect, upload.none(), serviceController.newservice)

router.delete('/service', protect, serviceController.delAllservice)

router.get('/service/:name', protect, serviceController.getservice)

router.get('service/:id', protect, serviceController.getservicebyid)

router.put('/service/:name', protect, serviceController.updateservice)

router.put('/service/:id', protect, serviceController.updateservicebyid)

router.delete('/service/:name', protect, serviceController.delOneservice)

router.delete('/service/:id', protect, serviceController.delOneservicebyid)

// router.post('/service/:id/action', serviceController.addaction)

// router.post('/service/:id/reaction', serviceController.addreaction)

module.exports = router;