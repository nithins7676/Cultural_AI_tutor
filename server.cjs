const express = require('express');
const cors = require('cors');
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const fs = require('fs');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Google Cloud TTS client
const client = new TextToSpeechClient({
  keyFilename: './google-credentials.json', // You'll need to add your Google Cloud credentials
});

// Speech synthesis endpoint
app.post('/api/synthesize-speech', async (req, res) => {
  try {
    const { input, voice, audioConfig } = req.body;

    // Create the request
    const request = {
      input: input,
      voice: voice,
      audioConfig: audioConfig,
    };

    // Perform the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);

    // Set response headers
    res.setHeader('Content-Type', 'audio/mp3');
    res.setHeader('Content-Length', response.audioContent.length);

    // Send the audio content
    res.send(Buffer.from(response.audioContent, 'base64'));
  } catch (error) {
    console.error('Speech synthesis error:', error);
    res.status(500).json({ error: 'Failed to synthesize speech' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'TTS Server is running' });
});

app.listen(port, () => {
  console.log(`TTS Server running on http://localhost:${port}`);
}); 