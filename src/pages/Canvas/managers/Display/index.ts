import { BlockType, DisplayType, PlatformType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';
import DisplayEditor from './DisplayEditor';
import DisplayStep from './DisplayStep';
import { VERSIONS } from './constants';

const DisplayManager: NodeConfig<NodeData.Display> = {
  type: BlockType.DISPLAY,
  platforms: [PlatformType.ALEXA],
  icon: 'blocks',
  iconColor: '#3c6997',
  addable: true,

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
      displayID: null,
      datasource: '',
      aplCommands: '',
      updateOnChange: false,
      backgroundImage: null,
      splashHeader: '',
      jsonFileName: null,
      version: VERSIONS.EDITORS_REDESIGN as any,
    },
  }),
};

export default DisplayManager;
