import * as Realtime from '@voiceflow/realtime-sdk';

import { CMS_FUNCTIONS_LEARN_MORE } from '@/constants/link.constant';

import { NodeManagerConfigV2 } from '../types';
import { FunctionEditor } from './FunctionEditor/Function.editor';
import { NODE_CONFIG } from './FunctionManager.constants';
import { FunctionStep } from './FunctionStep/Function.step';

const FunctionManager: NodeManagerConfigV2<Realtime.NodeData.Function> = {
  ...NODE_CONFIG,
  label: 'Function',

  step: FunctionStep,
  editorV2: FunctionEditor,

  getSearchParams: ({ name }) => [name ?? ''],

  tooltipText: 'Connect functions to your assistant.',
  tooltipLink: CMS_FUNCTIONS_LEARN_MORE,
};

export default FunctionManager;
