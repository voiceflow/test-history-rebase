import { GENERAL_PLATFORMS } from '@/constants';
import { NodeData } from '@/models';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import VisualEditor from './VisualEditor';
import VisualStep from './VisualStep';

const VisualManager: NodeManagerConfig<NodeData.Visual> = {
  ...NODE_CONFIG,

  label: 'Visuals',
  platforms: GENERAL_PLATFORMS,

  step: VisualStep,
  editor: VisualEditor,
};

export default VisualManager;
