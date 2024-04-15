const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const axios = require("axios");

let users = [];

const authenticatedUser = (username, password) => {
  const user = users.find(user => user.username === username && user.password === password);
  return user !== undefined;
}

//login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign(
          {
              data: password,
          },
          "access",
          { expiresIn: 60 * 60 }
      );

      req.session.authorization = {
          accessToken,
          username,
      };

      return res.status(200).send("User successfully logged in");
  } else {
      return res
          .status(208)
          .json({ message: "Invalid Login. Check username and password" });
  }

});
// Add 
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review; 
  if (review) {
      if (!books[isbn]) {
          books[isbn] = {};
      }
      books[isbn].reviews = review;//save/writing reviews
      res.send("Review added for isbn " + isbn );
  } 
});

// Delete 
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if (isbn) {
      if (!books[isbn]) {
          books[isbn] = {};
      }
      books[isbn].reviews = ""; 
      res.send("Review DELETED for isbn " + isbn );
  } else {
      res.status(400).send("ISBN is required.");
  }
})

module.exports.authenticated = regd_users;
module.exports.users = users;