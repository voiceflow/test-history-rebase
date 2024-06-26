import type * as Realtime from '@voiceflow/realtime-sdk';
import { serializeToText } from '@voiceflow/slate-serializer/text';

import * as Documentation from '@/config/documentation';
import { Diagram } from '@/ducks';

import type { NodeManagerConfigV2 } from '../types';
import { NODE_CONFIG } from './constants';
import Editor from './Editor';
import CardV2Step from './Step';

const CardV2Manager: NodeManagerConfigV2<Realtime.NodeData.CardV2, Realtime.NodeData.CardV2BuiltInPorts> = {
  ...NODE_CONFIG,
  label: 'Card',

  step: CardV2Step,
  editorV2: Editor,

  getSearchParams: ({ title, description }, state) => [
    title,
    typeof description === 'string'
      ? description
      : serializeToText(description, {
          variablesMap: Diagram.active.allSlotsAndVariablesNormalizedSelector(state).byKey,
        }),
  ],

  tooltipText: 'Add card steps to your agent.',
  tooltipLink: Documentation.CARD_STEP,
};

export default CardV2Manager;
