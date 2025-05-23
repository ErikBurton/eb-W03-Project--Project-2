require('./database/connection');
const express = require('express');
const cors    = require('cors');

const groupRoutes = require('./routes/groupRoutes');
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/groups', groupRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Server error'});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => 
  console.log('Server running on port ${PORT}')
);
