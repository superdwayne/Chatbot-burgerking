const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

// Apply CORS settings
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    console.log('Calling LMNR APIDPM with prompt:', prompt);

    const response = await axios.post(
      'https://api.lmnr.ai/v2/endpoint/run',
      {
        env: {
          OPENAI_API_KEY: "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" // Use environment variable
        },
        endpoint: 'SS-chat',
        inputs: {
          chat_messages: [
            { role: 'user', content: prompt }
          ]
        },
        
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : 'Bearer ' + "iexouz4mSqqDVNpZdHsUy1g6QeEioh2vXBITE677x6AAzMARCfHZd8rsWmMap5gm" // Use environment variable
        }
      }
    );

    console.log('LMNR API response:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error calling LMNR API:', error.message);
    if (error.response) {
      // API returned an error response
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      // No response was received
      console.error('No response received:', error.request);
      res.status(500).json({ error: 'No response received from LMNR API' });
    } else {
      // Other errors
      console.error('Error:', error.message);
      res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});