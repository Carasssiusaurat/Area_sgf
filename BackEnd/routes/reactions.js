const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { protect } = require('../middleware/authMiddleware');
const reactionController =  require('../controllers/reactionController');

router.post('/reaction', protect, reactionController.newReaction)
router.get('/reaction', protect, reactionController.getReaction)
router.delete('/reaction', protect, reactionController.deleteReaction)
router.patch('/reaction', protect, reactionController.updateReaction)

module.exports = router;