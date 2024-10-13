import React, { useState, useEffect } from 'react';
import { getSpotifyPlaylists } from '../services/spotify';

function PlaylistSelector({ onSelect }) {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    async function fetchPlaylists() {
      const data = await getSpotifyPlaylists();
      setPlaylists(data.items);
    }
    fetchPlaylists();
  }, []);

  return (
    <div>
      <h2>Select a Playlist</h2>
      <ul>
        {playlists.map(playlist => (
          <li key={playlist.id} onClick={() => onSelect(playlist)}>
            {playlist.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlaylistSelector;