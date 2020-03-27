import { BlockType, PlatformType } from '@/constants';

import StreamEditor from './StreamEditor';
import StreamStep from './StreamStep';

const StreamManager = {
  type: BlockType.STREAM,
  icon: 'blocks',
  iconColor: '#4f98c6',

  editor: StreamEditor,
  step: StreamStep,

  label: 'Stream',
  tip: 'Stream long form audio files & URLs',

  chips: true,
  mergeTerminator: true,

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: [
          // google out port
          { platform: PlatformType.GOOGLE },
          // alexa "next" port
          { platform: PlatformType.ALEXA },
          // alexa "previous" port
          { platform: PlatformType.ALEXA },
        ],
      },
    },
    data: {
      name: 'Stream',
      title: '',
      description: '',
      iconImage: null,
      backgroundImage: null,
      customPause: false,
      loop: false,
    },
  }),
};

export default StreamManager;
