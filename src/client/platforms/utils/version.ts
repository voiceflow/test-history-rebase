import axios from 'axios';

export const RESOURCE_ENDPOINT = 'version';

const createVersionService = <S extends Record<string, any>, P extends Record<string, any>, PD extends Record<string, any>>(
  serviceEndpoint: string
) => ({
  updateSettings: (versionID: string, settings: Partial<S>) =>
    axios.patch<void>(`${serviceEndpoint}/${RESOURCE_ENDPOINT}/${versionID}/settings`, settings).then((res) => res.data),

  updatePublishing: (versionID: string, publishing: Partial<P>) =>
    axios.patch<void>(`${serviceEndpoint}/${RESOURCE_ENDPOINT}/${versionID}/publishing`, publishing).then((res) => res.data),

  updatePlatformData: (versionID: string, platformData: Partial<PD>) =>
    axios.patch<void>(`${serviceEndpoint}/${RESOURCE_ENDPOINT}/${versionID}`, platformData).then((res) => res.data),
});

export default createVersionService;
