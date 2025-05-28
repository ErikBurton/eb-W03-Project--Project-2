const passport      = require('passport');
const GitHubStratgey = require('passport-github2');

// Log the callback URL at startup
console.log('⚙️ GitHub OAuth Callback URL =', process.env.GITHUB_CALLBACK_URL);

passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new GitHubStratgey ({
    clientID:       process.env.GITHUB_CLIENT_ID,
    clientSecret:   process.env.GITHUB_CLIENT_SECRET,
    callbackURL:    process.env.GITHUB_CALLBACK_URL
},
(accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}
));

// Error handler on strategy
// Monkey-patch the OAuth2 token handler to log errors
const strategy = passport._strategy('github');
const originalGetToken = strategy._oauth2.getOAuthAccessToken;
strategy._oauth2.getOAuthAccessToken = function(code, params, callback) {
  return originalGetToken.call(this, code, params, (err, token, refresh, results) => {
    if (err) {
      console.error('❌ GitHub token exchange error:', err);
      console.error('❌ GitHub response payload:', results);
    }
    callback(err, token, refresh, results);
  });
};

module.exports = passport;