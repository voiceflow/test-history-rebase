import type * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';

import type { NodeManagerConfig } from '../types';
import CardEditor from './CardEditor';
import CardStep from './CardStep';
import { NODE_CONFIG } from './constants';

const CardManager: NodeManagerConfig<Realtime.NodeData.Card, Realtime.NodeData.CardBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Card',

  step: CardStep,
  editor: CardEditor,

  tooltipText: 'Displays a multi-modal card to your users.',
  tooltipLink: Documentation.CARD_STEP,
};

export default CardManager;
