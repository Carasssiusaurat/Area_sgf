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

router.put('/service/:name', protect, serviceController.updateservice)

router.delete('/service/:name', protect, serviceController.delOneservice)

// router.post('/service/:id/action', serviceController.addaction)

// router.post('/service/:id/reaction', serviceController.addreaction)

module.exports = router;