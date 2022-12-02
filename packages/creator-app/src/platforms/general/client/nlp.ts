import axios from 'axios';

const createNLPService = (serviceEndpoint: string) => ({
  getApp: (projectID: string) => axios.get<void>(`${serviceEndpoint}/nlp/${projectID}`).then((res) => res.data),
});

export default createNLPService;
