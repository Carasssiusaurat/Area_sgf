const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const actionController =  require('../controllers/actionController');

router.post('/action', protect, actionController.newAction)
router.get('/action/:id', protect, actionController.getAction)
router.get('/actions', admin, actionController.getAllAction)
router.delete('/action/:id', protect, actionController.deleteAction)
router.delete('/action', admin, actionController.deleteAllAction)
router.put('/action/:id', protect, actionController.updateAction)

module.exports = router;