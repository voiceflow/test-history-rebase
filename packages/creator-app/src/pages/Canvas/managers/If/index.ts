import { NodeData } from '@/models';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import IfEditor from './IfEditor';
import IfStep from './IfStep';

const IfManager: NodeManagerConfig<NodeData.If> = {
  ...NODE_CONFIG,

  tip: 'Set conditions that activate paths only when true',
  label: 'Condition',

  step: IfStep,
  editor: IfEditor,
};

export default IfManager;
