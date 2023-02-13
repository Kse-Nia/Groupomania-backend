require("dotenv").config();
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
secretToken = process.env.TOKEN_SECRET;
const fs = require("fs");
const db = require("../models");

exports.register = async (req, res) => {
  const { firstName, lastName, email, password, controlPassword } = req.body;
  const fields = [firstName, lastName, email, password, controlPassword];

  if (fields.some((field) => !field)) {
    return res.status(403).send("Veillez remplir toutes les données");
  }
  const regex = "^[A-Za-z0-9+_.-]+@(.+)$"; // Email regex, respecter le format
  if (!email.match(regex)) {
    return res
      .status(403)
      .send("Le format de l'adresse email n'est pas valide");
  } else if (password !== controlPassword) {
    return res.status(403).send("Les mots de passe ne sont pas identiques");
  } else {
    let avatar = `${req.protocol}://${req.get(
      "host"
    )}/images/defaultPicture.png`;

    try {
      const hash = await bcrypt.hash(password, 10);
      const newUser = await db.User.create({
        firstName,
        lastName,
        email,
        password: hash,
        avatar,
      });
      const token = jwt.sign({ userId: newUser.id }, secretToken);
      res.status(201).send({
        user: newUser,
        token,
      });
    } catch (error) {
      res.status(500).send({ error });
    }
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(403).send("Veillez remplir tous les champs");
  }

  const regex = "^[A-Za-z0-9+_.-]+@(.+)$"; // Vérification format email
  if (!email.match(regex)) {
    return res.status(403).send("Email invalide");
  }
  try {
    const user = await db.User.findOne({
      where: {
        email,
      },
    });
    if (!user) return res.status(403).send("Utilisateur introuvable");
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(403).send("Mot de passe incorrecte");
    res.status(200).send({
      userId: user.id,
      token: jwt.sign({ userId: user.id }, secretToken),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
      isAdmin: user.isAdmin,
      isAuthenticated: true,
    });
  } catch (error) {
    res.status(500).send({ error });
  }
};

exports.deleteUserAccount = (req, res, next) => {
  db.User.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then(() => res.status(200).json({ message: "Compte supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
};
