import axios from 'axios';

import { ALEXA_SERVICE_ENDPOINT } from '@/config';
import { AlexaStageType } from '@/constants/platforms';
import { AlexaExportJob } from '@/models';

import { ExportService } from '../types';

const RESOURCE_ENDPOINT = 'export';

const exportAlexaService: ExportService<AlexaExportJob.AnyJob, AlexaStageType> = {
  export: (projectID) => axios.post(`${ALEXA_SERVICE_ENDPOINT}/${RESOURCE_ENDPOINT}/${projectID}`).then((res) => res.data),

  cancelExport: (projectID) => axios.post(`${ALEXA_SERVICE_ENDPOINT}/${RESOURCE_ENDPOINT}/${projectID}/cancel`).then((res) => res.data),

  getExportStatus: (projectID) => axios.get(`${ALEXA_SERVICE_ENDPOINT}/${RESOURCE_ENDPOINT}/${projectID}/status`).then((res) => res.data),

  updateExportStage: (projectID, stage, data) =>
    axios.post(`${ALEXA_SERVICE_ENDPOINT}/${RESOURCE_ENDPOINT}/${projectID}/update-stage`, { stage, data }).then((res) => res.data),
};

export default exportAlexaService;
