require("dotenv").config();
secretTokenKey = process.env.TOKEN_SECRET;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const db = require("../models");
const User = db.User;

exports.getAllUsers = (req, res) => {
  User.findAll({
    order: [["firstName", "ASC"]],
  })
    .then((users) => {
      let result = [];
      for (i in users) {
        let id = users[i].id;
        let firstName = users[i].firstName;
        let lastName = users[i].lastName;
        let email = users[i].email;
        let avatar = users[i].avatar;
        let createdAt = users[i].createdAt;
        result.push({
          id,
          firstName,
          lastName,
          email,
          avatar,
          createdAt,
        });
      }
      res.status(200).json(result);
    })
    .catch((error) =>
      res.status(500).send({
        error,
      })
    );
};

exports.getOneUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id,
      },
    });
    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      err: "Une erreur est survenue",
    });
  }
};

// Delete User
exports.deleteOneUser = (req, res, next) => {
  User.findOne({ where: { id: req.params.id } })
    .then((message) => {
      User.destroy({ where: { id: req.params.id } })
        .then(() => res.status(200).json({ message: "Compte supprimé" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (req.file) {
      avatar = `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`;
    } else {
      avatar = user.avatar;
    }
    await User.update(
      {
        avatar: avatar,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
      },
      { where: { id: req.params.id } }
    );
    res.status(200).send({
      userId: user.id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      avatar: avatar,
      isAdmin: user.isAdmin,
      isAuthenticated: true,
      token: jwt.sign({ userId: user.id }, secretTokenKey),
    });
  } catch (error) {
    res.status(500).send({ error });
  }
};
