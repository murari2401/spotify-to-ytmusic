import axios from 'axios';

const API_URL = 'http://localhost:5001/api/spotify';

export const getSpotifyPlaylists = async () => {
  const response = await axios.get(`${API_URL}/playlists`);
  return response.data;
};