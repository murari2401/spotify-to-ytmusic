const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI
);

// @route   GET api/youtube/login
// @desc    Login to YouTube
// @access  Public
router.get('/login', (req, res) => {
  const scopes = ['https://www.googleapis.com/auth/youtube'];
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
  });
  res.redirect(url);
});

// @route   GET api/youtube/callback
// @desc    Handle YouTube callback
// @access  Public
router.get('/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    // TODO: Store tokens in database associated with user
    res.json(tokens);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error during YouTube authentication' });
  }
});

// @route   POST api/youtube/create-playlist
// @desc    Create a YouTube Music playlist
// @access  Private
router.post('/create-playlist', auth, async (req, res) => {
  try {
    // TODO: Retrieve user's YouTube access token from database
    // oauth2Client.setCredentials({ access_token });
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
    const response = await youtube.playlists.insert({
      part: 'snippet,status',
      requestBody: {
        snippet: {
          title: req.body.title,
          description: req.body.description
        },
        status: {
          privacyStatus: 'private'
        }
      }
    });
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating YouTube playlist' });
  }
});

module.exports = router;