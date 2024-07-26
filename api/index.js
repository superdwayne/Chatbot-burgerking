const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, 'public') });
});

const apiRoute = require('./apiRoutes');

app.use('/api/chat', apiRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});