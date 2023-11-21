import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { NodeType } from '@voiceflow/dtos';
import { DiagramEntity, DiagramNode, ToJSON } from '@voiceflow/orm-designer';

export class DiagramUtil {
  getCenterPoint(diagram: ToJSON<DiagramEntity>): [number, number] {
    const CENTER_X_OFFSET = 700;
    const CENTER_Y_OFFSET = 200;
    const CENTER_OFFSET_MULTIPLIER = 0.8;

    const startNode = Object.values(diagram.nodes).find((node) => node.type === NodeType.START);

    if (!startNode?.coords?.length) return [0, 0];

    return [(CENTER_X_OFFSET - startNode.coords![0]) * CENTER_OFFSET_MULTIPLIER, CENTER_Y_OFFSET - startNode.coords![1] * CENTER_OFFSET_MULTIPLIER];
  }

  center(diagram: ToJSON<DiagramEntity>) {
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

  cleanupNodes(diagram: ToJSON<DiagramEntity>) {
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
          Array.isArray(node.data.ports) || Utils.object.isObject(node.data.portsV2) ? this.cleanupStepPorts(node, validNodesMap) : node,
        ])
      ),
    };
  }
}
