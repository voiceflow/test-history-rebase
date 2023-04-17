import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';
import { NodeCategory } from '@/contexts/SearchContext/types';

import { BaseNodeManagerConfig } from '../types';
import CombinedEditor from './CombinedEditor';

const CombinedManager: BaseNodeManagerConfig<Realtime.NodeData.Combined> = {
  type: BlockType.COMBINED,

  searchCategory: NodeCategory.BLOCK,
  getSearchParams: (data) => [data.name],

  icon: 'goToBlock',

  editorV2: CombinedEditor,
};

export default CombinedManager;
