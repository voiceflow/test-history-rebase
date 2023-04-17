import * as Platform from '@voiceflow/platform-config';
import { Utils } from '@voiceflow/realtime-sdk';

import { textAndDialogGraphic, textAndDialogGraphicInactive, voiceAndVisualsGraphic, voiceAndVisualsGraphicInactive } from '@/assets';
import { PrototypeLayout } from '@/constants/prototype';

interface OptionDetail {
  title: string;
  activeImg: string;
  inactiveImg: string;
  description: (platform: Platform.Constants.PlatformType) => string;
}

export const OPTION_DETAILS: Record<PrototypeLayout, OptionDetail> = {
  [PrototypeLayout.TEXT_DIALOG]: {
    title: 'Chat Input',
    description: (platform) =>
      `Testers will use text and ${Utils.platform.getPlatformValue(
        platform,
        { [Platform.Constants.PlatformType.GOOGLE]: 'chips' },
        'buttons'
      )} input`,
    activeImg: textAndDialogGraphic,
    inactiveImg: textAndDialogGraphicInactive,
  },
  [PrototypeLayout.VOICE_DIALOG]: {
    title: 'Voice Input',
    description: (platform) =>
      `Testers will use voice and ${Utils.platform.getPlatformValue(
        platform,
        { [Platform.Constants.PlatformType.GOOGLE]: 'chips' },
        'buttons'
      )} input`,
    activeImg: textAndDialogGraphic,
    inactiveImg: textAndDialogGraphicInactive,
  },
  [PrototypeLayout.VOICE_VISUALS]: {
    title: 'Voice and Visuals',
    description: () => 'Testers will only use voice input',
    activeImg: voiceAndVisualsGraphic,
    inactiveImg: voiceAndVisualsGraphicInactive,
  },
};

/**
 *  width is calculated from parent popup width and padding
 * to account for caret
 *  */
export const CUSTOM_MENU_WIDTH = 374;

const CHATBOT_LAYOUT_OPTIONS = [PrototypeLayout.TEXT_DIALOG, PrototypeLayout.VOICE_DIALOG];

const VOICE_LAYOUT_OPTIONS = [PrototypeLayout.TEXT_DIALOG, PrototypeLayout.VOICE_DIALOG, PrototypeLayout.VOICE_VISUALS];

export const getLayoutOptions = Utils.platform.createProjectTypeSelector({
  [Platform.Constants.ProjectType.CHAT]: CHATBOT_LAYOUT_OPTIONS,
  [Platform.Constants.ProjectType.VOICE]: VOICE_LAYOUT_OPTIONS,
});
