import { BlockType, PlatformType } from '@/constants';

import DisplayEditor from './DisplayEditor';

const DisplayManager = {
  type: BlockType.DISPLAY,
  editor: DisplayEditor,
  platforms: [PlatformType.ALEXA],
  icon: 'display',

  label: 'Display',
  tip: 'Show a Multimodal Display on the screen using APL',

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
      displayID: null,
      datasource: '',
      aplCommands: '',
      updateOnChange: false,
    },
  }),
};

export default DisplayManager;
