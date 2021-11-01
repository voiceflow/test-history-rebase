import { Constants } from '@voiceflow/general-types';

import { HeaderIconButtonProps } from '@/components/ProjectPage';
import { createPlatformSelector } from '@/utils/platform';

// eslint-disable-next-line import/prefer-default-export
export const getPlatformIconProps = createPlatformSelector<HeaderIconButtonProps>(
  {
    [Constants.PlatformType.ALEXA]: { icon: 'amazonAlexa', iconProps: { color: '#5fcaf4' } },
    [Constants.PlatformType.GOOGLE]: { icon: 'googleAssistant' },
    [Constants.PlatformType.DIALOGFLOW_ES_CHAT]: { icon: 'dialogflow', iconProps: { height: '18px', width: '18px' } },
    [Constants.PlatformType.DIALOGFLOW_ES_VOICE]: { icon: 'dialogflow', iconProps: { height: '18px', width: '18px' } },
  },
  { icon: 'ban' }
);
