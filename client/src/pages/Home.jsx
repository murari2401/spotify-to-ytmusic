import React from 'react';
import SpotifyLogin from '../components/SpotifyLogin';
import YoutubeLogin from '../components/YoutubeLogin';

function Home() {
  return (
    <div>
      <h1>Spotify to YouTube Music Transfer</h1>
      <SpotifyLogin />
      <YoutubeLogin />
    </div>
  );
}

export default Home;