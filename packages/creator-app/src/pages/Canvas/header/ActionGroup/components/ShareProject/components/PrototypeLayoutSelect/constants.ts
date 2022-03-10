import { Utils } from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { textAndDialogGraphic, textAndDialogGraphicInactive, voiceAndVisualsGraphic, voiceAndVisualsGraphicInactive } from '@/assets';
import { PrototypeLayout } from '@/constants/prototype';

interface OptionDetail {
  title: string;
  activeImg: string;
  inactiveImg: string;
  description: (platform: VoiceflowConstants.PlatformType) => string;
}

export const OPTION_DETAILS: Record<PrototypeLayout, OptionDetail> = {
  [PrototypeLayout.TEXT_DIALOG]: {
    title: 'Chat Input',
    description: (platform) =>
      `Testers will use text and ${Utils.platform.getPlatformValue(
        platform,
        { [VoiceflowConstants.PlatformType.GOOGLE]: 'chips' },
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
        { [VoiceflowConstants.PlatformType.GOOGLE]: 'chips' },
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

export const getLayoutOptions = Utils.platform.createProjectTypeSelectorV2({
  [VoiceflowConstants.ProjectType.CHAT]: CHATBOT_LAYOUT_OPTIONS,
  [VoiceflowConstants.ProjectType.VOICE]: VOICE_LAYOUT_OPTIONS,
});
