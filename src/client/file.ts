import axios from 'axios';

const fileClient = {
  uploadAudio: async (endpoint: string, data: FormData) => axios.post<string>(`/${endpoint}`, data),

  uploadImage: async (endpoint: null | undefined | string, data: FormData) => axios.post<string>(endpoint || '/image', data),
};

export default fileClient;
