import { NodeData } from '@/models';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import DeprecatedEditor from './DeprecatedEditor';
import DeprecatedStep from './DeprecatedStep';

const DeprecatedManager: NodeManagerConfig<NodeData.Deprecated> = {
  ...NODE_CONFIG,

  label: 'Deprecated',
  mergeTerminator: true,

  step: DeprecatedStep,
  editor: DeprecatedEditor,
};

export default DeprecatedManager;
