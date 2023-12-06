import { AlexaProject } from '@voiceflow/alexa-types';
import { Nullable } from '@voiceflow/common';
import axios from 'axios';

import { createProjectService, PROJECT_RESOURCE_ENDPOINT } from '@/client/services';
import { ALEXA_SERVICE_ENDPOINT } from '@/config';

const projectAlexaService = {
  ...createProjectService<AlexaProject.Project>(ALEXA_SERVICE_ENDPOINT),

  updateSelectedVendor: (projectID: string, vendorID: Nullable<string>) =>
    axios
      .put<{ skillID: Nullable<string>; vendorID: Nullable<string> }>(
        `${ALEXA_SERVICE_ENDPOINT}/${PROJECT_RESOURCE_ENDPOINT}/${projectID}/member/selected-vendor`,
        { vendorID }
      )
      .then((res) => res.data),

  updateVendorSkillID: (projectID: string, vendorID: string, skillID: string) =>
    axios
      .put<void>(`${ALEXA_SERVICE_ENDPOINT}/${PROJECT_RESOURCE_ENDPOINT}/${projectID}/member/vendors/${vendorID}/skill-id`, { skillID })
      .then((res) => res.data),
};

export default projectAlexaService;
