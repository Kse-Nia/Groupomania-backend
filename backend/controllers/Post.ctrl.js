require("dotenv").config();
const bcrypt = require("bcrypt");
const { text } = require("express");
const jwt = require("jsonwebtoken");
secretToken = process.env.TOKEN_SECRET;
const db = require("../models");
const { Op } = require("sequelize");
const Post = db.Post;
const User = db.User;
const Comment = db.Comment;
const Likes = db.Likes;

// Créer un nouveau Post
exports.createPost = (req, res, next) => {
  const postObject = req.body;
  const UserId = req.body.userId;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const avatar = req.body.avatar;

  if (req.file) {
    postObject.imageUrl = `${req.protocol}://${req.get("host")}/images/posts/${
      req.file.filename
    }`;
  }
  const post = new Post({
    ...postObject,
    userId: UserId,
    firstName: firstName,
    lastName: lastName,
    avatar: avatar,
  });
  post
    .save()
    .then(() => res.status(201).json({ message: "Post envoyé !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Récupération de tous les Posts
exports.getAllPosts = (req, res) => {
  Post.findAll({
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: User,
        attributes: ["firstName", "lastName", "avatar"],
      },
      {
        model: Comment,
        attributes: [
          "id",
          "PostId",
          "UserId",
          "text",
          "firstName",
          "lastName",
          "avatar",
          "createdAt",
        ],
      },
      {
        model: Likes,
        attributes: ["id", "PostId", "UserId", "createdAt"],
      },
    ],
  })
    .then((posts) => {
      res.status(200).send(posts);
    })
    .catch((error) =>
      res.status(500).send({
        error,
      })
    );
};

// Suppression Post
exports.deletePost = (req, res, next) => {
  Post.findOne({ where: { id: req.params.id } })
    .then((message) => {
      Post.destroy({ where: { id: req.params.id } })
        .then(() => res.status(200).json({ message: "Post supprimé" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Update

exports.updatePost = async (req, res) => {
  try {
    const post = Post.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(404).send({ message: "Post introuvable" });
    }
    const postObject = req.body;
    if (req.file) {
      postObject.imageUrl = `${req.protocol}://${req.get(
        "host"
      )}/images/posts/${req.file.filename}`;
    }
    await Post.update(
      { ...postObject, id: req.params.id },
      { where: { id: req.params.id } }
    );
    console.log("postObject", postObject);
    return res.status(200).send({ message: "Post modifié" });
  } catch (error) {
    console.log(error);
  }
};

// Like et Unlike
exports.likePost = async (req, res) => {
  const UserId = req.body.UserId;
  const PostId = req.body.PostId;

  try {
    const post = await Post.findByPk(PostId);
    if (!post) {
      return res.status(404).send({ message: "Post introuvable" });
    } else {
      let alreadyLiked = await Likes.findOne({
        where: {
          PostId: req.body.PostId,
          UserId: req.body.UserId,
        },
      });
      if (alreadyLiked) {
        return res.status(400).send({ message: "Post déjà liké" });
      }
      if (!alreadyLiked) {
        let newLike = await Likes.create({
          UserId: UserId,
          PostId: PostId,
        });
        return res.json(newLike);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

exports.unlikePost = async (req, res) => {
  const UserId = req.body.UserId;
  const PostId = req.body.PostId;

  try {
    const post = await Post.findByPk(PostId);
    if (!post) {
      return res.status(404).send({ message: "Post introuvable" });
    } else {
      let already = await Likes.findOne({
        where: {
          PostId: req.body.PostId,
          UserId: req.body.UserId,
        },
      });
      if (!already) {
        return res.status(400).send({ message: "Like déjà retiré" });
      }
      if (already) {
        let retiredLike = await Likes.destroy({
          where: {
            PostId: req.body.PostId,
            UserId: req.body.UserId,
          },
        });
        return res.json(retiredLike);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getPostLikes = async (req, res) => {
  const PostId = req.body.PostId;
  const likes = await Likes.findAll({
    where: { PostId: PostId },
  });
  res.json(likes);
};
