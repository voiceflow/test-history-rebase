import { BlockType, PlatformType } from '@/constants';

import DisplayEditor from './DisplayEditor';
import DisplayStep from './DisplayStep';
import { DisplayType, VERSIONS } from './constants';

const DisplayManager = {
  type: BlockType.DISPLAY,
  platforms: [PlatformType.ALEXA],
  icon: 'display',

  label: 'Display',
  tip: 'Show a Multimodal Display on the screen using APL',

  editor: DisplayEditor,
  step: DisplayStep,

  addable: true,

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
      version: VERSIONS.EDITORS_REDESIGN,
    },
  }),
};

export default DisplayManager;
