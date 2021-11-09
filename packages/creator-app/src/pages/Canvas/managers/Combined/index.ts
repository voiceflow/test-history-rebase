import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { BasicNodeManagerConfig } from '../types';
import CombinedEditor from './CombinedEditor';

const CombinedManager: BasicNodeManagerConfig<Realtime.NodeData.Combined> = {
  type: BlockType.COMBINED,

  nameEditable: true,

  editor: CombinedEditor,
};

export default CombinedManager;
