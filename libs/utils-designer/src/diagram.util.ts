import { Utils } from '@voiceflow/common';
import type { Diagram, DiagramNode } from '@voiceflow/dtos';
import { DiagramType, START_NODE_POSITION } from '@voiceflow/dtos';

import { blockNodeFactory, startNodeFactory, triggerNodeFactory } from './node.util';

export const getUniqueDiagramCopyName = (originalName: string, existingNames: string[]) => {
  let uniqueName = existingNames.includes(originalName) ? `${originalName} (COPY)` : originalName;
  let index = 1;

  while (existingNames.includes(uniqueName)) {
    uniqueName = `${originalName} (COPY ${index})`;
    index++;
  }

  return uniqueName;
};

interface BaseDiagramPayloadFactoryOptions<Node extends DiagramNode> {
  name: string;
  type: DiagramType;
  nodes: Node[];
}

type DiagramPayload = Omit<Diagram, '_id' | 'creatorID' | 'versionID' | 'diagramID'>;

const diagramPayloadFactory = <T extends DiagramNode>({
  name,
  type,
  nodes,
}: BaseDiagramPayloadFactoryOptions<T>): DiagramPayload => ({
  name,
  type,
  zoom: 100,
  nodes: Object.fromEntries(nodes.map((node) => [node.nodeID, node])),
  offsetX: 0,
  offsetY: 0,
  modified: Utils.time.getCurrentTimestamp(),
  variables: [],
});

export const componentDiagramPayloadFactory = ({
  startNode,
  diagramName,
}: {
  startNode?: { name?: string; coords?: [number, number]; color?: string };
  diagramName: string;
}) =>
  diagramPayloadFactory({
    name: diagramName,
    type: DiagramType.COMPONENT,
    nodes: [
      startNodeFactory({
        coords: startNode?.coords ?? START_NODE_POSITION,
        data: { name: startNode?.name ?? 'Enter', color: startNode?.color },
      }),
    ],
  });

export const topicDiagramPayloadFactory = ({
  diagramName,
  triggerNodeName,
  triggerNodeCoords = START_NODE_POSITION,
}: {
  diagramName: string;
  triggerNodeName?: string;
  triggerNodeCoords?: [number, number];
}) => {
  const triggerNodeID = Utils.id.objectID();

  return diagramPayloadFactory({
    name: diagramName,
    type: DiagramType.TOPIC,
    nodes: [
      blockNodeFactory({ data: { name: triggerNodeName, steps: [triggerNodeID] }, coords: triggerNodeCoords }),
      triggerNodeFactory({ nodeID: triggerNodeID }),
    ],
  });
};

export const templateDiagramPayloadFactory = ({ name = 'Template Diagram' }: { name?: string } = {}) =>
  diagramPayloadFactory({ name, type: DiagramType.TEMPLATE, nodes: [startNodeFactory()] });
