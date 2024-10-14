const User = require('../models/User');
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

async function getFreshSpotifyToken(userId) {
  const user = await User.findById(userId);
  if (!user.spotifyToken) {
    throw new Error('User not connected to Spotify');
  }

  if (Date.now() > user.spotifyToken.expires_at - 60000) { // Refresh if token expires in less than a minute
    try {
      spotifyApi.setRefreshToken(user.spotifyToken.refresh_token);
      const data = await spotifyApi.refreshAccessToken();
      user.spotifyToken = {
        access_token: data.body.access_token,
        refresh_token: user.spotifyToken.refresh_token,
        expires_at: Date.now() + data.body.expires_in * 1000
      };
      await user.save();
    } catch (error) {
      console.error('Error refreshing access token', error);
      throw new Error('Failed to refresh access token');
    }
  }
  return user.spotifyToken.access_token;
}

module.exports = { getFreshSpotifyToken };