import client from '@/client';
import { FileExtension } from '@/constants';

import { NLPType } from '../constants';
import * as Base from './base';

export const CONFIG = Base.extend({
  type: NLPType.LUIS,

  name: 'Microsoft LUIS',

  icon: {
    name: 'luis',
    color: '#669DF6',
  },

  import: {
    name: 'Luis',
    extensions: [FileExtension.JSON],
  },

  export: {
    method: (versionID, intents) => client.platform.general.modelExport.exportBlob(versionID, 'luis', intents),
    fileSuffix: '-luis-model',
    defaultExtension: FileExtension.JSON,
    intentsExtension: FileExtension.JSON,
  },
})(Base.validate);

export type Config = typeof CONFIG;
