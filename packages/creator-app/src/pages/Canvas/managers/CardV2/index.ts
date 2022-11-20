import * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';
import { serializeSlateToText } from '@/utils/slate';

import { NodeManagerConfigV2 } from '../types';
import { NODE_CONFIG } from './constants';
import Editor from './Editor';
import CardV2Step from './Step';

const CardV2Manager: NodeManagerConfigV2<Realtime.NodeData.CardV2, Realtime.NodeData.CardV2BuiltInPorts> = {
  ...NODE_CONFIG,
  label: 'Card',

  step: CardV2Step,
  editorV2: Editor,

  getSearchParams: ({ title, description }) => [title, typeof description === 'string' ? description : serializeSlateToText(description)],

  tooltipText: 'Add card steps to your assistant.',
  tooltipLink: Documentation.CAROUSEL_STEP,
};

export default CardV2Manager;
