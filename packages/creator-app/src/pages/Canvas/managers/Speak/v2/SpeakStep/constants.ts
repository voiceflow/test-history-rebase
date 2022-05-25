import { DialogType } from '@/constants';

import AudioDialogStep from './components/AudioDialogStep';
import VoiceDialogStep from './components/VoiceDialogStep';

export const DIALOG_TYPE_STEP = {
  [DialogType.AUDIO]: AudioDialogStep,
  [DialogType.VOICE]: VoiceDialogStep,
};

export const getDialogStepComponent = (dialogType: DialogType) => DIALOG_TYPE_STEP[dialogType] || VoiceDialogStep;
