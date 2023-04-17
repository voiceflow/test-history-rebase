import * as Platform from '@voiceflow/platform-config';

import client from '@/client';
import { FileExtension } from '@/constants';

import { NLPType } from '../constants';
import * as Base from './base';

export const CONFIG = Base.extend({
  type: NLPType.ALEXA,

  name: 'Amazon Alexa',

  icon: Platform.Alexa.CONFIG.types.voice.icon,

  import: null,

  export: {
    method: (versionID, intents) => client.platform.alexa.modelExport.exportBlob(versionID, 'ask', intents),
    fileSuffix: '-alexa-model',
    defaultExtension: FileExtension.JSON,
    intentsExtension: FileExtension.JSON,
  },
})(Base.validate);

export type Config = typeof CONFIG;
