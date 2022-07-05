import * as Realtime from '@voiceflow/realtime-sdk';

import { RESPONSE_STEPS_LINK } from '@/constants';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import StreamEditor from './StreamEditor';
import StreamStep from './StreamStep';

const StreamManager: NodeManagerConfig<Realtime.NodeData.Stream, Realtime.NodeData.StreamBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Stream',

  step: StreamStep,
  editor: StreamEditor,

  tooltipText: 'Add a stream to your assistant.',
  tooltipLink: RESPONSE_STEPS_LINK,
};

export default StreamManager;
