import client from '@/client';
import { FileExtension } from '@/constants';

import { NLPType } from '../constants';
import * as Base from './base';

export const CONFIG = Base.extend({
  type: NLPType.NUANCE_MIX,

  name: 'Nuance Mix',

  icon: {
    name: 'nuanceMix',
    color: '#7FC31C',
  },

  import: {
    name: 'Nuance Mix',
    extensions: [FileExtension.XML],
  },

  export: {
    method: (versionID, intents) => client.platform.general.modelExport.exportBlob(versionID, 'nuanceMix', intents),
    fileSuffix: '-nuance-mix-model.trsx',
    defaultExtension: FileExtension.XML,
    intentsExtension: FileExtension.XML,
  },
})(Base.validate);

export type Config = typeof CONFIG;
