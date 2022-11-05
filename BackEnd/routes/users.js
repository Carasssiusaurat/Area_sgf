const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const userController = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

//admin
router.get("/user", userController.getusers);

router.post("/user", upload.none(), userController.newuser);

//admin -> verif jwt -> verif que role == 'admin'
router.delete("/user", protect, userController.delAlluser);

router.get("/user/:id", protect, userController.getuser);

router.put("/user/:id", protect, userController.moduser);

router.delete("/user/:id", protect, userController.delOneuser);

router.put("/user/:id/service", protect, userController.addservice);

router.put("/user/:uid/service/:sid", protect, userController.modservice);

router.delete("/user/:uid/service/:sid", protect, userController.delOneservice);

router.delete("/user/:uid/service", protect, userController.delAllservice);

router.post("/login", userController.login);

module.exports = router;
