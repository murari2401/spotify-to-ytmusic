import React, { useState, useEffect } from 'react';
import { getSpotifyPlaylists } from '../services/spotify';

function PlaylistSelector({ onSelect }) {
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPlaylists() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getSpotifyPlaylists();
        setPlaylists(data.items);
      } catch (err) {
        setError('Failed to fetch playlists. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchPlaylists();
  }, []);

  if (isLoading) return <p>Loading playlists...</p>;
  if (error) return <p>{error}</p>;

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