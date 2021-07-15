import axios from 'axios';

const fileClient = {
  uploadAudio: (endpoint: string, data: FormData) => axios.post<string>(`/${endpoint}`, data),

  uploadImage: (endpoint: null | undefined | string, data: FormData) => axios.post<string>(endpoint || '/image', data),
};

export default fileClient;
