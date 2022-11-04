const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const serviceController = require('../controllers/serviceController');

router.get('/service', serviceController.getservices)

router.post('/service', upload.none(), serviceController.newservice)

router.delete('/service', serviceController.delAllservice)

router.get('/service/:id', serviceController.getservice)

router.put('/service/:id', serviceController.updateservice)

router.delete('/service/:id', serviceController.delOneservice)

// router.post('/service/:id/action', serviceController.addaction)

// router.post('/service/:id/reaction', serviceController.addreaction)

module.exports = router;