const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });
    if(userswithsamename.length > 0){
        return true;
    } else {
        return false;
    }
}
const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
 const username = req.body.username;
    const password = req.body.password;

    // Verificar si se proporcionaron tanto un nombre de usuario como una contraseña
    if (!username || !password) {
        return res.status(400).json({ message: "Both username and password are required" });
    }

    // Verificar las credenciales del usuario utilizando la función authenticatedUser
    if (authenticatedUser(username, password)) {
        // Si las credenciales son válidas, generar un token de acceso y almacenar la información de autorización en la sesión
        let accessToken = jwt.sign({ username: username }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken,
            username
        };

        return res.status(200).json({ message: "User successfully logged in" });
    } else {
        // Si las credenciales no son válidas, devolver un mensaje de error
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
     const isbn = req.params.isbn;

     // Get the list of books
    const book = books[isbn];
    const review = req.query.review;

    // Verify if a review was provided
    if (!review) {
        return res.status(400).json({ message: "Review is required" });
    }

    // Check if the book exists
    if (book) {
        const username = req.session.authorization.username;
        if (book.reviews[username]) {
            // Modify the existing review
            book.reviews[username] = review;
            return res.status(200).json({ message: "Review updated successfully" });
        } else {
            // Add a new review
            book.reviews[username] = review;
            return res.status(201).json({ message: "Review added successfully" });
        }
    }
});


regd_users.delete("/auth/review/:isbn",(req,res) => {
    //Write your code here
    const isbn = req.params.isbn;

    // Get the list of books
   const book = books[isbn];

   // Check if the book exists
   if (book) {
       const username = req.session.authorization.username;
       if (book.reviews[username]) {
           // Modify the existing review
          delete book.reviews[username];
           return res.status(200).json({ message: "Review deleted successfully" });
       } else {
           
           return res.status(404).json({ message: "Review added successfully" });
       }
   }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
