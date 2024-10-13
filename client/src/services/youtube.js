import axios from 'axios';

const API_URL = 'http://localhost:5001/api/youtube';

export const createYoutubePlaylist = async (name, description) => {
  const response = await axios.post(`${API_URL}/create-playlist`, { name, description });
  return response.data;
};