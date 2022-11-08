const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const serviceController = require("../controllers/serviceController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/service", protect, serviceController.getservices);

router.post("/service", admin, upload.none(), serviceController.newservice);

router.delete("/service", admin, serviceController.delAllservice);

router.get("/service/:id", protect, serviceController.getservicebyid);

router.get("/service/:name", protect, serviceController.getservice);

router.put("/service/:name", admin, serviceController.updateservice);

router.put("/service/:id", admin, serviceController.updateservicebyid);

router.delete("/service/:name", admin, serviceController.delOneservice);

router.delete("/service/:id", admin, serviceController.delOneservicebyid);

router.get('/service/:id/actions', protect, serviceController.getActions);

router.get('/service/:id/reactions', protect, serviceController.getReactions);

// router.post('/service/:id/action', serviceController.addaction)

// router.post('/service/:id/reaction', serviceController.addreaction)

module.exports = router;
