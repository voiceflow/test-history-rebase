import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../types';
import CardEditor from './CardEditor';
import CardStep from './CardStep';
import { NODE_CONFIG } from './constants';

const CardManager: NodeManagerConfig<Realtime.NodeData.Card> = {
  ...NODE_CONFIG,

  tip: 'Tell Alexa to show a card',
  label: 'Card',

  step: CardStep,
  editor: CardEditor,
};

export default CardManager;
