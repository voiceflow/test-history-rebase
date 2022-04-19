import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../types';
import CardEditor from './CardEditor';
import CardStep from './CardStep';
import { NODE_CONFIG } from './constants';

const CardManager: NodeManagerConfig<Realtime.NodeData.CardV2, Realtime.NodeData.CardV2BuiltInPorts> = {
  ...NODE_CONFIG,
  label: 'Card',

  step: CardStep,
  editor: CardEditor,
};

export default CardManager;
