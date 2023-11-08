import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import { SvgIconTypes } from '@voiceflow/ui';

export interface Option {
  type: Platform.Constants.ProjectType;
  name: string;
  icon: SvgIconTypes.Icon;
  iconColor: string;
  platform: Platform.Constants.PlatformType;
}

export const OPTIONS: Option[] = [
  {
    type: Platform.Constants.ProjectType.CHAT,
    name: 'Chat',
    icon: Platform.Webchat.CONFIG.types.chat.icon.name,
    iconColor: '#132144',
    platform: Platform.Webchat.CONFIG.type,
  },
  {
    type: Platform.Constants.ProjectType.VOICE,
    name: 'Voice',
    icon: 'outlinedMicrophone',
    iconColor: Platform.Voiceflow.CONFIG.types.voice.icon.color,
    platform: Platform.Voiceflow.CONFIG.type,
  },
  {
    type: Platform.Constants.ProjectType.VOICE,
    name: Platform.Alexa.CONFIG.name,
    icon: Platform.Alexa.CONFIG.types.voice.icon.name,
    iconColor: Platform.Alexa.CONFIG.types.voice.icon.color,
    platform: Platform.Alexa.CONFIG.type,
  },
];

export const OPTIONS_MAP = Utils.array.createMap(OPTIONS, (option) => option.platform);
