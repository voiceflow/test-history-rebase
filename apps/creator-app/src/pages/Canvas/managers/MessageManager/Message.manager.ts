import * as Realtime from '@voiceflow/realtime-sdk';

import { CMS_RESPONSE_LEARN_MORE } from '@/constants/link.constant';

import { NodeManagerConfigV3 } from '../types';
import { MessageEditor } from './MessageEditor/Message.editor';
import { NODE_CONFIG } from './MessageManager.constants';
import { MessageStep } from './MessageStep/Message.step';

const MessageManager: NodeManagerConfigV3<Realtime.NodeData.Message> = {
  ...NODE_CONFIG,
  label: 'Message',

  step: MessageStep,
  editorV3: MessageEditor,

  tooltipText: 'Create responses for your assistant.',
  tooltipLink: CMS_RESPONSE_LEARN_MORE,
};

export default MessageManager;
