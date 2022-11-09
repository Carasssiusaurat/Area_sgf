const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const actionController =  require('../controllers/actionController');

router.post('/action', admin, actionController.newAction)
router.get('/action/:id', protect, actionController.getAction)
router.get('/action', protect, actionController.getAllAction)
router.delete('/action/:id', admin, actionController.deleteAction)
router.delete('/action', admin, actionController.deleteAllAction)
router.put('/action/:id', admin, actionController.updateAction)

module.exports = router;