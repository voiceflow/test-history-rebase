import client from '@/client';
import { FileExtension } from '@/constants';

import { NLPType } from '../constants';
import * as Base from './base';

export const CONFIG = Base.extend({
  type: NLPType.RASA3,

  name: 'Rasa 3.x',

  icon: {
    name: 'rasa',
    color: '#5A17EE',
  },

  import: {
    name: 'Rasa',
    extensions: [FileExtension.ZIP],
  },

  export: {
    method: (versionID, intents) => client.platform.general.modelExport.exportBlob(versionID, 'rasa3', intents),
    fileSuffix: '-rasa3-model',
    defaultExtension: FileExtension.ZIP,
    intentsExtension: FileExtension.ZIP,
  },
})(Base.validate);

export type Config = typeof CONFIG;
