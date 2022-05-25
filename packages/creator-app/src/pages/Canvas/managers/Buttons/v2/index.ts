import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../../types';
import ButtonsStep from './ButtonsStep';
import { BUTTONS_ICON } from './constants';

const ButtonsManagerV2: Partial<NodeManagerConfig<Realtime.NodeData.Buttons, Realtime.NodeData.ButtonsBuiltInPorts>> = {
  icon: BUTTONS_ICON,
  step: ButtonsStep,
};

export default ButtonsManagerV2;
