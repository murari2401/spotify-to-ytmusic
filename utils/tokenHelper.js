const User = require('../models/User');
const SpotifyWebApi = require('spotify-web-api-node');
const { google } = require('googleapis');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI
);

async function getFreshSpotifyToken(userId) {
  const user = await User.findById(userId);
  if (Date.now() > user.spotifyToken.expires_at) {
    const data = await spotifyApi.refreshAccessToken();
    user.spotifyToken = {
      access_token: data.body.access_token,
      refresh_token: user.spotifyToken.refresh_token,
      expires_at: Date.now() + data.body.expires_in * 1000
    };
    await user.save();
  }
  return user.spotifyToken.access_token;
}

async function getFreshYoutubeToken(userId) {
  const user = await User.findById(userId);
  if (Date.now() > user.youtubeToken.expires_at) {
    const { tokens } = await oauth2Client.refreshAccessToken();
    user.youtubeToken = {
      access_token: tokens.access_token,
      refresh_token: user.youtubeToken.refresh_token,
      expires_at: tokens.expiry_date
    };
    await user.save();
  }
  return user.youtubeToken.access_token;
}

module.exports = { getFreshSpotifyToken, getFreshYoutubeToken };