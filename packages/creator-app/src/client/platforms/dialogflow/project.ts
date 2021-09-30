import { Project } from '@voiceflow/google-types';

import { googleService } from '@/client/fetch';
import { GOOGLE_SERVICE_ENDPOINT } from '@/config';

import { createProjectService } from '../utils';

interface DialogflowProject {
  googleProjectID: string;
  agentName: string;
}

const projectDialogflowService = {
  ...createProjectService<Project.GoogleProject>(GOOGLE_SERVICE_ENDPOINT),
  getDialogFlowESProjects: (): Promise<DialogflowProject[]> => googleService.get<DialogflowProject[]>('/dialogflow/es/project/agent-list'),
};

export default projectDialogflowService;
