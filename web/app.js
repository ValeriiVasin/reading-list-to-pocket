const express = require('express');
const passport = require('passport');
const path = require('path');
const app = express();

const bodyParser = require('body-parser');

const sync = require('../lib').sync;

app.use(require('cookie-parser')());
app.use(bodyParser.urlencoded({ extended: true, limit: '20mb' }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

require('./passport-pocket')({ passport: passport, app: app });

// As with any middleware it is quintessential to call next()
// if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    return;
  }

  res.redirect('/login');
}

// respond with "hello world" when a GET request is made to the homepage
app.get('/', isAuthenticated, (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

app.get('/login', (req, res) => {
  res.sendFile('login.html', { root: __dirname });
});

app.post('/api/sync', (req, res) => {
  sync({
    plistContent: req.body.plist,
    consumerKey: process.env.POCKET_CONSUMER_KEY,
    accessToken: req.session.passport.user.accessToken
  }).then(() => res.redirect('/'));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});