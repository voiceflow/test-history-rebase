import { Project } from '@voiceflow/google-types';

import { googleService } from '@/client/fetch';
import { GOOGLE_SERVICE_ENDPOINT } from '@/config';
import { UploadProject } from '@/models';

import { createProjectService } from '../utils';

const projectDialogflowService = {
  ...createProjectService<Project.GoogleProject>(GOOGLE_SERVICE_ENDPOINT),
  getDialogFlowESProjects: (): Promise<UploadProject.Dialogflow[]> =>
    googleService.get<UploadProject.Dialogflow[]>('dialogflow/es/project/agent-list'),
};

export default projectDialogflowService;
