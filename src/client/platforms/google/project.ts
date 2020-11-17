import { GoogleProject } from '@voiceflow/google-types';
import axios from 'axios';

import { GOOGLE_SERVICE_ENDPOINT } from '@/config';

import { PROJECT_RESOURCE_ENDPOINT, createProjectService } from '../utils';

const projectGoogleService = {
  ...createProjectService<GoogleProject>(GOOGLE_SERVICE_ENDPOINT),

  getGoogleProjects: () =>
    axios
      .get<{ id: string; name?: string }[]>(`${GOOGLE_SERVICE_ENDPOINT}/${PROJECT_RESOURCE_ENDPOINT}/member/google-projects`)
      .then((res) => res.data),
};

export default projectGoogleService;
