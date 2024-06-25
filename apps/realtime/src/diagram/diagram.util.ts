import { Injectable } from '@nestjs/common';
import type { BaseModels, BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import type { DiagramNode } from '@voiceflow/dtos';
import { NodeType } from '@voiceflow/dtos';
import type { DiagramJSON } from '@voiceflow/orm-designer';

@Injectable()
export class DiagramUtil {
  getCenterPoint<T extends Pick<DiagramJSON, 'nodes'>>(diagram: T): [number, number] {
    const CENTER_X_OFFSET = 700;
    const CENTER_Y_OFFSET = 300;
    const CENTER_OFFSET_MULTIPLIER = 0.8;

    const startNode = Object.values(diagram.nodes).find((node) => node.type === NodeType.START);

    if (!startNode?.coords?.length) return [0, 0];

    return [
      (CENTER_X_OFFSET - startNode.coords![0]) * CENTER_OFFSET_MULTIPLIER,
      CENTER_Y_OFFSET - startNode.coords![1] * CENTER_OFFSET_MULTIPLIER,
    ];
  }

  center<T extends Pick<DiagramJSON, 'nodes' | 'offsetX' | 'offsetY'>>(diagram: T): T {
    const centeredPosition = this.getCenterPoint(diagram);

    const [offsetX, offsetY] = centeredPosition;

    return { ...diagram, offsetX, offsetY };
  }

  isNodeWithSteps(
    node: DiagramNode
  ): node is BaseModels.BaseBlock | BaseModels.BaseActions | (BaseNode.Start.Step & { data?: { steps?: string[] } }) {
    return node.type === NodeType.BLOCK || node.type === NodeType.ACTIONS || node.type === NodeType.START;
  }

  cleanupStepPorts(node: DiagramNode, validNodesMap: Map<string, boolean>): DiagramNode {
    const cleanPortTarget = (port: BaseModels.BasePort): BaseModels.BasePort => ({
      ...port,
      target: port.target && validNodesMap.has(port.target) ? port.target : null,
    });

    if (node.data.portsV2) {
      const byKey = Utils.object.mapValue(node.data.portsV2.byKey ?? {}, cleanPortTarget);
      const builtIn = Utils.object.mapValue(node.data.portsV2.builtIn ?? {}, cleanPortTarget);
      const dynamic = node.data.portsV2.dynamic?.map(cleanPortTarget) ?? [];

      return { ...node, data: { ...node.data, portsV2: { byKey, builtIn, dynamic } } };
    }

    return { ...node, data: { ...node.data, ports: node.data.ports.map(cleanPortTarget) } };
  }

  cleanupNodes<T extends Pick<DiagramJSON, 'nodes'>>(diagram: T): T {
    const validNodesMap = new Map<string, boolean>();

    const cleanedNodes = Object.entries(diagram.nodes).reduce<[string, DiagramNode][]>((acc, [nodeID, node]) => {
      if (!this.isNodeWithSteps(node)) {
        acc.push([nodeID, node]);

        validNodesMap.set(node.nodeID, true);

        return acc;
      }

      const isStartNode = node.type === NodeType.START;

      const steps = node.data.steps?.filter((stepID) => Utils.object.hasProperty(diagram.nodes, stepID)) ?? [];

      if (!steps.length && !isStartNode) return acc;

      acc.push([nodeID, { ...node, data: { ...node.data, steps } }]);

      validNodesMap.set(node.nodeID, true);
      return acc;
    }, []);

    return {
      ...diagram,
      nodes: Object.fromEntries(
        cleanedNodes.map(([nodeID, node]) => [
          nodeID,
          Array.isArray(node.data.ports) || Utils.object.isObject(node.data.portsV2)
            ? this.cleanupStepPorts(node, validNodesMap)
            : node,
        ])
      ),
    };
  }

  removeStartNode(nodes: DiagramJSON['nodes']): DiagramJSON['nodes'] {
    const startNode = Object.values(nodes).find((node) => node.type === NodeType.START);

    if (!startNode) return nodes;

    return Utils.object.omit(nodes, [startNode.nodeID]);
  }
}
