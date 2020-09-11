import axios from 'axios';

import { ALEXA_SERVICE_ENDPOINT } from '@/config';
import { AlexaStageType } from '@/constants/platforms';
import { AlexaPublishJob } from '@/models';

import { PublishService } from '../types';

const RESOURCE_ENDPOINT = 'publish';

const publishAlexaService: PublishService<AlexaPublishJob.AnyJob, AlexaStageType> = {
  publish: (projectID) => axios.post(`${ALEXA_SERVICE_ENDPOINT}/${RESOURCE_ENDPOINT}/${projectID}`).then((res) => res.data),

  cancelPublish: (projectID) => axios.post(`${ALEXA_SERVICE_ENDPOINT}/${RESOURCE_ENDPOINT}/${projectID}/cancel`).then((res) => res.data),

  getPublishStatus: (projectID) => axios.get(`${ALEXA_SERVICE_ENDPOINT}/${RESOURCE_ENDPOINT}/${projectID}/status`).then((res) => res.data),

  updatePublishStage: (projectID, stage, data) =>
    axios.post(`${ALEXA_SERVICE_ENDPOINT}/${RESOURCE_ENDPOINT}/${projectID}/update-stage`, { stage, data }).then((res) => res.data),
};

export default publishAlexaService;
