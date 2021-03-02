import { NodeData } from '@/models';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import StreamEditor from './StreamEditor';
import StreamStep from './StreamStep';

const StreamManager: NodeManagerConfig<NodeData.Stream> = {
  ...NODE_CONFIG,

  tip: 'Stream long form audio files & URLs',
  label: 'Stream',
  chips: true,

  step: StreamStep,
  editor: StreamEditor,
};

export default StreamManager;
