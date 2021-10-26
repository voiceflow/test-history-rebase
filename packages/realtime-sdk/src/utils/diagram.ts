import { AnyRecord, BaseDiagramNode, Diagram, DiagramType } from '@voiceflow/api-sdk';

import { BlockType, BlockVariant } from '../constants';
import { objectID } from './id';

export interface DiagramFactoryOptions {
  name: string;
  intentStepIDs?: string[];
}

export type PrimitiveDiagram<T extends BaseDiagramNode = BaseDiagramNode> = Required<Omit<Diagram<T>, '_id' | 'creatorID' | 'versionID'>>;

export const getUniqueCopyName = (originalName: string, existingNames: string[]) => {
  let uniqueName = existingNames.includes(originalName) ? `${originalName} (COPY)` : originalName;
  let index = 1;

  while (existingNames.includes(uniqueName)) {
    uniqueName = `${originalName} (COPY ${index})`;
    index++;
  }

  return uniqueName;
};

export const startNodeFactory = (coords: [number, number] = [360, 120]): BaseDiagramNode<AnyRecord> => ({
  nodeID: objectID(),
  type: BlockType.START,
  coords,
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
});

export const diagramFactory = <T extends BaseDiagramNode>({
  name,
  type,
  nodes,
  intentStepIDs = [],
}: DiagramFactoryOptions & {
  type: DiagramType;
  nodes: BaseDiagramNode[];
}): PrimitiveDiagram<T> => ({
  name,
  type,
  zoom: 100,
  offsetX: 0,
  offsetY: 0,
  modified: 0,
  nodes: nodes.reduce((acc, node) => Object.assign(acc, { [node.nodeID]: node }), {}),
  children: nodes.map((node) => node.nodeID),
  variables: [],
  intentStepIDs,
});

export const componentDiagramFactory = (name: string, startNodeCoords?: [number, number]) =>
  diagramFactory({
    name,
    type: DiagramType.COMPONENT,
    nodes: [startNodeFactory(startNodeCoords)],
  });

export const topicDiagramFactory = (name: string) => {
  const intentNodeID = objectID();

  return diagramFactory({
    name,
    type: DiagramType.TOPIC,
    intentStepIDs: [intentNodeID],
    nodes: [
      {
        type: 'block',
        nodeID: objectID(),
        coords: [360, 120],
        data: {
          name,
          color: BlockVariant.STANDARD,
          steps: [intentNodeID],
        },
      },
      {
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
    ],
  });
};
