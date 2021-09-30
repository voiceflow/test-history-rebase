import { FetchMessageFormat } from '@voiceflow/ui';

import { Fetch } from '@/client/fetch';

export const RESOURCE_ENDPOINT = 'model-export';

const createModelExportService = (client: Fetch) => ({
  exportBlob: (versionID: string, type: string, intents?: string[]) =>
    client
      .post<string>(
        `${RESOURCE_ENDPOINT}/${type}/${versionID}`,
        intents && intents.length > 0 ? { returns: FetchMessageFormat.BLOB, intents } : { returns: FetchMessageFormat.BLOB }
      )
      .then(async (data) => {
        const binaryData = [];
        binaryData.push(data);
        return URL.createObjectURL(new Blob(binaryData, { type: 'application/zip' }));
      }),
});

export default createModelExportService;
