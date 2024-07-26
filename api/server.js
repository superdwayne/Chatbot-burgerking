const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '..', 'src', 'build')));

app.use(cors());
app.use(express.json());

// API route for chat
app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const data = JSON.stringify({
    "endpoint": "SS-chat",
    "inputs": {
      "chat_messages": [
        {
          "role": "user",
          "content": prompt
        }
      ]
    },
    "env": {
      "OPENAI_API_KEY": process.env.OPENAI_API_KEY
    }
  });

  const config = {
    method: 'post',
    url: 'https://api.lmnr.ai/v2/endpoint/run',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.LMNR_API_KEY}`
    },
    data: data
  };

  try {
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    console.error('Error calling LMNR API:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      console.error('No response received:', error.request);
      res.status(500).json({ error: 'No response received from LMNR API' });
    } else {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
  }
});

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'src', 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
