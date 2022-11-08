const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { protect, admin } = require('../middleware/authMiddleware');

const serviceController = require('../controllers/serviceController');

router.get('/service/:id', protect, serviceController.getservice)
router.get('/service', protect, serviceController.getAllservice)
// router.post('/service/:id/action', serviceController.addaction)
// router.post('/service/:id/reaction', serviceController.addreaction)
router.get('/service/:id/actions', protect, serviceController.getActions)
router.get('/service/:id/reactions', protect, serviceController.getReactions)
router.post('/service', admin, upload.none(), serviceController.newservice)
router.delete('/service/:id', admin, serviceController.delOneservice)
router.delete('/service', admin, serviceController.delAllservice)
router.put('/service/:id', admin, serviceController.updateservice)

module.exports = router;