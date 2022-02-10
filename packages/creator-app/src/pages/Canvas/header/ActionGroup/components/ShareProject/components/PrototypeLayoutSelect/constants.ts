import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { textAndDialogGraphic, textAndDialogGraphicInactive, voiceAndVisualsGraphic, voiceAndVisualsGraphicInactive } from '@/assets';
import { PrototypeLayout } from '@/ducks/prototype/types';
import { createPlatformSelector, getPlatformValue } from '@/utils/platform';

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
      `Testers will use text and ${getPlatformValue(platform, { [VoiceflowConstants.PlatformType.GOOGLE]: 'chips' }, 'buttons')} input`,
    activeImg: textAndDialogGraphic,
    inactiveImg: textAndDialogGraphicInactive,
  },
  [PrototypeLayout.VOICE_DIALOG]: {
    title: 'Voice Input',
    description: (platform) =>
      `Testers will use voice and ${getPlatformValue(platform, { [VoiceflowConstants.PlatformType.GOOGLE]: 'chips' }, 'buttons')} input`,
    activeImg: textAndDialogGraphic,
    inactiveImg: textAndDialogGraphic,
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

const GENERAL_LAYOUT_OPTIONS = [PrototypeLayout.TEXT_DIALOG, PrototypeLayout.VOICE_DIALOG, PrototypeLayout.VOICE_VISUALS];

export const getLayoutOptions = createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.CHATBOT]: CHATBOT_LAYOUT_OPTIONS,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_CHAT]: CHATBOT_LAYOUT_OPTIONS,
  },
  GENERAL_LAYOUT_OPTIONS
);
