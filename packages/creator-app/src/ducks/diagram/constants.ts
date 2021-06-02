import { BlockType } from '@/constants';
import { BlockVariant } from '@/constants/canvas';
import { objectID } from '@/utils';

import { PrimitiveDiagram } from './types';

export const STATE_KEY = 'diagram';

export const generateDefaultDiagram = (): PrimitiveDiagram => {
  const startNodeID = objectID();

  return {
    offsetX: 0,
    offsetY: 0,
    zoom: 100,
    variables: [],
    children: [],
    nodes: {
      [startNodeID]: {
        nodeID: startNodeID,
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
};
