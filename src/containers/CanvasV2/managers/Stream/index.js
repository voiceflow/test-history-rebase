import { BlockType, PlatformType } from '@/constants';

import StreamEditor from './StreamEditor';

const StreamManager = {
  type: BlockType.STREAM,
  editor: StreamEditor,
  icon: 'play',

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
      title: [],
      description: [],
      iconImage: null,
      backgroundImage: null,
      customPause: false,
      loop: false,
    },
  }),
};

export default StreamManager;
