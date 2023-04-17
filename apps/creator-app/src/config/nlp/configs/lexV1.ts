import client from '@/client';
import { FileExtension } from '@/constants';

import { NLPType } from '../constants';
import * as Base from './base';

export const CONFIG = Base.extend({
  type: NLPType.LEX_V1,

  name: 'Amazon Lex V1',

  icon: {
    name: 'lex',
    color: '#205B99',
  },

  import: {
    name: 'Lex',
    extensions: [FileExtension.ZIP],
  },

  export: {
    method: (versionID, intents) => client.platform.general.modelExport.exportBlob(versionID, 'lexV1', intents),
    fileSuffix: '-lexv1-model',
    defaultExtension: FileExtension.ZIP,
    intentsExtension: FileExtension.ZIP,
  },
})(Base.validate);

export type Config = typeof CONFIG;
