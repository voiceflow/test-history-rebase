import * as Platform from '@voiceflow/platform';
import { SvgIconTypes } from '@voiceflow/ui';

import { FileExtension } from '../../../constants/file';
import { NLPType } from '../constants';

export interface Icon {
  name: SvgIconTypes.Icon;

  color: string;
}

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

  icon: Icon;

  import: Import | null;

  export: Export | null;
}

export const CONFIG = Platform.Utils.Types.satisfies<Config>()({
  type: NLPType.VOICEFLOW,

  name: 'Default',

  icon: {
    name: 'voiceflowV',
    color: '#132144',
  },

  import: null,

  export: null,
});

export const extend = Platform.Base.extendFactory<Config>()(CONFIG);
