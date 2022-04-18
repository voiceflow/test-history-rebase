import { Fetch } from '@/client/fetch';
import { ImportModel } from '@/pages/NewProjectV2/types';

export const RESOURCE_ENDPOINT = 'model-import';
export const VERSION_ENDPOINT = 'versions';

const createModelImportService = (clientService: Fetch) => ({
  import: (type: string, formData?: FormData) => {
    const importEndpoint = `${RESOURCE_ENDPOINT}/${type}`;

    return clientService.post<ImportModel>(importEndpoint, formData, { json: false }).then((res) => res);
  },
});

export default createModelImportService;
