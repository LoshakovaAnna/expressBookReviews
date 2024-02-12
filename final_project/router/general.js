const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    let {username, password} = req.body;
    if (!username || !password) {
        return res
            .status(404)
            .json({message: 'Unable to register user. Please enter correct username and password!'})
    }
    let user = users.find(el => el.username === username);
    if (user) {
        return res.status(404).json({message: "User already exists!"});
    }
    users.push({username, password});
    return res.status(200)
        .json({message: "User successfully registered. Now you can login"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    Promise.resolve(books).then(books => {
        res.status(200).send({books});
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    Promise.resolve(req?.params?.isbn)
        .then(isbn => {
            res.status(200).json(books[isbn] || {})
        });
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    let author = req?.params?.author;
    if (!author) {
        res.status(200).json(books);
    }

    let arr = [];
    for (const key in books) {
        if (Object.hasOwnProperty.call(books, key)) {
            const book = books[key];
            if (book.author === author) {
                arr.push(book);
            }
        }
    }

    return res.status(200)
        .json(arr);
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    let title = req?.params?.title;
    let arr = [];
    for (const key in books) {
        if (Object.hasOwnProperty.call(books, key)) {
            const book = books[key];
            if (book.title === title) {
                arr.push(book);
            }
        }
    }

    return res.status(200)
        .json(arr);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    let isbn = req?.params?.isbn;
    let book = books[isbn] || {};
    return res.status(200)
        .json(book.reviews || {});
});

module.exports.general = public_users;
