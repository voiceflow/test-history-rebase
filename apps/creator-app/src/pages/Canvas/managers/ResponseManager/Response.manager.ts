import type * as Realtime from '@voiceflow/realtime-sdk';

import { CMS_RESPONSE_LEARN_MORE } from '@/constants/link.constant';

import type { NodeManagerConfigV3 } from '../types';
import { ResponseEditor } from './ResponseEditor/Response.editor';
import { NODE_CONFIG } from './ResponseManager.constants';
import { ResponseStep } from './ResponseStep/Response.step';

const ResponseManager: NodeManagerConfigV3<Realtime.NodeData.Response> = {
  ...NODE_CONFIG,
  label: 'Response',

  step: ResponseStep,
  editorV3: ResponseEditor,

  tooltipText: 'Create responses for your assistant.',
  tooltipLink: CMS_RESPONSE_LEARN_MORE,
};

export default ResponseManager;
