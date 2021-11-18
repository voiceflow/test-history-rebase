import { BlockType, BlockVariant } from '@realtime-sdk/constants';
import { AnyRecord, Models as BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';

export interface DiagramFactoryOptions {
  name: string;
  intentStepIDs?: string[];
}

export type PrimitiveDiagram<T extends BaseModels.BaseDiagramNode = BaseModels.BaseDiagramNode> = Required<
  Omit<BaseModels.Diagram<T>, '_id' | 'creatorID' | 'versionID'>
>;

export const getUniqueCopyName = (originalName: string, existingNames: string[]) => {
  let uniqueName = existingNames.includes(originalName) ? `${originalName} (COPY)` : originalName;
  let index = 1;

  while (existingNames.includes(uniqueName)) {
    uniqueName = `${originalName} (COPY ${index})`;
    index++;
  }

  return uniqueName;
};

export const startNodeFactory = (coords: [number, number] = [360, 120]): BaseModels.BaseDiagramNode<AnyRecord> => ({
  nodeID: Utils.id.objectID(),
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

export const diagramFactory = <T extends BaseModels.BaseDiagramNode>({
  name,
  type,
  nodes,
  intentStepIDs = [],
}: DiagramFactoryOptions & {
  type: BaseModels.DiagramType;
  nodes: BaseModels.BaseDiagramNode[];
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
    type: BaseModels.DiagramType.COMPONENT,
    nodes: [startNodeFactory(startNodeCoords)],
  });

export const topicDiagramFactory = (name: string) => {
  const intentNodeID = Utils.id.objectID();

  return diagramFactory({
    name,
    type: BaseModels.DiagramType.TOPIC,
    intentStepIDs: [intentNodeID],
    nodes: [
      {
        type: 'block',
        nodeID: Utils.id.objectID(),
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
