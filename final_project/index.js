const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const { getBooks, getBookByISBN, getBooksByAuthor, getBooksByTitle } = require('./router/general.js');

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
if (req.session.authorization) {
    const token = req.session.authorization.accessToken;
    
    // Verificar el token JWT
    jwt.verify(token, "access", (err, user) => {
        if (!err) {
            // Si la verificación es exitosa, establecer el usuario en la solicitud
            req.user = user;
            next(); // Continuar con la siguiente ruta
        } else {
            // Si hay un error de verificación, indicar que el usuario no está autenticado
            return res.status(403).json({ message: "User not authenticated" });
        }
    });
} else {
    // Si no hay autorización en la sesión, indicar que el usuario no está autenticado
    return res.status(403).json({ message: "User not logged in" });
}

});
 
const PORT =5000;

app.get('/', async (req, res) => {
    try {
        const getBooks = await getAllBooks();
        res.json(allBooks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para la tarea 11: Obtener detalles del libro por ISBN
app.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const book = await getBookByISBN(isbn);
        res.json(book);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para la tarea 12: Obtener detalles del libro por autor
app.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const books = await getBooksByAuthor(author);
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para la tarea 13: Obtener detalles del libro por título
app.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
        const books = await getBooksByTitle(title);
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
