import { BlockType } from '@/constants';

import { BasicNodeManagerConfig } from '../types';
import CombinedEditor from './CombinedEditor';

const CombinedManager: BasicNodeManagerConfig = {
  type: BlockType.COMBINED,
  nameEditable: true,

  editor: CombinedEditor,
};

export default CombinedManager;
