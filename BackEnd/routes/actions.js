const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { protect } = require('../middleware/authMiddleware');
const actionController =  require('../controllers/actionController');

router.post('/action', protect, actionController.newAction)
router.get('/action', protect, actionController.getAction)
router.get('/actions', protect, actionController.getAllAction)
router.delete('/action', protect, actionController.deleteAction)
router.patch('/action', protect, actionController.updateAction)

module.exports = router;