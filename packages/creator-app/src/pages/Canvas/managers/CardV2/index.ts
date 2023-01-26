import * as Realtime from '@voiceflow/realtime-sdk';
import { serializeToText } from '@voiceflow/slate-serializer/text';

import * as Documentation from '@/config/documentation';

import { NodeManagerConfigV2 } from '../types';
import { NODE_CONFIG } from './constants';
import Editor from './Editor';
import CardV2Step from './Step';

const CardV2Manager: NodeManagerConfigV2<Realtime.NodeData.CardV2, Realtime.NodeData.CardV2BuiltInPorts> = {
  ...NODE_CONFIG,
  label: 'Card',

  step: CardV2Step,
  editorV2: Editor,

  getSearchParams: ({ title, description }) => [title, typeof description === 'string' ? description : serializeToText(description)],

  tooltipText: 'Add card steps to your assistant.',
  tooltipLink: Documentation.CARD_STEP,
};

export default CardV2Manager;
