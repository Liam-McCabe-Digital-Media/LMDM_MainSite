const express = require('express');
const app = express();
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');

const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/LMDM', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('database connected');
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '/public')));

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

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use(session(sessionConfig))
app.use(flash());

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
    res.render('users/register');
});

app.post('/users/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/users/login', keepSessionInfo: true, }), (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

app.post('/users/register', async (req, res, next) => {
    try{
        const {firstName, lastName, email, username, password} = req.body.user;
        const user = new User({firstName, lastName, email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'LMDM');
            res.redirect('/');
        })
        
    }catch(e){
        req.flash('error', e.message);
        res.redirect('/users/register');
    }
})

app.get('/users/logout', (req, res) => {
	req.logout((err) => {
		if (err) {
			throw new ExpressError(err.message, 500);
		} else {
			req.flash('success', 'Goodbye');
			res.redirect('/');
		}
	});
});

app.get('/', (req, res)=> {
    res.redirect('/home');
})

app.listen(3000, () => {
    console.log('listening on port 3000');
});