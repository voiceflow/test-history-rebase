import { Utils } from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { HeaderIconButtonProps } from '@/components/ProjectPage';

// eslint-disable-next-line import/prefer-default-export
export const getPlatformIconProps = Utils.platform.createPlatformSelector<HeaderIconButtonProps>(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: { icon: 'amazonAlexa', iconProps: { color: '#5fcaf4' } },
    [VoiceflowConstants.PlatformType.GOOGLE]: { icon: 'googleAssistant' },
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: { icon: 'dialogflow', iconProps: { height: '18px', width: '18px' } },
  },
  { icon: 'ban' }
);
