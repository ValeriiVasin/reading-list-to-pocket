const PocketStrategy = require('passport-pocket');
const POCKET_CONSUMER_KEY = process.env.POCKET_CONSUMER_KEY;

console.log(POCKET_CONSUMER_KEY);

const pocketStrategy = new PocketStrategy({
		consumerKey    : POCKET_CONSUMER_KEY,
		callbackURL    : "http://127.0.0.1:3000/auth/pocket/callback"
	}, (username, accessToken, done) => {
		process.nextTick(function () {
      return done(null, {
				username,
				accessToken
			});
		});
	}
);

module.exports = (options) => {
	const passport = options.passport;
	const app = options.app;

	passport.serializeUser(function(user, done) {
	  done(null, user);
	});

	passport.deserializeUser(function(obj, done) {
	  done(null, obj);
	});

	passport.use(pocketStrategy);

	app.post('/auth/pocket',
	  passport.authenticate('pocket', { failureRedirect: '/login' }),
	  (req, res) => {
	    res.redirect('/');
	  });

	app.get('/auth/pocket/callback',
	  passport.authenticate('pocket', { failureRedirect: '/login' }),
	  (req, res) => {
	    // Successful authentication, redirect home.
	    res.redirect('/');
	  });
};
