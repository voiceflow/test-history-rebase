import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfigV2 } from '../../types';
import ChoiceStep from './ChoiceStep';

const ChoiceManagerV2: Partial<NodeManagerConfigV2<Realtime.NodeData.Interaction, Realtime.NodeData.InteractionBuiltInPorts>> = {
  step: ChoiceStep,
};

export default ChoiceManagerV2;
