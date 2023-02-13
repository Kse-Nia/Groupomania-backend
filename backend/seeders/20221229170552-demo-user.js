const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  async up(queryInterface, Sequelize) {
    // hash the password
    const hashedPassword = await bcrypt.hash("password123", 10);
    // insert the user into the database
    const user = await queryInterface.bulkInsert(
      "Users",
      [
        {
          firstName: "Administrateur",
          lastName: "Groupomania",
          email: "admin@groupomania.fr",
          avatar: "http://localhost:8080/images/adminDefault.png",
          password: hashedPassword,
          isAdmin: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
    // generate JWT for the user
    const token = jwt.sign({ userId: user[0] }, "secret");
    console.log(token);
  },
  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("User", null, {});
  },
};
