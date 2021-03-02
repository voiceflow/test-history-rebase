import { PlatformType } from '@/constants';
import { NodeData } from '@/models';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import VisualEditor from './VisualEditor';
import VisualStep from './VisualStep';

const VisualManager: NodeManagerConfig<NodeData.Visual> = {
  ...NODE_CONFIG,

  label: 'Visuals',
  platforms: [PlatformType.GENERAL],

  step: VisualStep,
  editor: VisualEditor,
};

export default VisualManager;
