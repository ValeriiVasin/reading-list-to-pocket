const express = require('express');
const passport = require('passport');
const app = express();

const bodyParser = require('body-parser');
const getReadingList = require('./parser').getReadingList;

const pocket = require('pocket-api');

app.use(require('serve-static')(__dirname + '/../../public'));
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
  res.sendFile('index.html', { root: '.' });
});

app.get('/login', (req, res) => {
  res.sendFile('login.html', { root: '.' });
});

app.post('/api/sync', (req, res) => {
  const items = getReadingList(req.body.plist);
  const actions = items.map(item => ({
    action: 'add',
    time: Math.round(Date.parse(item.createdOn) / 1000),
    url: item.url,
    tags: 'safari-reading-list'
  }));

  pocket.modifyArticles(
    actions,
    process.env.POCKET_CONSUMER_KEY,
    req.session.passport.user.accessToken,
    (error, data) => {
      if (error) {
         console.error('ERROR!', error);
      }

      res.redirect('/');
    }
  );
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
