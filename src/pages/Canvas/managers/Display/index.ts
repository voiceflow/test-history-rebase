import { APLType, VisualType } from '@voiceflow/general-types/build/nodes/visual';

import { BlockType, PlatformType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';
import VisualEditor from '../Visual/VisualEditor';
import VisualStep from '../Visual/VisualStep';

const DisplayManager: NodeConfig<NodeData.Visual> = {
  type: BlockType.DISPLAY,
  platforms: [PlatformType.ALEXA],
  icon: 'blocks',
  iconColor: '#3c6997',

  label: 'Display',
  tip: 'Show a Multimodal Display on the screen using APL',

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
      name: 'Display',
      title: '',
      aplType: APLType.SPLASH,
      visualType: VisualType.APL,
      imageURL: '',
      document: '',
      datasource: '',
      jsonFileName: '',
    },
  }),
};

export default DisplayManager;
