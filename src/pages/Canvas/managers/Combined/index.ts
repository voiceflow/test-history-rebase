import { BlockType } from '@/constants';

import { BasicNodeConfig } from '../types';
import CombinedEditor from './CombinedEditor';

const CombinedManager: BasicNodeConfig = {
  type: BlockType.COMBINED,
  nameEditable: true,

  editor: CombinedEditor,
};

export default CombinedManager;
