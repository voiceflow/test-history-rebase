import { Fetch } from '@/client/fetch';
import { MessageFormat } from '@/client/fetch/types';

export const RESOURCE_ENDPOINT = 'model-export';

const createModelExportService = (client: Fetch) => ({
  exportBlob: (versionID: string, type: string) =>
    client.get<string>(`${RESOURCE_ENDPOINT}/${type}/${versionID}`, { returns: MessageFormat.BLOB }).then(async (blob) => URL.createObjectURL(blob)),
});

export default createModelExportService;
