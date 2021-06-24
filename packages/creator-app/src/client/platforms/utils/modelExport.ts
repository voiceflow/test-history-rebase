import { FetchMessageFormat } from '@voiceflow/ui';

import { Fetch } from '@/client/fetch';

export const RESOURCE_ENDPOINT = 'model-export';

const createModelExportService = (client: Fetch) => ({
  exportBlob: (versionID: string, type: string) =>
    client
      .get<string>(`${RESOURCE_ENDPOINT}/${type}/${versionID}`, { returns: FetchMessageFormat.BLOB })
      .then(async (blob) => URL.createObjectURL(blob)),
});

export default createModelExportService;
