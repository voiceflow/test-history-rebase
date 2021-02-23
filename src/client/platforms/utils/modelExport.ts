import { Fetch } from '@/client/fetch';

export const RESOURCE_ENDPOINT = 'model-export';

const createModelExportService = (client: Fetch) => ({
  export: (versionID: string, type: string) =>
    client.get<Record<string, unknown>>(`${RESOURCE_ENDPOINT}/${type}/${versionID}`).then(({ model }) => JSON.stringify(model, null, 2)),
});

export default createModelExportService;
