import { BlockType, START_NODE_COLOR, START_NODE_POSITION } from '@realtime-sdk/constants';
import { BaseModels } from '@voiceflow/base-types';
import type { AnyRecord } from '@voiceflow/common';
import { Utils } from '@voiceflow/common';

export interface DiagramFactoryOptions {
  name: string;
}

export type PrimitiveDiagram<T extends BaseModels.BaseDiagramNode = BaseModels.BaseDiagramNode> = Required<
  Omit<
    BaseModels.Diagram.Model<T>,
    '_id' | 'creatorID' | 'versionID' | 'intentStepIDs' | 'menuNodeIDs' | 'children' | 'diagramID' | 'menuItems'
  >
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

export const startNodeFactory = ({
  name = 'Start',
  coords = START_NODE_POSITION,
}: { name?: string; coords?: [number, number] } = {}): BaseModels.BaseDiagramNode<AnyRecord> => ({
  type: BlockType.START,
  nodeID: Utils.id.objectID(),
  coords,
  data: {
    name,
    color: START_NODE_COLOR,
    portsV2: {
      byKey: {},
      builtIn: {
        [BaseModels.PortType.NEXT]: {
          id: Utils.id.objectID(),
          type: BaseModels.PortType.NEXT,
          target: null,
        },
      },
      dynamic: [],
    },
  },
});

export const diagramFactory = <T extends BaseModels.BaseDiagramNode>({
  name,
  type,
  nodes,
}: DiagramFactoryOptions & {
  type: BaseModels.Diagram.DiagramType;
  nodes: BaseModels.BaseDiagramNode[];
}): PrimitiveDiagram<T> => ({
  name,
  type,
  zoom: 100,
  nodes: nodes.reduce((acc, node) => Object.assign(acc, { [node.nodeID]: node }), {}),
  offsetX: 0,
  offsetY: 0,
  modified: Utils.time.getCurrentTimestamp(),
  variables: [],
});

export const componentDiagramFactory = (name: string, startNodeCoords?: [number, number]) =>
  diagramFactory({
    name,
    type: BaseModels.Diagram.DiagramType.COMPONENT,
    nodes: [startNodeFactory({ name: 'Continue', coords: startNodeCoords })],
  });

export const topicDiagramFactory = (name: string, intentNodeCoords = START_NODE_POSITION) => {
  const intentNodeID = Utils.id.objectID();

  return diagramFactory({
    name,
    type: BaseModels.Diagram.DiagramType.TOPIC,
    nodes: [
      {
        type: BaseModels.BaseNodeType.BLOCK,
        nodeID: Utils.id.objectID(),
        coords: intentNodeCoords,
        data: {
          name: '',
          color: '',
          steps: [intentNodeID],
        },
      },
      {
        type: BlockType.INTENT,
        nodeID: intentNodeID,
        data: {
          intent: null,
          mappings: [],
          portsV2: {
            byKey: {},
            builtIn: {
              [BaseModels.PortType.NEXT]: {
                id: Utils.id.objectID(),
                type: BaseModels.PortType.NEXT,
                target: null,
              },
            },
            dynamic: [],
          },
        },
      },
    ],
  });
};

export const templateDiagramFactory = (name = 'Template Diagram') =>
  diagramFactory({
    name,
    type: BaseModels.Diagram.DiagramType.TEMPLATE,
    nodes: [startNodeFactory()],
  });
