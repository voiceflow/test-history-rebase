import type { NLUImportModel } from '@/models';

import { apiV2 } from './fetch';

export const VERSIONS_PATH = 'versions';

const versionClient = {
  getVersionSnapshot: (
    versionID: string,
    versionName: string,
    options: { manualSave?: boolean; autoSaveFromRestore?: boolean } = {}
  ) => {
    const manualSave = options.manualSave ?? true;
    const autoSaveFromRestore = !!options.autoSaveFromRestore;

    return apiV2.get(
      `${VERSIONS_PATH}/snapshot/${versionID}?manualSave=${manualSave}&saveVersionName=${versionName}&autoSaveFromRestore=${autoSaveFromRestore}`
    );
  },
  patchMergeIntentsAndSlots: (versionID: string, importModel: NLUImportModel): Promise<NLUImportModel> => {
    const endpoint = `${VERSIONS_PATH}/${versionID}/model`;

    return apiV2.patch(endpoint, importModel);
  },
};

export default versionClient;
