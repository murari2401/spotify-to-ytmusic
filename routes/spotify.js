const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SpotifyWebApi = require('spotify-web-api-node');
const { getFreshSpotifyToken } = require('../utils/tokenHelper');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

// @route   GET api/spotify/login
// @desc    Login to Spotify
// @access  Public
router.get('/login', (req, res) => {
  const scopes = ['user-read-private', 'user-read-email', 'playlist-read-private'];
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

// @route   GET api/spotify/callback
// @desc    Handle Spotify callback
// @access  Public
router.get('/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token, expires_in } = data.body;
    
    // Store tokens in database
    const user = await User.findByIdAndUpdate(req.user.id, {
      spotifyToken: {
        access_token,
        refresh_token,
        expires_at: Date.now() + expires_in * 1000
      }
    }, { new: true });

    res.json({ message: 'Spotify authentication successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error during Spotify authentication' });
  }
});

// @route   GET api/spotify/playlists
// @desc    Get user's Spotify playlists
// @access  Private
router.get('/playlists', auth, async (req, res) => {
  try {
    const accessToken = await getFreshSpotifyToken(req.user.id);
    spotifyApi.setAccessToken(accessToken);
    const data = await spotifyApi.getUserPlaylists();
    res.json(data.body);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching Spotify playlists' });
  }
});

module.exports = router;