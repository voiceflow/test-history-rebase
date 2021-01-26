import { CanvasVisibility, VisualType } from '@voiceflow/general-types/build/nodes/visual';

import { BlockType, PlatformType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';
import VisualEditor from './VisualEditor';
import VisualStep from './VisualStep';

const VisualManager: NodeConfig<NodeData.Visual> = {
  type: BlockType.VISUAL,
  platforms: [PlatformType.GENERAL],
  icon: 'display',
  iconColor: '#3C6997',

  label: 'Visuals',

  step: VisualStep,
  editor: VisualEditor,

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: [{}],
      },
    },
    data: {
      name: 'Visuals',
      image: null,
      device: null,
      dimensions: null,
      visualType: VisualType.IMAGE,
      canvasVisibility: CanvasVisibility.FULL,
    },
  }),
};

export default VisualManager;
