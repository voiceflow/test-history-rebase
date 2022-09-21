import { Utils } from '@voiceflow/realtime-sdk';
import { SvgIconTypes } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

interface PlatformIconProps {
  icon: SvgIconTypes.Icon;
  iconProps?: Omit<SvgIconTypes.Props, 'icon'>;
}

export const getPlatformIconProps = Utils.platform.createPlatformSelector<PlatformIconProps>(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: { icon: 'amazonAlexa', iconProps: { color: '#5fcaf4' } },
    [VoiceflowConstants.PlatformType.GOOGLE]: { icon: 'googleAssistant' },
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: { icon: 'dialogflow', iconProps: { height: '18px', width: '18px' } },
    [VoiceflowConstants.PlatformType.DIALOGFLOW_CX]: { icon: 'dialogflowCX', iconProps: { height: '18px', width: '18px' } },
  },
  { icon: 'ban' }
);
