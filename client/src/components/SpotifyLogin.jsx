import React from 'react';
import { initiateSpotifyLogin } from '../services/spotify';

function SpotifyLogin() {
  return (
    <button onClick={initiateSpotifyLogin}>Login with Spotify</button>
  );
}

export default SpotifyLogin;