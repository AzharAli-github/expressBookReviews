const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if username already exists
  if (users.some(user => user.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Add new user to the users array
  users.push({ username, password });

  return res.status(201).json({ message: "User successfully registered" });
});

//Get books ALL
public_users.get('/books', async function (req, res) {
  try {
      res.status(200).json(books);
  } catch (error) {
      res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});


// Get the list of books available in the shop using async-await with Axios
public_users.get('/', async function (req, res) {
  try {
    // Fetch the list of books from an external API (replace with your actual API URL)
    const response = await axios.get('http://localhost:5000/books');
    
    // Assuming the API response contains a 'data' array with books
    const booksList = response.data;

    // Send the books data as the response
    return res.status(200).json(booksList);
  } catch (error) {
    // Handle any errors that occurred during the API request
    return res.status(500).json({ message: 'Error fetching books list', error: error.message });
  }
});



// Get book details based on ISBN
// Fetch book details by ISBN using async-await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    
    try {
        const response = await axios.get(`http://localhost:5000/books`);
        const book = response.data[isbn];

        if (book) {
            return res.status(200).json(book);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book details", error: error.message });
    }
});


  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author.toLowerCase();

  try {
      const response = await axios.get(`http://localhost:5000/books`);
      const booksData = response.data;

      const filteredBooks = Object.values(booksData).filter(book => book.author.toLowerCase() === author);

      if (filteredBooks.length > 0) {
          return res.status(200).json(filteredBooks);
      } else {
          return res.status(404).json({ message: "No books found by this author" });
      }
  } catch (error) {
      return res.status(500).json({ message: "Error fetching book details", error: error.message });
  }
});


// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
      const response = await axios.get('http://localhost:5000/books');
      const allBooks = response.data;

      const title = req.params.title.toLowerCase();
      const book = Object.values(allBooks).find(b => b.title.toLowerCase() === title);

      if (book) {
          res.status(200).json(book);
      } else {
          res.status(404).json({ message: "Book not found" });
      }
  } catch (error) {
      res.status(500).json({ message: "Error fetching book details", error: error.message });
  }
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Get ISBN from request parameters
  const book = books[isbn]; // Find the book by ISBN

  if (book) {
      return res.status(200).json({ reviews: book.reviews });
  } else {
      return res.status(404).json({ message: "No reviews found for this book" });
  }
});


module.exports.general = public_users;
