import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfigV2 } from '../types';
import { NODE_CONFIG } from './constants';
import Editor from './Editor';
import CardStep from './Step';

const CardManager: NodeManagerConfigV2<Realtime.NodeData.CardV2, Realtime.NodeData.CardV2BuiltInPorts> = {
  ...NODE_CONFIG,
  label: 'Carousel',

  step: CardStep,
  editorV2: Editor,
};

export default CardManager;
