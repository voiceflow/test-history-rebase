import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { BaseNodeManagerConfig } from '../types';
import CombinedEditor from './CombinedEditor';

const CombinedManager: BaseNodeManagerConfig<Realtime.NodeData.Combined> = {
  type: BlockType.COMBINED,

  editor: CombinedEditor,
};

export default CombinedManager;
