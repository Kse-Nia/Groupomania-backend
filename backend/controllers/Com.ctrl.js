require("dotenv").config();
const bcrypt = require("bcrypt");
const { text } = require("express");
const jwt = require("jsonwebtoken");
secretToken = process.env.TOKEN_SECRET;
const db = require("../models");
const Post = db.Post;
const User = db.User;
const Comment = db.Comment;

// Créer un nouveau commentaire
exports.createComment = async (req, res, next) => {
  if (!req.body) return res.status(403).send("Veillez saisir un texte");
  const UserId = req.body.UserId;
  const PostId = req.body.PostId;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const avatar = req.body.avatar;
  const text = req.body.text;

  const comment = new Comment({
    text: text,
    UserId: UserId,
    PostId: PostId,
    firstName: firstName,
    lastName: lastName,
    avatar: avatar,
  });
  comment
    .save()
    .then(() => res.status(201).json({ message: "Commentaire posté" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getPostComments = (req, res, next) => {
  Comment.findAll({ where: { PostId: req.params.id } })
    .then((comments) => {
      console.log(comments);
      res.status(200).json({ data: comments });
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteComment = (req, res, next) => {
  Comment.findOne({ where: { id: req.params.id } })
    .then((comment) => {
      Comment.destroy({ where: { id: req.params.id } })
        .then(() => res.status(200).json({ message: "Commentaire supprimé" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
