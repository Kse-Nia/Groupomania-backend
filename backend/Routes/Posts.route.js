const express = require("express");
const router = express.Router();
const multer = require("../middleware/multer");

const auth = require("../middleware/auth");
const postCtrl = require("../controllers/Post.ctrl");

router.post("/create", auth, multer, postCtrl.createPost); // Créer un nouveau post
router.get("/posts", auth, postCtrl.getAllPosts); // Récupérer tous les posts
router.delete("/:id", auth, postCtrl.deletePost); // Supprimer un post
router.put("/:id", auth, multer, postCtrl.updatePost); // Modifier un post
router.post("/like/:id", auth, postCtrl.likePost); // Ajouter like
router.post("/dislike/:id", auth, postCtrl.unlikePost); // Ajouter dislike
router.get("/alllikes/:id", auth, postCtrl.getPostLikes);
module.exports = router;
