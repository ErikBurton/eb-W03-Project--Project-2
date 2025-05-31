require('./database/connection');
const express = require('express');
const cors    = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');

const session = require('express-session');
const passport = require('./auth-github');

const groupRoutes = require('./routes/groupRoutes');
const performanceRoutes = require('./routes/performanceRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret:     process.env.SESSION_SECRET,
  resave:     false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Auth routes
// Redirect users to GitHub for login
app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] })
);

// GitHub will redirect to this URL after approval
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
      res.redirect('/');
  }
);

// Logout route
app.get('/logout', (req, res, next) => {
    req.logout(function(err) {
    if (err) { return next(err); }
    req.session.destroy(err => {
      if (err) { return next(err); }
      res.clearCookie('connect.sid');
      // logout of GitHub
      const ghLogout = 'https://github.com/logout';
      // return here to re-authenticate
      const retrunTo = encodeURIComponent(
        `${process.env.API_BASE_URL}/auth/github`
      );
      res.redirect('/');
    });
  });
});

// Routes
app.use('/api/groups', groupRoutes);
app.use('/api/performances', require('./routes/performanceRoutes'));

// Swagger UI
// Determine the base URL for Swagger “servers” entry:
const PORT = process.env.PORT || 8080;
const API_BASE_URL = process.env.API_BASE_URL || `http://localhost:${PORT}`;

// Override the servers array so “Try it out” points to the real endpoint
swaggerDocument.servers = [
  { url: API_BASE_URL, description: 'Production API server' }
];

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Server error'});
});

app.listen(PORT, () => {
  console.log(`Server running at ${API_BASE_URL}`);
});

