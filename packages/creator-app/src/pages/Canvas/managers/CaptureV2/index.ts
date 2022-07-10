import * as Realtime from '@voiceflow/realtime-sdk';

import { INPUT_STEPS_LINK } from '@/constants';
import { NodeCategory } from '@/contexts/SearchContext/types';
import { slotByIDSelector } from '@/ducks/slotV2';

import { NodeManagerConfigV2 } from '../types';
import { Editor } from './components';
import { NODE_CONFIG } from './constants';
import { Step } from './v2';

const CaptureV2Manager: NodeManagerConfigV2<Realtime.NodeData.CaptureV2, Realtime.NodeData.CaptureV2BuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Capture',

  step: Step,
  editorV2: Editor,

  searchCategory: NodeCategory.USER_INPUT,
  getSearchParams: (data, state) => {
    const targets: string[] = [];
    data.intent?.slots.forEach((intentSlot) => {
      const slot = slotByIDSelector(state, { id: intentSlot.id });
      if (slot) targets.push(`Capture {${slot.name}}`);
    });
    return targets;
  },

  tooltipText: 'Add capture steps to your assistant.',
  tooltipLink: INPUT_STEPS_LINK,
};

export default CaptureV2Manager;
