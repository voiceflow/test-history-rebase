import type { BaseModels } from '@voiceflow/base-types';
import axios from 'axios';

export const RESOURCE_ENDPOINT = 'project';

const createProjectService = <P extends BaseModels.Project.Model<any, any>>(serviceEndpoint: string) => ({
  copy: (
    projectID: string,
    data?: Partial<P>,
    params?: { channel?: string; language?: string; onboarding?: boolean }
  ) =>
    axios
      .post<P>(`${serviceEndpoint}/${RESOURCE_ENDPOINT}/${projectID}/copy`, { ...data }, { params })
      .then((res) => res.data),
});

export default createProjectService;
