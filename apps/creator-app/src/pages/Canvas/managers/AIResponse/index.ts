import * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';
import { NodeCategory } from '@/contexts/SearchContext/types';

import { NodeManagerConfigV2 } from '../types';
import { Editor, Step } from './components';
import { NODE_CONFIG } from './constants';

const AIResponseManager: NodeManagerConfigV2<Realtime.NodeData.AIResponse, Realtime.NodeData.AIResponseBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Response AI',

  step: Step,
  editorV2: Editor,

  searchCategory: NodeCategory.RESPONSES,
  getSearchParams: (data) => [data.prompt],

  tooltipText: 'Generate responses at runtime using AI.',
  tooltipLink: Documentation.AI_RESPONSE_STEP,
};

export default AIResponseManager;
