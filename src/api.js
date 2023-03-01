

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}


const express = require("express");
const serverless = require("serverless-http");

const app = express();
const router = express.Router();

const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const initializePassport = require('./passport-config')
initializePassport(
	passport, 
	email => users.find(user => user.email === email),
	id => users.find(user => user.id === id),
)


//	instead of a database
const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
	//	setup an environment
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

router.get('/', checkAuthenticated, (req, res) => {
	res.render('index.ejs', { name: req.user.name })
})

router.get('/login', checkNotAuthenticated, (req, res) => {
	res.render('login.ejs')
})

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
}))

router.get('/register', checkNotAuthenticated, (req, res) => {
	res.render('register.ejs')
})

router.post('/register', checkNotAuthenticated, async (req, res) => {
	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 10)
		users.push({
			id: Date.now().toString(),	//	generated automatically in case of database
			name: req.body.name,
			email: req.body.email,
			password: hashedPassword
		})
		res.redirect('/login')
	} catch {
		res.redirect('/register')
	}
	//	req.body.email
	//	console.log(users)
})

router.delete('/logout', (req, res) => {
	//	https://stackoverflow.com/questions/72336177/error-reqlogout-requires-a-callback-function
	/* req.logOut()
	res.redirect('/login') */
	  req.logout(function(err) {
		if (err) { return next(err); }
		res.redirect('/');
  });
})

function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next()
	}
	
	res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return res.redirect('/')
	}
	
	next()
}

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
