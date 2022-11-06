const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const { protect } = require("../middleware/authMiddleware");

const serviceController = require("../controllers/serviceController");

router.get("/service", protect, serviceController.getservices);

router.post("/service", protect, upload.none(), serviceController.newservice);

router.delete("/service", protect, serviceController.delAllservice);

router.get("/service/:id", protect, serviceController.getservicebyid);

router.get("/service/:id/connect", protect, serviceController.connectservice);

router.get("/service/:name", protect, serviceController.getservice);

router.put("/service/:name", protect, serviceController.updateservice);

router.delete("/service/:name", protect, serviceController.delOneservice);

// router.post('/service/:id/action', serviceController.addaction)

// router.post('/service/:id/reaction', serviceController.addreaction)

module.exports = router;
