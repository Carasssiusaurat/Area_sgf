const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const reactionController =  require('../controllers/reactionController');

router.post('/reaction', protect, reactionController.newReaction)
router.get('/reaction/:id', protect, reactionController.getReaction)
router.get('/reactions', admin, reactionController.getAllReaction)
router.delete('/reaction/:id', protect, reactionController.deleteReaction)
router.delete('/reactions', admin, reactionController.deleteAllReaction)
router.put('/reaction/:id', protect, reactionController.updateReaction)

module.exports = router;