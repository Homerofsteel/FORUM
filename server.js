const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const Auth = require('./Auth');

const SECRET_KEY = 'your-secret-key';

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// temp route
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/html/login.html');
});

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/public/html/signup.html');
});

// temp deep routes
app.get('/home', Auth.verifyToken, (req, res) => {
    res.sendFile(__dirname + '/public/html/home.html');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/html/index.html');
});

app.listen(3000, () => {
    console.log('Serveur en écoute sur http://localhost:3000');
});
