import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

export const transferPlaylist = async (playlistId) => {
  const response = await axios.post(`${API_URL}/transfer`, { playlistId });
  return response.data;
};