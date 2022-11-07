import client from '@/client';
import { FileExtension } from '@/constants';

import { NLPType } from '../constants';
import * as Base from './base';

export const CONFIG = Base.extend({
  type: NLPType.DIALOGFLOW_CX,

  name: 'Dialogflow CX',

  icon: {
    name: 'dialogflowCX',
    color: '#669DF6',
  },

  import: {
    name: 'Dialogflow CX',
    extensions: [FileExtension.ZIP],
  },

  export: {
    method: (versionID, intents) => client.platform.google.modelExport.exportBlob(versionID, 'dialogflow/cx', intents),
    fileSuffix: '-dialogflow-cx-model',
    defaultExtension: FileExtension.ZIP,
    intentsExtension: FileExtension.ZIP,
  },
});

export type Config = typeof CONFIG;
