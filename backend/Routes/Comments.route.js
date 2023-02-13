const express = require("express");
const router = express.Router();
const multer = require("../Middleware/multer");

const auth = require("../Middleware/auth");
const comCtrl = require("../Controllers/Com.ctrl");

// Coms
router.post("/", auth, comCtrl.createComment);
router.get("/:id", auth, comCtrl.getPostComments);
router.delete("/:id", auth, comCtrl.deleteComment);

module.exports = router;
