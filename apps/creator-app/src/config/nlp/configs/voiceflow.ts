import client from '@/client';
import { FileExtension } from '@/constants';

import { NLPType } from '../constants';
import * as Base from './base';

export const CONFIG = Base.extend({
  type: NLPType.VOICEFLOW,

  name: 'Voiceflow CSV',

  icon: {
    name: 'voiceflowLogomark',
    color: '#132144',
  },

  import: {
    name: 'Voiceflow',
    extensions: [FileExtension.CSV],
  },

  export: {
    method: (versionID, intents) => client.platform.general.modelExport.exportBlob(versionID, 'csv', intents),
    fileSuffix: '.vf',
    defaultExtension: FileExtension.CSV,
    intentsExtension: FileExtension.CSV,
  },
})(Base.validate);

export type Config = typeof CONFIG;
