const express = require('express');
const axios = require('axios');

module.exports = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(422).json({ error: 'Prompt is required' });
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
    return res.json(response.data);
  } catch (error) {
    console.error('Error calling LMNR API:', error.message);

    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      return res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      console.error('No response received:', error.request);
      return res.status(500).json({ error: 'No response received from LMNR API' });
    } else {
      console.error('Error:', error.message);
      return res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
  }
};