import { Project } from '@voiceflow/google-types';
import axios from 'axios';

import { GOOGLE_SERVICE_ENDPOINT } from '@/config';

import { createProjectService, PROJECT_RESOURCE_ENDPOINT } from '../utils';

const projectGoogleService = {
  ...createProjectService<Project.GoogleProject>(GOOGLE_SERVICE_ENDPOINT),

  // move to separate DF ES client later
  getDialogFlowESProjects: () =>
    axios
      .get<{ googleProjectID: string; agentName: string }[]>(`${GOOGLE_SERVICE_ENDPOINT}/dialogflow/es/project/agent-list`)
      .then((res) => res.data),

  getGoogleProjects: () =>
    axios
      .get<{ id: string; name?: string }[]>(`${GOOGLE_SERVICE_ENDPOINT}/${PROJECT_RESOURCE_ENDPOINT}/member/google-projects`)
      .then((res) => res.data),
};

export default projectGoogleService;
