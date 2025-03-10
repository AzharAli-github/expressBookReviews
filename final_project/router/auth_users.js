const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
// Login route for registered users
// Login route for registered users
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Validate user credentials
  const user = users.find(user => user.username === username && user.password === password);

  // If user is not found, send an error response
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // If user is found, create a JWT token
  const accessToken = jwt.sign({ username }, 'yourSecretKey', { expiresIn: '1h' });

  // Save the JWT in the session or respond with the token
  return res.status(200).json({
    message: "User logged in successfully",
    accessToken
  });
});



// Add a book review
// Add or modify a book review for a logged-in user
regd_users.put("http://localhost:5000/auth/review/1234567890", (req, res) => {
  // Check if the user is logged in (JWT token validation)
  const { username } = req.session.authorization || {};

  if (!username) {
    return res.status(403).json({ message: "You must be logged in to post a review." });
  }

  // Get the review from the query parameters
  const review = req.query.review;
  const { isbn } = req.params; // Get the ISBN from the request parameters

  // Check if review is provided in the query
  if (!review) {
    return res.status(400).json({ message: "Review is required in the query parameter." });
  }

  // Find the book by ISBN
  const book = books.find(b => b.isbn === isbn);

  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Check if the user has already reviewed this book
  const existingReview = book.reviews.find(r => r.username === username);

  if (existingReview) {
    // If a review already exists, update it
    existingReview.review = review;
    return res.status(200).json({ message: "Review updated successfully." });
  } else {
    // If no review exists, add the new review
    book.reviews.push({ username, review });
    return res.status(200).json({ message: "Review added successfully." });
  }
});

// Delete a book review for a logged-in user
regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Check if the user is logged in (JWT token validation)
  const { username } = req.session.authorization || {};

  if (!username) {
    return res.status(403).json({ message: "You must be logged in to delete a review." });
  }

  const { isbn } = req.params; // Get the ISBN from the request parameters

  // Find the book by ISBN
  const book = books.find(b => b.isbn === isbn);

  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Check if the user has already reviewed this book
  const reviewIndex = book.reviews.findIndex(r => r.username === username);

  if (reviewIndex === -1) {
    return res.status(404).json({ message: "Review not found for this book." });
  }

  // Delete the review for the logged-in user
  book.reviews.splice(reviewIndex, 1);

  return res.status(200).json({ message: "Review deleted successfully." });
});




module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
