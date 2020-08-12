import { BlockType } from '@/constants';
import { BlockVariant } from '@/constants/canvas';

import { PrimativeDiagram } from './types';

// eslint-disable-next-line import/prefer-default-export
export const DEFAULT_DIAGRAM: PrimativeDiagram = {
  offsetX: 0,
  offsetY: 0,
  zoom: 100,
  variables: [],
  nodes: {
    start00000000000000000000: {
      nodeID: 'start00000000000000000000',
      type: BlockType.START,
      coords: [360, 120],
      data: {
        name: 'Start',
        color: BlockVariant.STANDARD,
        ports: [
          {
            type: '',
            target: null,
          },
        ],
      },
    },
  },
};
