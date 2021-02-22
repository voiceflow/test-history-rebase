import { googleService } from '@/client/fetch';
import { MessageFormat } from '@/client/fetch/types';

import { createModelExportService } from '../utils';
import { RESOURCE_ENDPOINT } from '../utils/modelExport';

const projectGoogleService = {
  ...createModelExportService(googleService),

  export: (versionID: string, type: string) =>
    googleService
      .get<Blob>(`${RESOURCE_ENDPOINT}/${type}/${versionID}`, { returns: MessageFormat.BLOB })
      .then(async (blob) => URL.createObjectURL(blob)),
};

export default projectGoogleService;
