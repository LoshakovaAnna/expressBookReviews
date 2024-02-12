const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const secretWord = 'some-secret';
const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  return !!users.find((user) => {
    return (user.username === username && user.password === password)
  });
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let {username, password} = req.body;
  if (!username || !password) {
    return res.status(404).json({message: "Error logging in! Please send correct username & password. "});
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, secretWord, {expiresIn: 60 * 60});

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const review = req.query['review'];
  const isbn = req.params['isbn'];
  if (!isbn || !books[isbn]) {
    return res.status(404).json({message: "Not found."});
  }
  books[isbn].reviews[req.session.authorization['username']] = review;
  return res.status(200).send(books[isbn]);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params['isbn'];
  if (!isbn || !books[isbn]) {
    return res.status(404).json({message: "Book not found."});
  }
  const username = req.session.authorization['username'];
  if (books[isbn]?.reviews[username]) {
    delete books[isbn].reviews[username]
    return res.status(200).send(`Review by ${username} successfully deleted`);
  }
  return res.status(404).json({message: "Review not found."});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.secretWord = secretWord;
