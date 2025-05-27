const passport      = require('passport');
const GitHubStratgey = require('passport-github2');

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

module.exports = passport;