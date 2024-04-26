import type * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';

import type { NodeManagerConfigV2 } from '../types';
import { Editor, Step } from './components';
import { NODE_CONFIG } from './constants';

const IfManagerV2: NodeManagerConfigV2<Realtime.NodeData.IfV2, Realtime.NodeData.IfV2BuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Condition',

  step: Step,
  editorV2: Editor,

  tooltipText: 'Configures ‘If, then’ logic statements for funneling to paths.',
  tooltipLink: Documentation.CONDITION_STEP,
};

export default IfManagerV2;
