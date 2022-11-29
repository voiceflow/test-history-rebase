import client from '@/client';
import { FileExtension } from '@/constants';

import { NLPType } from '../constants';
import * as Base from './base';

export const CONFIG = Base.extend({
  type: NLPType.WATSON,

  name: 'IBM Watson',

  icon: {
    name: 'watson',
    color: '#000000',
  },

  import: {
    name: 'Watson',
    extensions: [FileExtension.JSON],
  },

  export: {
    method: (versionID, intents) => client.platform.general.modelExport.exportBlob(versionID, 'watson', intents),
    fileSuffix: '-watson-model',
    defaultExtension: FileExtension.JSON,
    intentsExtension: FileExtension.ZIP,
  },
})(Base.validate);

export type Config = typeof CONFIG;
