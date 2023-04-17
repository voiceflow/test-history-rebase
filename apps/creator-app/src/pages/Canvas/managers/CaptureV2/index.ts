import * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';
import { NodeCategory } from '@/contexts/SearchContext/types';
import { slotByIDSelector } from '@/ducks/slotV2';

import { NodeManagerConfigV2 } from '../types';
import { Editor, Step } from './components';
import { NODE_CONFIG } from './constants';

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

  tooltipText: "Capture and record all or part of a user's utterance within a variable.",
  tooltipLink: Documentation.CAPTURE_STEP,
};

export default CaptureV2Manager;
