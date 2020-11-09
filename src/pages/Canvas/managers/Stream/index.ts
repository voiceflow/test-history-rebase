import { BlockType } from '@/constants';
import { PortType } from '@/constants/canvas';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';
import StreamEditor from './StreamEditor';
import StreamStep from './StreamStep';

const StreamManager: NodeConfig<NodeData.Stream> = {
  type: BlockType.STREAM,
  icon: 'blocks',
  iconColor: '#4f98c6',
  chips: true,
  mergeTerminator: true,

  label: 'Stream',
  tip: 'Stream long form audio files & URLs',

  step: StreamStep,
  editor: StreamEditor,

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: [
          { label: PortType.NEXT, target: null },
          { label: PortType.PREVIOUS, target: null },
          { label: PortType.PAUSE, target: null },
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
      audio: '',
    },
  }),
};

export default StreamManager;
