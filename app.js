//express related imports
const express = require('express');
const app = express();
const port = 3000;
const ejsMate = require('ejs-mate');
// const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');

//route imports
const userRoutes = require('./routes/userRoutes');

//session related imports --- including authentication imports
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const connectDB = require('./services/mongo.connect');
//database related imports
const User = require('./models/User');
const db = connectDB();

//OLD MONGOOSE STATIC CONNECTION ---- NOT USED IN MULTI-TENANT APPLICATION
// mongoose.connect('mongodb://localhost:27017/LMDM', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', () => {
//     console.log('database connected');
// });

//basic express setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '/public')));

//setup for express-session and connect-flash
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + (1000*60*60*24*7),
        maxAge: (1000*60*60*24*7)
    }
}
app.use(session(sessionConfig))
app.use(flash());

//setup for passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware to hold flash information to be displayed
//as well as stores currentUser based on req.user
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//use session and flash
app.use(session(sessionConfig))
app.use(flash());

//routes for specific user and private user related pages, including login and register
app.use('/users', userRoutes);

//static public webpages
app.get('/home', (req, res) => {
    res.render('home');
});

app.get('/features', (req, res) => {
    res.render('features');
});

app.get('/pricing', (req, res) => {
    res.render('pricing');
});

app.get('/', (req, res)=> {
    res.redirect('/home');
})

//error handler renders error page instead of crashing application, ENOENT errors still crash app right now
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', {err});
})

//listens on port
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});