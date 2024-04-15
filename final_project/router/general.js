const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

// register
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(400).json({ message: "Please provide both username and password" });
  }

  //username exists check
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(409).json({ message: "Username already exists. Please choose a different username" });
  }

 // Save data 
  const newUser = { username, password };
  users.push(newUser);
  res.status(200).json({ message: "User registered successfully", user: newUser });
});

//Getbook list
public_users.get('/books', function (req, res) {
  res.status(200).json(books);
});

//isbn 
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});


//add book review
public_users.post('/isbn/:isbn/reviews', function (req, res) {
  const isbn = req.params.isbn;
  const review = req.body.review; 

  const book = books[isbn];

  if (book) {
    if (!book.reviews) {
      book.reviews = [];
    }
    book.reviews.push(review);
    res.status(200).json({ message: "Review added successfully" });
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});


//delete
public_users.delete('/isbn/:isbn/reviews/:review', function (req, res) {
  const isbn = req.params.isbn;
  const review = req.params.review;
  
  const book = books[isbn];

  if (book) {
    if (book.reviews) {
      book.reviews = book.reviews.filter(r => r !== review);
      res.status(200).json({ message: "Review deleted successfully" });
    } else {
      res.status(404).json({ message: "Reviews not found for this book" });
    }
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

//author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const list_of_books = Object.values(books); //convert to list of books

  const authors_book = list_of_books.filter(book => book.author === author);

  if (authors_book.length > 0) {
    res.status(200).json(authors_book);
  } else {
    res.status(404).json({ message: "what author are you talking about" });
  }
});

//book titles
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const list_of_books = Object.values(books);

  const book_titles = list_of_books.filter(book => book.title.toLowerCase().includes(title.toLowerCase()));

  if (book_titles.length > 0) {
    res.status(200).json(book_titles);
  } else {
    res.status(404).json({ message: "what title are you talking about" });
  }
});


// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book && book.reviews) {
    res.status(200).json(book.reviews);
  } else {
    res.status(404).json({ message: "umm what reviews" });
  }
});

// Task 10
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
      if (Object.keys(books).length > 0) {
          resolve(books);// book found
      } else {
          reject("No books"); 
      }
    })
    .then((books) => {
        res.status(200).json(books); //status good
    })
    .catch((error) => {
        res.status(404).json({ message: error });// status bad
    });
});

// Task 11
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
      const list_of_books = Object.values(books);
      const thebook = list_of_books.find(book => book.ISBN === isbn);
      if (thebook) {
          resolve(thebook); 
      } else {
          reject("Book 404"); 
      }
    })
    .then((book) => {
        res.status(200).json(book);
    })
    .catch((error) => {
        res.status(404).json({ message: error });
    }); 
});



// Task 12
public_users.get('/author/:author', function (req, res) {
  new Promise((resolve, reject) => {
    const list_of_books = Object.values(books);
    const author_books = list_of_books.filter(book => book.author === req.params.author);
    if (author_books.length > 0) {
      resolve(author_books); 
    } else {
      reject("no author books");
    }
    })
    .then((books) => {
        res.status(200).json(books);
    })
    .catch((error) => {
        res.status(404).json({ message: error });
    });
});

//task 13
public_users.get('/title/:title', function (req, res) {
  // Wrap the operation in a Promise
  new Promise((resolve, reject) => {
    const list_of_books = Object.values(books);
    const thebook = list_of_books.find(book => book.title === req.params.title);
    if (thebook) {
      resolve(thebook);
    } else {
      reject("Book by title not found");
    }
  })
  .then((book) => {
        res.status(200).json(book);
  })
  .catch((error) => {
        res.status(404).json({ message: error });
  });
});

module.exports.general = public_users;