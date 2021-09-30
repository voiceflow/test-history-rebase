import { DiagramType } from '@voiceflow/api-sdk';

import { BlockType } from '@/constants';
import { BlockVariant } from '@/constants/canvas';
import { objectID } from '@/utils';

import { PrimitiveComponentDiagram, PrimitiveDiagram, PrimitiveTopicDiagram } from './types';

export const STATE_KEY = 'diagram';

const generateDefaultDiagram = (): PrimitiveDiagram => ({
  zoom: 100,
  nodes: {},
  offsetX: 0,
  offsetY: 0,
  children: [],
  variables: [],
  intentStepIDs: [],
});

export const generateDefaultComponentDiagram = (): PrimitiveComponentDiagram => {
  const startNodeID = objectID();

  return {
    ...generateDefaultDiagram(),
    type: DiagramType.COMPONENT,
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

export const generateDefaultTopicDiagram = (name: string): PrimitiveTopicDiagram => {
  const intentNodeID = objectID();
  const combinedNodeID = objectID();

  return {
    ...generateDefaultDiagram(),
    type: DiagramType.TOPIC,
    intentStepIDs: [intentNodeID],
    nodes: {
      [intentNodeID]: {
        type: 'block',
        nodeID: combinedNodeID,
        coords: [360, 120],
        data: {
          name,
          color: BlockVariant.STANDARD,
          steps: [intentNodeID],
        },
      },
      [intentNodeID]: {
        type: BlockType.INTENT,
        nodeID: intentNodeID,
        data: {
          intent: null,
          mappings: [],
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
