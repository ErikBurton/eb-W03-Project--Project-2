require('./database/connection');
const express = require('express');
const cors    = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');

const groupRoutes = require('./routes/groupRoutes');
const performanceRoutes = require('./routes/performanceRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/groups', groupRoutes);
app.use('/api/performances', require('./routes/performanceRoutes'));
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


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

// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => 
//   console.log(`Server running on http://localhost:${PORT}`)
// );
