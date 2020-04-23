import { BlockType } from '@/constants';

import { BasicNodeConfig } from '../types';
import CombinedEditor from './CombinedEditor';

const CombinedManager: BasicNodeConfig = {
  type: BlockType.COMBINED,

  editor: CombinedEditor,
};

export default CombinedManager;
