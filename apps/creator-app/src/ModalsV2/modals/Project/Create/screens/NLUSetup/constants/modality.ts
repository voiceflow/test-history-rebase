import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import { SvgIconTypes } from '@voiceflow/ui';

export interface Option {
  type: Platform.Constants.ProjectType;
  name: string;
  icon: SvgIconTypes.Icon;
  iconColor: string;
}

export const OPTIONS: Option[] = [
  { type: Platform.Constants.ProjectType.CHAT, name: 'Chat', icon: 'systemMessage', iconColor: '#132144' },
  { type: Platform.Constants.ProjectType.VOICE, name: 'Voice', icon: 'outlinedMicrophone', iconColor: '#132144' },
];

export const OPTIONS_MAP = Utils.array.createMap(OPTIONS, (option) => option.type);
