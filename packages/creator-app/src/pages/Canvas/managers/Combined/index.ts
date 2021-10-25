import { BlockType } from '@/constants';
import { NodeData } from '@/models';

import { BasicNodeManagerConfig } from '../types';
import CombinedEditor from './CombinedEditor';

const CombinedManager: BasicNodeManagerConfig<NodeData.Combined> = {
  type: BlockType.COMBINED,

  nameEditable: true,

  editor: CombinedEditor,
};

export default CombinedManager;
