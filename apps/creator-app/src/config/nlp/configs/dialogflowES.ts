import client from '@/client';
import { FileExtension } from '@/constants';

import { NLPType } from '../constants';
import * as Base from './base';

export const CONFIG = Base.extend({
  type: NLPType.DIALOGFLOW_ES,

  name: 'Dialogflow ES',

  icon: {
    name: 'dialogflow',
    color: '#FF9800',
  },

  import: {
    name: 'Dialogflow ES',
    extensions: [FileExtension.ZIP],
  },

  export: {
    method: (versionID, intents) => client.platform.google.modelExport.exportBlob(versionID, 'dialogflow/es', intents),
    fileSuffix: '-dialogflow-es-model',
    defaultExtension: FileExtension.ZIP,
    intentsExtension: FileExtension.ZIP,
  },
})(Base.validate);

export type Config = typeof CONFIG;
