import * as Realtime from '@voiceflow/realtime-sdk';
import { SVG } from '@voiceflow/ui';

import { RESPONSE_STEPS_LINK } from '@/constants';

import { NodeManagerConfig } from '../types';
import CardEditor from './CardEditor';
import CardStep from './CardStep';
import { NODE_CONFIG } from './constants';

const CardManager: NodeManagerConfig<Realtime.NodeData.Card, Realtime.NodeData.CardBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Card',

  step: CardStep,
  editor: CardEditor,

  stepsMenuIcon: SVG.systemCard,
  tooltipText: 'Add cards to your assistant.',
  tooltipLink: RESPONSE_STEPS_LINK,
};

export default CardManager;
