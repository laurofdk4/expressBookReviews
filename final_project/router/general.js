const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!isValid(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});


const getBooks = async () => {
    try {
      // Make a GET request to fetch the list of books
      const response = await axios.get('https://laurofanjuld-5000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai');
      
      // Return the response data if the request was successful
      return response.data;
    } catch (error) {
      // Handle any errors that may occur during the request
      console.error('Error fetching the list of books:', error);
      throw error;
    }
  };

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
});

const getBookByISBN = async (isbn) => {
    try {
      // Make a GET request to fetch book details based on ISBN
      const response = await axios.get(`https://laurofanjuld-5000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/isbn/${isbn}`);
      
      // Return the response data if the request was successful
      return response.data;
    } catch (error) {
      // Handle any errors that may occur during the request
      console.error(`Error fetching book details for ISBN ${isbn}:`, error);
      throw error;
    }
};

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});

const getBooksByAuthor = async (author) => {
    try {
      // Make a GET request to fetch book details based on author
      const response = await axios.get(`https://laurofanjuld-5000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/author/${author}`);
      
      // Return the response data if the request was successful
      return response.data;
    } catch (error) {
      // Handle any errors that may occur during the request
      console.error(`Error fetching books by author ${author}:`, error);
      throw error;
    }
};
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const bookDetails = []; // Will store the details of books by the author
  
  // Get all the keys (ISBNs) of the 'books' object
  const bookISBNs = Object.keys(books);

  // Iterate through the keys (ISBNs) of the books
  bookISBNs.forEach(isbn => {
    const book = books[isbn];
    // Check if the author of the book matches the author provided in the request parameters
    if (book.author === author) {
      bookDetails.push(book); // Add the book details to the 'bookDetails' array
    }
  });

  res.send(bookDetails);
});

const getBooksByTitle = async (title) => {
    try {
      // Make a GET request to fetch book details based on title
      const response = await axios.get(`https://laurofanjuld-5000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/title/${title}`);
      
      // Return the response data if the request was successful
      return response.data;
    } catch (error) {
      // Handle any errors that may occur during the request
      console.error(`Error fetching books by title ${title}:`, error);
      throw error;
    }
};

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const bookDetails = []; // Will store the details of books with the specified title
  
  // Get all the keys (ISBNs) of the 'books' object
  const bookISBNs = Object.keys(books);

  // Iterate through the keys (ISBNs) of the books
  bookISBNs.forEach(isbn => {
    const book = books[isbn];
    // Check if the title of the book matches the title provided in the request parameters
    if (book.title === title) {
      bookDetails.push(book); // Add the book details to the 'bookDetails' array
    }
  });

  res.send(bookDetails);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews)
});

module.exports.general = public_users;

module.exports = {
    getBooks: getBooks,
    getBookByISBN: getBookByISBN,
    getBooksByAuthor: getBooksByAuthor,
    getBooksByTitle: getBooksByTitle
}