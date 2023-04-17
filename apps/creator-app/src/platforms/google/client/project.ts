import { GoogleProject } from '@voiceflow/google-types';
import axios from 'axios';

import { createProjectService, PROJECT_RESOURCE_ENDPOINT } from '@/client/services';
import { GOOGLE_SERVICE_ENDPOINT } from '@/config';

const projectGoogleService = {
  ...createProjectService<GoogleProject.VoiceProject>(GOOGLE_SERVICE_ENDPOINT),

  getGoogleProjects: () =>
    axios
      .get<{ id: string; name?: string }[]>(`${GOOGLE_SERVICE_ENDPOINT}/${PROJECT_RESOURCE_ENDPOINT}/member/google-projects`)
      .then((res) => res.data),
};

export default projectGoogleService;
