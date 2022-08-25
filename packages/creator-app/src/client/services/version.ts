import axios from 'axios';

export const RESOURCE_ENDPOINT = 'version';

const createVersionService = <V extends { platformData: { settings: any; publishing: any } }>(serviceEndpoint: string) => ({
  updateSettings: (versionID: string, settings: Partial<V['platformData']['settings']>) =>
    axios.patch<void>(`${serviceEndpoint}/${RESOURCE_ENDPOINT}/${versionID}/settings`, settings).then((res) => res.data),

  updatePublishing: (versionID: string, publishing: Partial<V['platformData']['publishing']>) =>
    axios.patch<void>(`${serviceEndpoint}/${RESOURCE_ENDPOINT}/${versionID}/publishing`, publishing).then((res) => res.data),
});

export default createVersionService;
