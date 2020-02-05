import axios from 'axios';

const fileClient = {
  uploadAudio: async (endpoint, data) => {
    return axios.post(`/${endpoint}`, data);
  },

  uploadImage: async (endpoint, data) => {
    return axios.post(endpoint || '/image', data);
  },
};

export default fileClient;
