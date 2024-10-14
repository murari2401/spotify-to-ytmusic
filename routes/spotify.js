const express = require('express');
const router = express.Router();
const spotifyApi = require('../utils/spotifyApi');
const User = require('../models/User');

// Spotify login
router.get('/login', (req, res) => {
  const scopes = ['user-read-private', 'user-read-email', 'playlist-read-private', 'playlist-read-collaborative'];
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  res.redirect(authorizeURL);
});

// Spotify callback
router.get('/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token, expires_in } = data.body;

    // Store tokens in the database (assuming user is authenticated)
    // For simplicity, we're using a dummy user ID here. In a real app, you'd get this from the authenticated user
    const userId = 'dummy_user_id';
    await User.findByIdAndUpdate(userId, {
      spotifyToken: {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt: Date.now() + expires_in * 1000
      }
    }, { upsert: true });

    res.redirect('http://localhost:5173/transfer'); // Redirect to your frontend transfer page
  } catch (error) {
    console.error('Error in Spotify callback:', error);
    res.status(500).send('Error during Spotify authentication');
  }
});

// Get user's playlists
router.get('/playlists', async (req, res) => {
  try {
    // For simplicity, we're using a dummy user ID here. In a real app, you'd get this from the authenticated user
    const userId = 'dummy_user_id';
    const user = await User.findById(userId);
    
    if (!user || !user.spotifyToken) {
      return res.status(401).json({ error: 'User not authenticated with Spotify' });
    }

    spotifyApi.setAccessToken(user.spotifyToken.accessToken);

    const data = await spotifyApi.getUserPlaylists();
    res.json(data.body);
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(500).json({ error: 'Error fetching playlists' });
  }
});

module.exports = router;