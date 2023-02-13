const express = require("express");
const router = express.Router();
const multer = require("../Middleware/multer");
const userMulter = require("../middleware/multer-user");

const authCtrl = require("../Controllers/auth.ctrl");
const userCtrl = require("../Controllers/Users.ctrl");
const auth = require("../Middleware/auth");

// Auth
router.post("/register", multer, authCtrl.register); // Register user
router.post("/login", authCtrl.login); // Login user
router.delete("/delete/:id", auth, authCtrl.deleteUserAccount); // Delete user account

// Users
router.get("/users", auth, userCtrl.getAllUsers); // Get all Users
router.get("/:id", auth, userCtrl.getOneUser); // Get User Profile
router.delete("/:id", auth, userCtrl.deleteOneUser); // Delete one User
router.put("/updateprofile/:id", auth, userMulter, userCtrl.updateProfile); // Update User Profile
module.exports = router;
