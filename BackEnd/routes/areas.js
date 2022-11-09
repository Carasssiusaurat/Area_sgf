const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const areaController =  require('../controllers/areaController');

router.post('/area', protect, areaController.newArea)
router.get('/area', admin, areaController.getAllArea)
router.delete('/area', admin, areaController.delAllArea)
router.put('/area/:id', protect, areaController.updateArea)
router.get('/area/:id', protect, areaController.getArea)
router.delete('/area/:id', protect, areaController.delOneArea)
router.put('/area/:id/state', protect, areaController.updateAreaState)
router.get('/area/:id/action', protect, areaController.getAreaAct)
router.get('/area/:id/reaction', protect, areaController.getAreaReact)

module.exports = router;