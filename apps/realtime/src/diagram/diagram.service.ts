import { Inject, Injectable } from '@nestjs/common';
import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { AnyRecord } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { DiagramORM } from '../orm/diagram.orm';
import { PrimitiveDiagram } from './diagram.interface';

const CENTER_OFFSET_MULTIPLIER = 0.8;
const CENTER_X_OFFSET = 700;
const CENTER_Y_OFFSET = 200;

@Injectable()
export class DiagramService {
  constructor(@Inject(DiagramORM) private orm: DiagramORM) {}

  public async get(diagramID: string): Promise<BaseModels.Diagram.Model> {
    return this.orm.findByID(diagramID);
  }

  public async patch(diagramID: string, data: BaseModels.Diagram.Model): Promise<void> {
    await this.orm.updateByID(diagramID, data);
  }

  public async create(data: PrimitiveDiagram): Promise<BaseModels.Diagram.Model> {
    return this.orm.create(data);
  }

  public async getAll(versionID: string) {
    return this.orm.findManyByVersionID(versionID);
  }

  public getSharedNodes(diagrams: BaseModels.Diagram.Model[]): Realtime.diagram.sharedNodes.DiagramSharedNodeMap {
    const sharedNodes: Realtime.diagram.sharedNodes.DiagramSharedNodeMap = {};

    diagrams.forEach((diagram) => {
      const diagramSharedNode: Realtime.diagram.sharedNodes.SharedNodeMap = {};

      sharedNodes[diagram._id] = diagramSharedNode;

      Object.values(diagram.nodes).forEach((node) => {
        const sharedNode = this.sharedNodeMapper(node);

        if (!sharedNode) return;

        diagramSharedNode[sharedNode.nodeID] = sharedNode;
      });
    });

    return sharedNodes;
  }

  public async createMany(diagrams: BaseModels.Diagram.Model<BaseModels.BaseDiagramNode<AnyRecord>>[]) {
    return this.orm.insertMany(diagrams);
  }

  public async findManyByVersionID(versionID: string): Promise<BaseModels.Diagram.Model[]> {
    return this.orm.findManyByVersionID(versionID);
  }

  public getCenteredDiagramPosition(diagramNodes: Record<string, BaseModels.BaseDiagramNode>): number[] {
    const startNode = Object.entries(diagramNodes || {})
      .flatMap(([, nodes]) => nodes)
      .find((node) => node.type === BaseNode.NodeType.START);

    if (!startNode?.coords?.length) return [0, 0];

    return [(CENTER_X_OFFSET - startNode.coords![0]) * CENTER_OFFSET_MULTIPLIER, CENTER_Y_OFFSET - startNode.coords![1] * CENTER_OFFSET_MULTIPLIER];
  }

  public centerDiagrams(diagrams: BaseModels.Diagram.Model[]) {
    return diagrams.map((diagram) => {
      const centeredPosition = this.getCenteredDiagramPosition(diagram.nodes);

      if (centeredPosition.length === 0) return diagram;

      const [centeredPositionX, centeredPositionY] = centeredPosition;

      return {
        ...diagram,
        offsetX: centeredPositionX,
        offsetY: centeredPositionY,
      };
    });
  }

  private sharedNodeMapper = (node: BaseModels.BaseDiagramNode<AnyRecord>): Realtime.diagram.sharedNodes.SharedNode | null => {
    if (Realtime.Utils.typeGuards.isIntentDBNode(node)) {
      const global = !node.data.availability || node.data.availability === BaseNode.Intent.IntentAvailability.GLOBAL;

      return { type: Realtime.BlockType.INTENT, global, nodeID: node.nodeID, intentID: node.data.intent || null };
    }

    if (Realtime.Utils.typeGuards.isStartDBNode(node)) {
      return { type: Realtime.BlockType.START, name: node.data.label || '', nodeID: node.nodeID };
    }

    if (Realtime.Utils.typeGuards.isBlockDBNode(node)) {
      return { type: Realtime.BlockType.COMBINED, name: node.data.name, nodeID: node.nodeID };
    }

    return null;
  };

  cleanupStepPorts(node: BaseModels.BaseDiagramNode, validNodesMap: Map<string, boolean>): BaseModels.BaseDiagramNode {
    const cleanPortTarget = (port: BaseModels.BasePort): BaseModels.BasePort => ({
      ...port,
      target: port.target && validNodesMap.has(port.target) ? port.target : null,
    });

    if (node.data.ports) {
      return { ...node, data: { ...node.data, ports: node.data.ports.map(cleanPortTarget) } };
    }

    const byKey = Utils.object.mapValue(node.data.portsV2.byKey ?? {}, cleanPortTarget);
    const builtIn = Utils.object.mapValue(node.data.portsV2.builtIn ?? {}, cleanPortTarget);
    const dynamic = node.data.portsV2.dynamic?.map(cleanPortTarget) || [];

    return { ...node, data: { ...node.data, portsV2: { byKey, builtIn, dynamic } } };
  }

  cleanupDiagramNodes(nodesMap: Record<string, BaseModels.BaseDiagramNode>) {
    const validNodesMap: Map<string, boolean> = new Map();
    const cleanedNodes = Object.values(nodesMap)
      .filter((node) => {
        if (Realtime.Utils.typeGuards.isBlock(node) || Realtime.Utils.typeGuards.isActions(node) || Realtime.Utils.typeGuards.isStart(node)) {
          const steps = (node.data.steps ?? []).filter((stepID) => !!(stepID in nodesMap));

          if (!steps.length && !Realtime.Utils.typeGuards.isStart(node)) return false;

          // eslint-disable-next-line no-param-reassign
          node.data.steps = steps;
        }
        validNodesMap.set(node.nodeID, true);
        return true;
      })
      .reduce<Record<string, BaseModels.BaseDiagramNode>>((acc, node) => ({ ...acc, [node.nodeID]: node }), {});

    return Utils.object.mapValue(cleanedNodes, (node) => {
      if (Array.isArray(node.data.ports) || Utils.object.isObject(node.data.portsV2)) return this.cleanupStepPorts(node, validNodesMap);
      return node;
    });
  }
}
