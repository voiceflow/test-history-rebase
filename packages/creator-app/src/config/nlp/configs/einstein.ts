import client from '@/client';
import { FileExtension } from '@/constants';

import { NLPType } from '../constants';
import * as Base from './base';

export const CONFIG = Base.extend({
  type: NLPType.EINSTEIN,

  name: 'Salesforce Einstein',

  icon: {
    name: 'salesforce',
    color: '#139CD8',
  },

  import: {
    name: 'Einstein',
    extensions: [FileExtension.CSV],
  },

  export: {
    method: (versionID, intents) => client.platform.general.modelExport.exportBlob(versionID, 'einstein', intents),
    fileSuffix: '-einstein-model',
    defaultExtension: FileExtension.CSV,
    intentsExtension: FileExtension.CSV,
  },
})(Base.validate);

export type Config = typeof CONFIG;
