const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { protect, admin } = require('../middleware/authMiddleware');
const areaController =  require('../controllers/areaController');

router.post('/area', protect, areaController.newArea)
router.get('/area/:id/Act', protect, areaController.getAreaAct)
router.get('/area/:id/React', protect, areaController.getAreaReact)
router.get('/area/:id', protect, areaController.getArea)
router.get('/area', admin, areaController.getAllArea)
router.delete('/area/:id', protect, areaController.delArea)
router.delete('/area', admin, areaController.delAllArea)
router.put('/area/:id', protect, areaController.updateArea)
router.put('/area/:id/state', protect, areaController.updateAreaState)

module.exports = router;