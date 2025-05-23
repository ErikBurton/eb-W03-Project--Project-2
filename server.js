require('./database/connection');
const express = require('express');
const cors    = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');

const groupRoutes = require('./routes/groupRoutes');
const performanceRoutes = require('./routes/performanceRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/groups', groupRoutes);
app.use('/api/performances', require('./routes/performanceRoutes'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Global error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Server error'});
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => 
  console.log(`Server running on http://localhost:${PORT}`)
);
