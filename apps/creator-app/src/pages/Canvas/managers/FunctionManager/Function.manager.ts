import type * as Realtime from '@voiceflow/realtime-sdk';

import { CMS_FUNCTIONS_LEARN_MORE } from '@/constants/link.constant';

import type { NodeManagerConfigV3 } from '../types';
import { FunctionEditor } from './FunctionEditor/Function.editor';
import { NODE_CONFIG } from './FunctionManager.constants';
import { FunctionStep } from './FunctionStep/Function.step';

const FunctionManager: NodeManagerConfigV3<Realtime.NodeData.Function> = {
  ...NODE_CONFIG,
  label: 'Function',

  step: FunctionStep,
  editorV3: FunctionEditor,

  getSearchParams: ({ name }) => [name ?? ''],

  tooltipText: 'Connect functions to your assistant.',
  tooltipLink: CMS_FUNCTIONS_LEARN_MORE,
};

export default FunctionManager;
