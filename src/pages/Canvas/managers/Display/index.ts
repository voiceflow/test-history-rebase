import { BlockType, DisplayType, PlatformType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';
import DisplayEditor from './DisplayEditor';
import DisplayStep from './DisplayStep';

const DisplayManager: NodeConfig<NodeData.Display> = {
  type: BlockType.DISPLAY,
  platforms: [PlatformType.ALEXA],
  icon: 'blocks',
  iconColor: '#3c6997',

  label: 'Display',
  tip: 'Show a Multimodal Display on the screen using APL',

  step: DisplayStep,
  editor: DisplayEditor,

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: [{}],
      },
    },
    data: {
      name: 'Display',
      type: 'display',
      displayType: DisplayType.SPLASH,
      datasource: '',
      aplCommands: '',
      updateOnChange: false,
      backgroundImage: null,
      splashHeader: '',
      jsonFileName: null,
    },
  }),
};

export default DisplayManager;
