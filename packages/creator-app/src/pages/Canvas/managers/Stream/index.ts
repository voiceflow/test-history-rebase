import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import StreamEditor from './StreamEditor';
import StreamStep from './StreamStep';

const StreamManager: NodeManagerConfig<Realtime.NodeData.Stream, Realtime.NodeData.StreamBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Stream',

  step: StreamStep,
  editor: StreamEditor,
};

export default StreamManager;
