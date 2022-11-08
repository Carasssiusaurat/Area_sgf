const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { protect } = require('../middleware/authMiddleware');
const areaController =  require('../controllers/areaController');

router.post('/area', protect, areaController.newArea)
router.get('/area/Act', protect, areaController.getAreaAct)
router.get('/area/React', protect, areaController.getAreaReact)
router.get('/area', protect, areaController.getArea)
router.get('/area', protect, areaController.getAllArea)
router.delete('/area', protect, areaController.deleteArea)
router.patch('/area', protect, areaController.updateArea)
router.patch('/area/state', protect, areaController.updateAreaState)

module.exports = router;