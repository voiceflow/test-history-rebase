import type * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';

import type { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import StreamEditor from './StreamEditor';
import StreamStep from './StreamStep';

const StreamManager: NodeManagerConfig<Realtime.NodeData.Stream, Realtime.NodeData.StreamBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Stream',

  step: StreamStep,
  editor: StreamEditor,

  tooltipText: 'Streams longer audio files and visuals.',
  tooltipLink: Documentation.STREAM_STEP,
};

export default StreamManager;
