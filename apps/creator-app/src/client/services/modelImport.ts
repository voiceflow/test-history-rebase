import type { Fetch } from '@/client/fetch';
import type { NLUImportModel } from '@/models';

export const RESOURCE_ENDPOINT = 'model-import';
export const VERSION_ENDPOINT = 'versions';

const createModelImportService = (clientService: Fetch) => ({
  import: (type: string, formData?: FormData) => {
    const importEndpoint = `${RESOURCE_ENDPOINT}/${type}`;

    return clientService.post<NLUImportModel>(importEndpoint, formData, { json: false }).then((res) => res);
  },
});

export default createModelImportService;
