import React from 'react';

function SpotifyLogin() {
  const handleLogin = () => {
    // Redirect to your backend's Spotify login route
    window.location.href = 'http://localhost:5001/api/spotify/login';
  };

  return (
    <button onClick={handleLogin}>Login with Spotify</button>
  );
}

export default SpotifyLogin;