const express = require('express');
const app = express();
const ejsMate = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override');

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '/public')));

app.get('/home', (req, res) => {
    res.render('home');
});

app.get('/features', (req, res) => {
    res.render('features');
});

app.get('/pricing', (req, res) => {
    res.render('pricing');
});

app.get('/users/login', (req, res) => {
    res.render('users/login');
});

app.get('/users/register', (req, res) => {
    res.render('register');
});

app.post('/users/login', (req, res) => {
    res.redirect('/');
});

app.post('/users/register', (req, res) => {
    res.redirect('/');
})

app.get('/', (req, res)=> {
    res.redirect('/home');
})

app.listen(3000, () => {
    console.log('listening on port 3000');
});