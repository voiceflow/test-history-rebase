import * as Realtime from '@voiceflow/realtime-sdk';
import { SvgIconTypes } from '@voiceflow/ui';

import { DialogType } from '@/constants';

import { NodeManagerConfig } from '../../types';
import SpeakEditor from './SpeakEditor';
import SpeakStep from './SpeakStep';

const STEPS_ICON_MAP: Record<DialogType, SvgIconTypes.Icon> = {
  [DialogType.AUDIO]: 'audio',
  [DialogType.VOICE]: 'systemMessage',
};

const SpeakManagerV2: Partial<NodeManagerConfig<Realtime.NodeData.Speak, Realtime.NodeData.SpeakBuiltInPorts>> = {
  step: SpeakStep,
  editorV2: SpeakEditor,

  getIcon: (data) => STEPS_ICON_MAP[data?.dialogs[0]?.type ?? DialogType.VOICE],
};

export default SpeakManagerV2;
