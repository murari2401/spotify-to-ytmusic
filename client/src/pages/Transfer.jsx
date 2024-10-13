import React, { useState } from 'react';
import PlaylistSelector from '../components/PlaylistSelector';
import TransferStatus from '../components/TransferStatus';
import { transferPlaylist } from '../services/api';

function Transfer() {
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePlaylistSelect = (playlist) => {
    setSelectedPlaylist(playlist);
    setError(null);
  };

  const handleTransfer = async () => {
    if (selectedPlaylist) {
      setIsLoading(true);
      setStatus('Transfer in progress...');
      setError(null);
      try {
        await transferPlaylist(selectedPlaylist.id);
        setStatus('Transfer completed successfully!');
      } catch (error) {
        setError('Transfer failed. Please try again.');
        setStatus('');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <h1>Transfer Playlist</h1>
      <PlaylistSelector onSelect={handlePlaylistSelect} />
      {selectedPlaylist && (
        <button onClick={handleTransfer} disabled={isLoading}>
          {isLoading ? 'Transferring...' : `Transfer ${selectedPlaylist.name} to YouTube Music`}
        </button>
      )}
      <TransferStatus status={status} />
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Transfer;