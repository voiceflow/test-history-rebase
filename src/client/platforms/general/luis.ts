import { Intent, Slot } from '@voiceflow/api-sdk';
import axios from 'axios';

const createLuisService = (serviceEndpoint: string) => ({
  publish: (projectID: string, model: { intents: Intent[]; slots: Slot[] }) =>
    axios.post(`${serviceEndpoint}/nlp/${projectID}/publish`, { model }).then((res) => res.data),

  status: (projectID: string) => axios.get(`${serviceEndpoint}/nlp/${projectID}/status`),
});

export default createLuisService;
