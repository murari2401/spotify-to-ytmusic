const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SpotifyWebApi = require('spotify-web-api-node');

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
    const { access_token, refresh_token } = data.body;
    // TODO: Store tokens in database associated with user
    res.json({ access_token, refresh_token });
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
    // TODO: Retrieve user's Spotify access token from database
    // spotifyApi.setAccessToken(access_token);
    const data = await spotifyApi.getUserPlaylists();
    res.json(data.body);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching Spotify playlists' });
  }
});

module.exports = router;