import * as Platform from '@voiceflow/platform-config';
import { Utils } from '@voiceflow/realtime-sdk';
import type { SvgIconTypes } from '@voiceflow/ui';

interface PlatformIconProps {
  icon: SvgIconTypes.Icon;
  iconProps?: Omit<SvgIconTypes.Props, 'icon'>;
}

export const getPlatformIconProps = Utils.platform.createPlatformSelector<PlatformIconProps>(
  {
    [Platform.Constants.PlatformType.ALEXA]: { icon: 'amazonAlexa', iconProps: { color: '#5fcaf4' } },
    [Platform.Constants.PlatformType.GOOGLE]: { icon: 'logoGoogleAssistant' },
    [Platform.Constants.PlatformType.DIALOGFLOW_ES]: { icon: 'logoDialogflow', iconProps: { height: 18, width: 18 } },
    [Platform.Constants.PlatformType.DIALOGFLOW_CX]: { icon: 'dialogflowCX', iconProps: { height: 18, width: 18 } },
  },
  { icon: 'ban' }
);
