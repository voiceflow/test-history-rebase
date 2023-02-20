import { BlockType, START_NODE_COLOR } from '@realtime-sdk/constants';
import { AnyRecord, BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';

export interface DiagramFactoryOptions {
  name: string;
  menuItems?: BaseModels.Diagram.MenuItem[];
}

export type PrimitiveDiagram<T extends BaseModels.BaseDiagramNode = BaseModels.BaseDiagramNode> = Required<
  Omit<BaseModels.Diagram.Model<T>, '_id' | 'creatorID' | 'versionID' | 'intentStepIDs' | 'menuNodeIDs' | 'children'>
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
  type: BlockType.START,
  nodeID: Utils.id.objectID(),
  coords,
  data: {
    name: 'Start',
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
  menuItems = [],
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
  menuItems,
});

export const componentDiagramFactory = (name: string, startNodeCoords?: [number, number]) =>
  diagramFactory({
    name,
    type: BaseModels.Diagram.DiagramType.COMPONENT,
    nodes: [startNodeFactory(startNodeCoords)],
  });

export const rootTopicDiagramFactory = (name: string, startNodeCoords?: [number, number]) => {
  const startNode = startNodeFactory(startNodeCoords);

  return diagramFactory({
    name,
    type: BaseModels.Diagram.DiagramType.TOPIC,
    nodes: [startNode],
    menuItems: [{ type: BaseModels.Diagram.MenuItemType.NODE, sourceID: startNode.nodeID }],
  });
};

export const topicDiagramFactory = (name: string) => {
  const intentNodeID = Utils.id.objectID();

  return diagramFactory({
    name,
    type: BaseModels.Diagram.DiagramType.TOPIC,
    menuItems: [{ type: BaseModels.Diagram.MenuItemType.NODE, sourceID: intentNodeID }],
    nodes: [
      {
        type: BaseModels.BaseNodeType.BLOCK,
        nodeID: Utils.id.objectID(),
        coords: [360, 120],
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
