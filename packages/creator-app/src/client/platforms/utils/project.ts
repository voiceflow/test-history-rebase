import { Models } from '@voiceflow/base-types';
import axios from 'axios';

export const RESOURCE_ENDPOINT = 'project';

const createProjectService = <P extends Models.Project<any, any>>(serviceEndpoint: string) => ({
  copy: (projectID: string, data?: Partial<P>, params?: { channel?: string }) =>
    axios.post<P>(`${serviceEndpoint}/${RESOURCE_ENDPOINT}/${projectID}/copy`, { ...data }, { params }).then((res) => res.data),
});

export default createProjectService;
