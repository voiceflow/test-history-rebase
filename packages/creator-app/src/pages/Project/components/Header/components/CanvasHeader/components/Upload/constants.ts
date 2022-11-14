import * as Platform from '@voiceflow/platform-config';
import { Utils } from '@voiceflow/realtime-sdk';
import { SvgIconTypes } from '@voiceflow/ui';

interface PlatformIconProps {
  icon: SvgIconTypes.Icon;
  iconProps?: Omit<SvgIconTypes.Props, 'icon'>;
}

export const getPlatformIconProps = Utils.platform.createPlatformSelector<PlatformIconProps>(
  {
    [Platform.Constants.PlatformType.ALEXA]: { icon: 'amazonAlexa', iconProps: { color: '#5fcaf4' } },
    [Platform.Constants.PlatformType.GOOGLE]: { icon: 'googleAssistantLogo' },
    [Platform.Constants.PlatformType.DIALOGFLOW_ES]: { icon: 'dialogflowLogo', iconProps: { height: '18px', width: '18px' } },
    [Platform.Constants.PlatformType.DIALOGFLOW_CX]: { icon: 'dialogflowCX', iconProps: { height: '18px', width: '18px' } },
  },
  { icon: 'ban' }
);
