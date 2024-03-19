import * as Platform from '@voiceflow/platform-config';

import { FileExtension } from '../../../constants/file';
import { NLPType } from '../constants';

interface Import {
  name: string;
  extensions: FileExtension[];
}

interface Export {
  method: (versionID: string, intents?: string[]) => Promise<string>;
  fileSuffix: string;
  defaultExtension: FileExtension;
  intentsExtension: FileExtension;
}

export interface Config {
  type: NLPType;

  name: string;

  icon: Platform.Types.Icon;

  import: Import | null;

  export: Export | null;
}

export const CONFIG = Platform.Utils.Types.satisfies<Config>()({
  type: NLPType.VOICEFLOW,

  name: 'Default',

  icon: {
    name: 'voiceflowLogomark',
    color: '#132144',
  },

  import: null,

  export: null,
});

export const extend = Platform.ConfigUtils.Config.extendFactory<Config>(CONFIG);
export const validate = Platform.ConfigUtils.Config.validateFactory<Config>(CONFIG);
