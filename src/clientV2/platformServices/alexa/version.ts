import { AlexaPublishing, AlexaSettings, AlexaVersionData } from '@voiceflow/alexa-types';
import axios from 'axios';

import { ALEXA_SERVICE_ENDPOINT } from '@/config';

const RESOURCE_ENDPOINT = 'version';

const versionAlexaService = {
  updateVersionSettings: (versionID: string, settings: Partial<AlexaSettings>) =>
    axios.patch<void>(`${ALEXA_SERVICE_ENDPOINT}/${RESOURCE_ENDPOINT}/${versionID}/settings`, settings).then((res) => res.data),

  updateVersionPublishing: (versionID: string, publishing: Partial<AlexaPublishing>) =>
    axios.patch<void>(`${ALEXA_SERVICE_ENDPOINT}/${RESOURCE_ENDPOINT}/${versionID}/publishing`, publishing).then((res) => res.data),

  updateVersionPlatformData: (versionID: string, platformData: Partial<AlexaVersionData>) =>
    axios.patch<void>(`${ALEXA_SERVICE_ENDPOINT}/${RESOURCE_ENDPOINT}/${versionID}`, platformData).then((res) => res.data),
};

export default versionAlexaService;
