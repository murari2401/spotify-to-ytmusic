import React from 'react';

function YoutubeLogin() {
  const handleLogin = () => {
    // Redirect to your backend's YouTube login route
    window.location.href = 'http://localhost:5001/api/youtube/login';
  };

  return (
    <button onClick={handleLogin}>Login with YouTube</button>
  );
}

export default YoutubeLogin;