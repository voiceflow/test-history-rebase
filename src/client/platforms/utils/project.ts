import { Project } from '@voiceflow/api-sdk';
import axios from 'axios';

export const RESOURCE_ENDPOINT = 'project';

const createProjectService = <P extends Project<any, any>>(serviceEndpoint: string) => ({
  copy: (projectID: string, data?: Partial<P>) =>
    axios.post<P>(`${serviceEndpoint}/${RESOURCE_ENDPOINT}/${projectID}/copy`, data).then((res) => res.data),
});

export default createProjectService;
