/* eslint-disable sonarjs/no-nested-template-literals */
import { Inject, Injectable } from '@nestjs/common';
import { BaseModels } from '@voiceflow/base-types';
import type { Nullish, Struct } from '@voiceflow/common';
import { Utils } from '@voiceflow/common';
import type { DiagramMenuItem, DiagramNode } from '@voiceflow/dtos';
import { Atomic, DiagramORM, ObjectId } from '@voiceflow/orm-designer';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import _find from 'lodash/find.js';
import _get from 'lodash/get.js';

interface ManyNodeDataUpdate extends Atomic.Update {
  nodeID: string;
}

@Injectable()
export class DiagramNodeService {
  private static nodePath = (nodeID: string, path?: string): string => `nodes.${nodeID}${path ? `.${path}` : ''}`;

  private static nodeDataPath = (nodeID: string, path?: string): string => DiagramNodeService.nodePath(nodeID, `data${path ? `.${path}` : ''}`);

  private static dynamicPortPath = (portID: string, path?: string) => ['portsV2.dynamic', { id: portID }, ...(path ? [path] : [])];

  private static byKeyPortPath = (key: string, path?: string) => `portsV2.byKey.${key}${path ? `.${path}` : ''}`;

  private static builtInPortPath = (type: string, path?: string) => `portsV2.builtIn.${type}${path ? `.${path}` : ''}`;

  private static portPath = ({ key, type, portID }: Realtime.PortDelete, path?: string) => {
    if (type) return DiagramNodeService.builtInPortPath(type, path);
    if (key) return DiagramNodeService.byKeyPortPath(key, path);
    if (portID) return DiagramNodeService.dynamicPortPath(portID, path);

    return '';
  };

  private atomicNode = new Atomic.Resource(DiagramNodeService.nodePath);

  private atomicNodeData = new Atomic.Resource(DiagramNodeService.nodeDataPath);

  constructor(
    @Inject(DiagramORM)
    protected readonly orm: DiagramORM
  ) {}

  atomicNodePortRemap(nodePortRemaps: Realtime.NodePortRemap[] = []) {
    if (!nodePortRemaps.length) return [];

    const patches = nodePortRemaps.map(({ nodeID, ports, targetNodeID }) => ({
      resourceID: nodeID,
      sets: [
        ...ports.filter(({ type, key }) => type || key).map((port) => ({ path: DiagramNodeService.portPath(port, 'target'), value: targetNodeID })),
        { path: 'portsV2.dynamic.$[].target', value: targetNodeID },
      ],
    }));

    return [this.atomicNodeData.setMany(patches)];
  }

  async addStep(
    versionID: string,
    diagramID: string,
    {
      step,
      index,
      isActions,
      removeNodes,
      parentNodeID,
      nodePortRemaps,
    }: {
      step: DiagramNode;
      index: Nullish<number>;
      isActions: boolean;
      removeNodes: Realtime.RemoveNode[];
      parentNodeID: string;
      nodePortRemaps: Realtime.NodePortRemap[];
    }
  ) {
    const isMenuNode = !isActions && Realtime.Utils.typeGuards.isDiagramMenuDBNode(step);

    await this.orm.atomicUpdateOne({ versionID, diagramID }, [
      ...(isMenuNode ? [Atomic.Push([{ path: 'menuItems', value: [{ type: BaseModels.Diagram.MenuItemType.NODE, sourceID: step.nodeID }] }])] : []),

      this.atomicNode.set(step.nodeID, [{ path: '', value: step }]),

      this.atomicNodeData.push(parentNodeID, [{ path: 'steps', value: step.nodeID, index }]),

      ...this.atomicNodePortRemap(nodePortRemaps),
      ...this.atomicRemoveManyNodes(removeNodes),
    ]);

    return step;
  }

  async addManySteps(
    versionID: string,
    diagramID: string,
    {
      steps,
      index,
      removeNodes,
      parentNodeID,
      nodePortRemaps,
    }: {
      steps: DiagramNode[];
      index: Nullish<number>;
      removeNodes: Realtime.RemoveNode[];
      parentNodeID: string;
      nodePortRemaps: Realtime.NodePortRemap[];
    }
  ) {
    const menuItems: DiagramMenuItem[] = [];
    const allNodeIDs: string[] = [];
    const stepsSets: { resourceID: string; sets: Atomic.SetOperation[] }[] = [];

    steps.forEach((step) => {
      allNodeIDs.push(step.nodeID);
      stepsSets.push({ resourceID: step.nodeID, sets: [{ path: '', value: step }] });

      if (Realtime.Utils.typeGuards.isDiagramMenuDBNode(step)) {
        menuItems.push({ type: BaseModels.Diagram.MenuItemType.NODE, sourceID: step.nodeID });
      }
    });

    await this.orm.atomicUpdateOne({ versionID, diagramID }, [
      ...(menuItems.length ? [Atomic.Push([{ path: 'menuItems', value: menuItems }])] : []),

      this.atomicNode.setMany(stepsSets),

      this.atomicNodeData.push(parentNodeID, [{ path: 'steps', value: allNodeIDs, index }]),

      ...this.atomicNodePortRemap(nodePortRemaps),
      ...this.atomicRemoveManyNodes(removeNodes),
    ]);

    return steps;
  }

  async addManyNodes(versionID: string, diagramID: string, { nodes }: { nodes: DiagramNode[] }) {
    const menuItems = nodes
      .filter((node) => Realtime.Utils.typeGuards.isDiagramMenuDBNode(node))
      .map<DiagramMenuItem>((node) => ({
        type: BaseModels.Diagram.MenuItemType.NODE,
        sourceID: node.nodeID,
      }));

    await this.orm.atomicUpdateOne({ versionID, diagramID }, [
      ...(menuItems.length ? [Atomic.Push([{ path: 'menuItems', value: menuItems }])] : []),

      this.atomicNode.setMany(nodes.map((node) => ({ resourceID: node.nodeID, sets: [{ path: '', value: node }] }))),
    ]);

    return nodes;
  }

  async isolateSteps({
    stepIDs,
    diagramID,
    versionID,
    parentNode,
    sourceParentNodeID,
  }: {
    stepIDs: string[];
    diagramID: string;
    versionID: string;
    parentNode: BaseModels.BaseBlock | BaseModels.BaseActions;
    sourceParentNodeID: string;
  }) {
    await this.orm.atomicUpdateOne({ versionID, diagramID }, [
      this.atomicNode.set(parentNode.nodeID, [{ path: '', value: parentNode }]),
      this.atomicNodeData.pull(sourceParentNodeID, [{ path: 'steps', match: { $in: stepIDs } }]),
    ]);

    return stepIDs;
  }

  async reorderSteps({
    index,
    stepID,
    versionID,
    diagramID,
    removeNodes,
    parentNodeID,
    nodePortRemaps,
  }: {
    index: number;
    stepID: string;
    versionID: string;
    diagramID: string;
    removeNodes: Realtime.RemoveNode[];
    parentNodeID: string;
    nodePortRemaps: Realtime.NodePortRemap[];
  }) {
    const remapQuery = this.atomicNodePortRemap(nodePortRemaps);

    await this.orm.atomicUpdateOne({ versionID, diagramID }, [
      this.atomicNodeData.pull(parentNodeID, [{ path: 'steps', match: stepID }]),
      ...remapQuery,
      ...this.atomicRemoveManyNodes(removeNodes),
    ]);

    await this.orm.atomicUpdateOne({ versionID, diagramID }, [this.atomicNodeData.push(parentNodeID, [{ path: 'steps', value: stepID, index }])]);

    return stepID;
  }

  async transplantSteps({
    index,
    stepIDs,
    versionID,
    diagramID,
    removeNodes,
    removeSource,
    nodePortRemaps,
    sourceParentNodeID,
    targetParentNodeID,
  }: {
    index: number;
    stepIDs: string[];
    versionID: string;
    diagramID: string;
    removeNodes: Realtime.RemoveNode[];
    removeSource: boolean;
    nodePortRemaps: Realtime.NodePortRemap[];
    sourceParentNodeID: string;
    targetParentNodeID: string;
  }) {
    const remapQuery = this.atomicNodePortRemap(nodePortRemaps);

    await this.orm.atomicUpdateOne({ versionID, diagramID }, [
      removeSource
        ? this.atomicNode.unset(sourceParentNodeID, [{ path: '' }])
        : this.atomicNodeData.pull(sourceParentNodeID, [{ path: 'steps', match: { $in: stepIDs } }]),

      this.atomicNodeData.push(targetParentNodeID, [{ path: 'steps', value: stepIDs, index }]),

      ...remapQuery,

      ...this.atomicRemoveManyNodes(removeNodes),
    ]);

    return stepIDs;
  }

  private atomicRemoveManyNodes(nodes: Realtime.RemoveNode[] = []) {
    if (!nodes.length) return [];

    const [stepsToPull, nodesToPull] = Utils.array.separate(nodes, ({ stepID }) => !!stepID);
    const parentNodeIDsToPull = new Set(nodesToPull.map(({ parentNodeID }) => parentNodeID));
    const stepIDsToPull = stepsToPull.map(({ stepID }) => stepID).filter(Utils.array.isNotNullish);

    // do not attempt to pull a step from a node that is also being deleted
    const stepsToPullFromNodes = stepsToPull.filter(({ parentNodeID }) => !parentNodeIDsToPull.has(parentNodeID));

    return [
      ...(stepIDsToPull.length
        ? [
            Atomic.Pull([
              {
                path: 'menuItems',
                match: { type: BaseModels.Diagram.MenuItemType.NODE, sourceID: { $in: stepIDsToPull } },
              },
            ]),
          ]
        : []),

      this.atomicNode.unsetMany(nodes.map(({ stepID, parentNodeID }) => ({ resourceID: stepID ?? parentNodeID, unsets: [{ path: '' }] }))),

      ...(stepsToPullFromNodes.length
        ? [
            this.atomicNodeData.pullMany(
              stepsToPullFromNodes.map(({ parentNodeID, stepID }) => ({
                resourceID: parentNodeID,
                pulls: [{ path: 'steps', match: stepID }],
              }))
            ),
          ]
        : []),
    ];
  }

  async removeManyNodes(versionID: string, diagramID: string, { nodes }: { nodes: Realtime.RemoveNode[] }) {
    await this.orm.atomicUpdateOne({ versionID, diagramID }, this.atomicRemoveManyNodes(nodes));

    return nodes;
  }

  async patchManyNodes(versionID: string, diagramID: string, nodePatches: Array<{ nodeID: string; patch: Struct }>) {
    return this.orm.atomicUpdateOne({ versionID, diagramID }, [
      this.atomicNode.setMany(
        nodePatches.map(({ nodeID, patch }) => ({
          resourceID: nodeID,
          sets: Object.entries(patch).map(([key, value]) => ({ path: key, value })),
        }))
      ),
    ]);
  }

  async patchNode(versionID: string, diagramID: string, nodeID: string, patch: Struct) {
    return this.patchManyNodes(versionID, diagramID, [{ nodeID, patch }]);
  }

  async updateNodeCoords(versionID: string, diagramID: string, nodes: Record<string, [number, number]>) {
    await this.patchManyNodes(
      versionID,
      diagramID,
      Object.entries(nodes).map(([nodeID, coords]) => ({ nodeID, patch: { coords } }))
    );

    return nodes;
  }

  private extractUpdates(nodeUpdates: ManyNodeDataUpdate[]) {
    return nodeUpdates.flatMap(({ nodeID, sets, pulls, pushes, unsets }) => [
      ...(sets?.length ? [this.atomicNodeData.set(nodeID, sets)] : []),
      ...(pulls?.length ? [this.atomicNodeData.pull(nodeID, pulls)] : []),
      ...(pushes?.length ? [this.atomicNodeData.push(nodeID, pushes)] : []),
      ...(unsets?.length ? [this.atomicNodeData.unset(nodeID, unsets)] : []),
    ]);
  }

  async updateManyNodeData(versionID: string, diagramID: string, nodeUpdates: ManyNodeDataUpdate[]) {
    const updates = this.extractUpdates(nodeUpdates);

    if (updates.length) {
      await this.orm.atomicUpdateOne({ versionID, diagramID }, updates);
    }
  }

  async pullManyNodesData(versionID: string, diagramID: string, nodePulls: Array<{ nodeID: string; pulls: Atomic.PullOperation[] }>) {
    await this.orm.atomicUpdateOne({ versionID, diagramID }, [
      this.atomicNodeData.pullMany(nodePulls.map(({ nodeID, pulls }) => ({ resourceID: nodeID, pulls }))),
    ]);
  }

  async pullNodeData(versionID: string, diagramID: string, nodeID: string, pulls: Atomic.PullOperation[]) {
    await this.orm.atomicUpdateOne({ versionID, diagramID }, [this.atomicNodeData.pull(nodeID, pulls)]);
  }

  async pushManyNodesData(versionID: string, diagramID: string, nodePushes: Array<{ nodeID: string; pushes: Atomic.PushOperation[] }>) {
    await this.orm.atomicUpdateOne({ versionID, diagramID }, [
      this.atomicNodeData.pushMany(nodePushes.map(({ nodeID, pushes }) => ({ resourceID: nodeID, pushes }))),
    ]);
  }

  async pushNodeData(versionID: string, diagramID: string, nodeID: string, pushes: Atomic.PushOperation[]) {
    await this.orm.atomicUpdateOne({ versionID, diagramID }, [this.atomicNodeData.push(nodeID, pushes)]);
  }

  async unsetManyNodesData(versionID: string, diagramID: string, nodeUnsets: Array<{ nodeID: string; unsets: Atomic.UnsetOperation[] }>) {
    await this.orm.atomicUpdateOne({ versionID, diagramID }, [
      this.atomicNodeData.unsetMany(nodeUnsets.map(({ nodeID, unsets }) => ({ resourceID: nodeID, unsets }))),
    ]);
  }

  async unsetNodeData(versionID: string, diagramID: string, nodeID: string, unsets: Atomic.UnsetOperation[]) {
    await this.orm.atomicUpdateOne({ versionID, diagramID }, [this.atomicNodeData.unset(nodeID, unsets)]);
  }

  async patchManyNodesData(versionID: string, diagramID: string, nodePatches: Array<{ nodeID: string; patches: Atomic.SetOperation[] }>) {
    await this.orm.atomicUpdateOne({ versionID, diagramID }, [
      this.atomicNodeData.setMany(nodePatches.map(({ nodeID, patches }) => ({ resourceID: nodeID, sets: patches }))),
    ]);
  }

  async patchNodeData(versionID: string, diagramID: string, nodeID: string, patches: Atomic.SetOperation[]) {
    await this.orm.atomicUpdateOne({ versionID, diagramID }, [this.atomicNodeData.set(nodeID, patches)]);
  }

  private async reorderNodeData(versionID: string, diagramID: string, nodeID: string, { path, match, index }: Atomic.ReorderOperation) {
    const { nodes } = await this.orm.findOneAndAtomicUpdate({ versionID, diagramID }, [this.atomicNodeData.pull(nodeID, [{ path, match }])]);

    const array = _get(nodes[nodeID].data, path) as unknown[];
    const item = _find(array, match);

    if (!item) throw new Error('Could not find item to reorder');

    await this.orm.atomicUpdateOne({ versionID, diagramID }, [this.atomicNodeData.push(nodeID, [{ path, value: item, index }])]);
  }

  async addByKeyLink(versionID: string, diagramID: string, nodeID: string, link: { key: string; target: string; data?: BaseModels.LinkData }) {
    await this.patchNodeData(versionID, diagramID, nodeID, [
      { path: DiagramNodeService.byKeyPortPath(link.key, 'target'), value: link.target },
      { path: DiagramNodeService.byKeyPortPath(link.key, 'data'), value: link.data ?? {} },
    ]);
  }

  async addBuiltInLink(
    versionID: string,
    diagramID: string,
    nodeID: string,
    link: { type: BaseModels.PortType; target: string; data?: BaseModels.LinkData }
  ) {
    await this.patchNodeData(versionID, diagramID, nodeID, [
      { path: DiagramNodeService.builtInPortPath(link.type, 'target'), value: link.target },
      { path: DiagramNodeService.builtInPortPath(link.type, 'data'), value: link.data ?? {} },
    ]);
  }

  async addDynamicLink(versionID: string, diagramID: string, nodeID: string, link: { portID: string; target: string; data?: BaseModels.LinkData }) {
    await this.patchNodeData(versionID, diagramID, nodeID, [
      { path: DiagramNodeService.dynamicPortPath(link.portID, 'target'), value: link.target },
      { path: DiagramNodeService.dynamicPortPath(link.portID, 'data'), value: link.data ?? {} },
    ]);
  }

  async removeManyLinks(versionID: string, diagramID: string, links: Realtime.LinkDelete[]) {
    const patches = links.map((link) => ({
      nodeID: link.nodeID,
      patches: [{ path: DiagramNodeService.portPath(link, 'target'), value: null }],
    }));

    await this.patchManyNodesData(versionID, diagramID, patches);

    return links;
  }

  async patchManyLinks(versionID: string, diagramID: string, linkPatches: Realtime.LinkPatch[]) {
    const patches = linkPatches.map((patch) => ({
      nodeID: patch.nodeID,
      patches: Object.entries(patch.data).map(([key, value]) => ({
        path: DiagramNodeService.portPath(patch, `data.${key}`),
        value,
      })),
    }));

    await this.patchManyNodesData(versionID, diagramID, patches);

    return linkPatches;
  }

  async removeManyPorts(
    versionID: string,
    diagramID: string,
    { ports, nodeID, removeNodes }: { ports: Realtime.PortDelete[]; nodeID: string; removeNodes: Realtime.RemoveNode[] }
  ) {
    await this.orm.atomicUpdateOne({ versionID, diagramID }, [
      this.atomicNodeData.unset(
        nodeID,
        ports.map((port) => ({ path: DiagramNodeService.portPath(port) }))
      ),

      ...this.atomicRemoveManyNodes(removeNodes),
    ]);

    return ports;
  }

  async removeBuiltInPort(
    versionID: string,
    diagramID: string,
    { type, nodeID, removeNodes }: { type: BaseModels.PortType; nodeID: string; removeNodes: Realtime.RemoveNode[] }
  ) {
    await this.orm.atomicUpdateOne({ versionID, diagramID }, [
      this.atomicNodeData.unset(nodeID, [{ path: DiagramNodeService.builtInPortPath(type) }]),

      ...this.atomicRemoveManyNodes(removeNodes),
    ]);

    return type;
  }

  async removeDynamicPort(
    versionID: string,
    diagramID: string,
    { nodeID, portID, removeNodes }: { nodeID: string; portID: string; removeNodes: Realtime.RemoveNode[] }
  ) {
    await this.orm.atomicUpdateOne({ versionID, diagramID }, [
      this.atomicNodeData.pull(nodeID, [{ path: 'portsV2.dynamic', match: { id: portID } }]),

      ...this.atomicRemoveManyNodes(removeNodes),
    ]);

    return portID;
  }

  async reorderPorts(versionID: string, diagramID: string, nodeID: string, portID: string, index: number) {
    await this.reorderNodeData(versionID, diagramID, nodeID, { path: 'portsV2.dynamic', match: { id: portID }, index });

    return portID;
  }

  async addByKeyPort(versionID: string, diagramID: string, nodeID: string, key: string, port: BaseModels.BasePort) {
    await this.patchNodeData(versionID, diagramID, nodeID, [{ path: DiagramNodeService.byKeyPortPath(key), value: port }]);

    return port;
  }

  async addBuiltInPort(versionID: string, diagramID: string, nodeID: string, type: BaseModels.PortType, port: BaseModels.BasePort) {
    await this.patchNodeData(versionID, diagramID, nodeID, [{ path: DiagramNodeService.builtInPortPath(type), value: port }]);

    return port;
  }

  async addDynamicPort(versionID: string, diagramID: string, nodeID: string, port: BaseModels.BasePort, index?: number) {
    await this.pushNodeData(versionID, diagramID, nodeID, [{ path: 'portsV2.dynamic', value: port, index }]);

    return port;
  }

  async addMenuItem(versionID: string, diagramID: string, value: DiagramMenuItem, index?: number) {
    await this.orm.atomicUpdate(
      {
        versionID: new ObjectId(versionID),
        diagramID: new ObjectId(diagramID),
        menuItems: { $not: { $elemMatch: { sourceID: value.sourceID } } },
      },
      [Atomic.Push([{ path: 'menuItems', value, index }])]
    );
  }

  async removeMenuItem(versionID: string, diagramID: string, sourceID: string) {
    await this.orm.atomicUpdateOne({ versionID, diagramID }, [Atomic.Pull([{ path: 'menuItems', match: { sourceID } }])]);
  }

  async reorderMenuItems(versionID: string, diagramID: string, { index, sourceID }: { index: number; sourceID: string }) {
    const diagram = await this.orm.findOneAndAtomicUpdate({ versionID, diagramID }, [Atomic.Pull([{ path: 'menuItems', match: { sourceID } }])]);

    const item = diagram.menuItems?.find((folder) => folder.sourceID === sourceID);

    if (!item) throw new Error('Could not find item to reorder');

    await this.addMenuItem(versionID, diagramID, item, index);
  }

  async syncCustomBlockPorts(versionID: string, diagramID: string, updatePatch: Record<string, { label: string; portID: string }[]>) {
    await this.pushManyNodesData(
      versionID,
      diagramID,
      Object.keys(updatePatch).map<{ nodeID: string; pushes: Atomic.PushOperation[] }>((nodeID) => ({
        nodeID,
        pushes: [
          {
            path: 'portsV2.dynamic',
            value: updatePatch[nodeID].map(({ label, portID }) => ({ id: portID, type: label, target: null })),
          },
        ],
      }))
    );
  }
}
