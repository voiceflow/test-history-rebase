import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { HeaderIconButtonProps } from '@/components/ProjectPage';
import { createPlatformSelector } from '@/utils/platform';

// eslint-disable-next-line import/prefer-default-export
export const getPlatformIconProps = createPlatformSelector<HeaderIconButtonProps>(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: { icon: 'amazonAlexa', iconProps: { color: '#5fcaf4' } },
    [VoiceflowConstants.PlatformType.GOOGLE]: { icon: 'googleAssistant' },
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_CHAT]: { icon: 'dialogflow', iconProps: { height: '18px', width: '18px' } },
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_VOICE]: { icon: 'dialogflow', iconProps: { height: '18px', width: '18px' } },
  },
  { icon: 'ban' }
);
