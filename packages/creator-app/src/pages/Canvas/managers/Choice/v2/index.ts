import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfigV2 } from '../../types';
import ChoiceStep from './ChoiceStep';
import { CHOICE_ICON } from './constants';

const ChoiceManagerV2: Partial<NodeManagerConfigV2<Realtime.NodeData.Interaction, Realtime.NodeData.InteractionBuiltInPorts>> = {
  icon: CHOICE_ICON,
  step: ChoiceStep,
};

export default ChoiceManagerV2;
