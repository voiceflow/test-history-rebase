import axios from 'axios';

const fileClient = {
  uploadVideo: (data: FormData) => axios.post<string>('/video', data),

  uploadAudio: (data: FormData) => axios.post<string>('/audio', data),

  uploadImage: (endpoint: null | undefined | string, data: FormData) => axios.post<string>(endpoint || '/image', data),
};

export default fileClient;
