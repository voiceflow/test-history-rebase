import axios from 'axios';

const fileClient = {
  uploadAudio: async (endpoint: string, data: FormData) => {
    return axios.post<string>(`/${endpoint}`, data);
  },

  uploadImage: async (endpoint: null | undefined | string, data: FormData) => {
    return axios.post<string>(endpoint || '/image', data);
  },
};

export default fileClient;
