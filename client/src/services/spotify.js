import axios from 'axios';

const API_URL = 'http://localhost:5001/api/spotify';

export const initiateSpotifyLogin = () => {
  window.location.href = `${API_URL}/login`;
};

export const getSpotifyPlaylists = async () => {
  try {
    const response = await axios.get(`${API_URL}/playlists`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Spotify playlists:', error);
    throw error;
  }
};