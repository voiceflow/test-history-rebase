import { FetchMessageFormat } from '@voiceflow/ui';

import type { Fetch } from '@/client/fetch';

export const RESOURCE_ENDPOINT = 'model-export';

const createModelExportService = (client: Fetch) => ({
  exportBlob: (versionID: string, type: string, intents?: string[]) => {
    const exportEndpoint = `${RESOURCE_ENDPOINT}/${type}/${versionID}`;
    const exportBody = intents && intents.length > 0 ? { intents } : {};

    return client
      .post<Blob>(exportEndpoint, exportBody, { returns: FetchMessageFormat.BLOB })
      .then(async (blob) => URL.createObjectURL(blob));
  },
});

export default createModelExportService;
