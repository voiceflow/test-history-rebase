import { GoogleProject } from '@voiceflow/google-types';

import { googleService } from '@/client/fetch';
import { GOOGLE_SERVICE_ENDPOINT } from '@/config';
import { UploadProject } from '@/models';

import { createProjectService } from '../utils';

const projectDialogflowService = {
  ...createProjectService<GoogleProject.VoiceProject>(GOOGLE_SERVICE_ENDPOINT),
  getDialogFlowESProjects: (): Promise<UploadProject.Dialogflow[]> =>
    googleService.get<UploadProject.Dialogflow[]>('dialogflow/es/project/agent-list'),
};

export default projectDialogflowService;
