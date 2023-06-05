/* eslint-disable sonarjs/no-nested-template-literals */
import { BaseModels } from '@voiceflow/base-types';
import { Nullish, Struct, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { createSmartMultiAdapter } from 'bidirectional-adapter';
import { ObjectId } from 'bson';
import _ from 'lodash';
import { FilterQuery } from 'mongodb';

import AbstractModel from '../_mongo';
import { Atomic, AtomicEntity, Bson } from '../utils';

interface ManyNodeDataUpdate extends Atomic.Update {
  nodeID: string;
}

const OBJECT_ID_KEYS = ['_id', 'versionID'] as const;
const READ_ONLY_KEYS = ['_id', 'versionID', 'creatorID'] as const;

export type DBDiagramModel = Bson.StringToObjectID<BaseModels.Diagram.Model, Realtime.ArrayItem<typeof OBJECT_ID_KEYS>>;
export type DiagramFilter = FilterQuery<DBDiagramModel>;

class DiagramModel extends AbstractModel<DBDiagramModel, BaseModels.Diagram.Model, Realtime.ArrayItem<typeof READ_ONLY_KEYS>> {
  READ_ONLY_KEYS = READ_ONLY_KEYS;

  public collectionName = 'diagrams';

  private static nodePath = (nodeID: string, path?: string): string => `nodes.${nodeID}${path ? `.${path}` : ''}`;

  private static nodeDataPath = (nodeID: string, path?: string): string => DiagramModel.nodePath(nodeID, `data${path ? `.${path}` : ''}`);

  private static dynamicPortPath = (portID: string, path?: string) => ['portsV2.dynamic', { id: portID }, ...(path ? [path] : [])];

  private static builtInPortPath = (type: BaseModels.PortType, path?: string) => `portsV2.builtIn.${type}${path ? `.${path}` : ''}`;

  private static byKeyPortPath = (key: string, path?: string) => `portsV2.byKey.${key}${path ? `.${path}` : ''}`;

  private static portPath = ({ type, key, portID }: Realtime.PortDelete, path?: string) => {
    if (type) return DiagramModel.builtInPortPath(type, path);
    if (key) return DiagramModel.byKeyPortPath(key, path);
    if (portID) return DiagramModel.dynamicPortPath(portID, path);
    return '';
  };

  private atomicNode = new AtomicEntity(DiagramModel.nodePath);

  private atomicNodeData = new AtomicEntity(DiagramModel.nodeDataPath);

  adapter = createSmartMultiAdapter<DBDiagramModel, BaseModels.Diagram.Model>(
    Bson.objectIdToString(OBJECT_ID_KEYS),
    Bson.stringToObjectId(OBJECT_ID_KEYS)
  );

  atomicNodePortRemap(nodePortRemaps: Realtime.NodePortRemap[] = []) {
    if (!nodePortRemaps.length) return [];

    const patches = nodePortRemaps.map(({ nodeID, ports, targetNodeID }) => ({
      entityID: nodeID,
      sets: [
        ...ports.filter(({ type, key }) => type || key).map((port) => ({ path: DiagramModel.portPath(port, 'target'), value: targetNodeID })),
        { path: 'portsV2.dynamic.$[].target', value: targetNodeID },
      ],
    }));

    return [this.atomicNodeData.setMany(patches)];
  }

  async findManyByVersionID(versionID: string): Promise<DBDiagramModel[]>;

  async findManyByVersionID<Key extends keyof DBDiagramModel>(versionID: string, fields: Key[]): Promise<Pick<DBDiagramModel, Key>[]>;

  async findManyByVersionID(versionID: string, fields?: (keyof DBDiagramModel)[]): Promise<Partial<DBDiagramModel>[]>;

  async findManyByVersionID(versionID: string, fields?: (keyof DBDiagramModel)[]): Promise<Partial<DBDiagramModel>[]> {
    return this.findMany({ versionID: new ObjectId(versionID) }, fields);
  }

  async findOneByVersionID(versionID: string, filters?: DiagramFilter) {
    return this.findOne({ versionID: new ObjectId(versionID), ...filters });
  }

  async addStep(
    diagramID: string,
    {
      step,
      index,
      isActions,
      removeNodes,
      parentNodeID,
      nodePortRemaps,
    }: {
      step: BaseModels.BaseStep;
      index: Nullish<number>;
      isActions: boolean;
      removeNodes: Realtime.RemoveNode[];
      parentNodeID: string;
      nodePortRemaps: Realtime.NodePortRemap[];
    }
  ) {
    const isMenuNode = !isActions && Realtime.Utils.typeGuards.isDiagramMenuDBNode(step);

    await this.atomicUpdateByID(diagramID, [
      ...(isMenuNode ? [Atomic.push([{ path: 'menuItems', value: [{ type: BaseModels.Diagram.MenuItemType.NODE, sourceID: step.nodeID }] }])] : []),

      this.atomicNode.set(step.nodeID, [{ path: '', value: step }]),

      this.atomicNodeData.push(parentNodeID, [{ path: 'steps', value: step.nodeID, index }]),

      ...this.atomicNodePortRemap(nodePortRemaps),
      ...this.atomicRemoveManyNodes(removeNodes),
    ]);

    return step;
  }

  async addManySteps(
    diagramID: string,
    {
      steps,
      index,
      removeNodes,
      parentNodeID,
      nodePortRemaps,
    }: {
      steps: BaseModels.BaseStep[];
      index: Nullish<number>;
      removeNodes: Realtime.RemoveNode[];
      parentNodeID: string;
      nodePortRemaps: Realtime.NodePortRemap[];
    }
  ) {
    const menuItems: BaseModels.Diagram.MenuItem[] = [];
    const allNodeIDs: string[] = [];
    const stepsSets: {
      entityID: string;
      sets: Atomic.SetOperation[];
    }[] = [];

    steps.forEach((step) => {
      allNodeIDs.push(step.nodeID);
      stepsSets.push({ entityID: step.nodeID, sets: [{ path: '', value: step }] });

      if (Realtime.Utils.typeGuards.isDiagramMenuDBNode(step)) {
        menuItems.push({ type: BaseModels.Diagram.MenuItemType.NODE, sourceID: step.nodeID });
      }
    });

    await this.atomicUpdateByID(diagramID, [
      ...(menuItems.length ? [Atomic.push([{ path: 'menuItems', value: menuItems }])] : []),

      this.atomicNode.setMany(stepsSets),

      this.atomicNodeData.push(parentNodeID, [{ path: 'steps', value: allNodeIDs, index }]),

      ...this.atomicNodePortRemap(nodePortRemaps),
      ...this.atomicRemoveManyNodes(removeNodes),
    ]);

    return steps;
  }

  async addManyNodes(diagramID: string, { nodes }: { nodes: BaseModels.BaseDiagramNode[] }) {
    const menuItems = nodes
      .filter(Realtime.Utils.typeGuards.isDiagramMenuDBNode)
      .map<BaseModels.Diagram.MenuItem>((node) => ({ type: BaseModels.Diagram.MenuItemType.NODE, sourceID: node.nodeID }));

    await this.atomicUpdateByID(diagramID, [
      ...(menuItems.length ? [Atomic.push([{ path: 'menuItems', value: menuItems }])] : []),

      this.atomicNode.setMany(nodes.map((node) => ({ entityID: node.nodeID, sets: [{ path: '', value: node }] }))),
    ]);

    return nodes;
  }

  async isolateSteps({
    stepIDs,
    diagramID,
    parentNode,
    sourceParentNodeID,
  }: {
    stepIDs: string[];
    diagramID: string;
    parentNode: BaseModels.BaseBlock | BaseModels.BaseActions;
    sourceParentNodeID: string;
  }) {
    await this.atomicUpdateByID(diagramID, [
      this.atomicNode.set(parentNode.nodeID, [{ path: '', value: parentNode }]),
      this.atomicNodeData.pull(sourceParentNodeID, [{ path: 'steps', match: { $in: stepIDs } }]),
    ]);

    return stepIDs;
  }

  async reorderSteps({
    index,
    stepID,
    diagramID,
    removeNodes,
    parentNodeID,
    nodePortRemaps,
  }: {
    index: number;
    stepID: string;
    diagramID: string;
    removeNodes: Realtime.RemoveNode[];
    parentNodeID: string;
    nodePortRemaps: Realtime.NodePortRemap[];
  }) {
    const remapQuery = this.atomicNodePortRemap(nodePortRemaps);

    await this.atomicUpdateByID(diagramID, [
      this.atomicNodeData.pull(parentNodeID, [{ path: 'steps', match: stepID }]),
      ...remapQuery,
      ...this.atomicRemoveManyNodes(removeNodes),
    ]);

    await this.atomicUpdateByID(diagramID, [this.atomicNodeData.push(parentNodeID, [{ path: 'steps', value: stepID, index }])]);

    return stepID;
  }

  async transplantSteps({
    index,
    stepIDs,
    diagramID,
    removeNodes,
    removeSource,
    nodePortRemaps,
    sourceParentNodeID,
    targetParentNodeID,
  }: {
    index: number;
    stepIDs: string[];
    diagramID: string;
    removeNodes: Realtime.RemoveNode[];
    removeSource: boolean;
    nodePortRemaps: Realtime.NodePortRemap[];
    sourceParentNodeID: string;
    targetParentNodeID: string;
  }) {
    const remapQuery = this.atomicNodePortRemap(nodePortRemaps);

    await this.atomicUpdateByID(diagramID, [
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
        ? [Atomic.pull([{ path: 'menuItems', match: { type: BaseModels.Diagram.MenuItemType.NODE, sourceID: { $in: stepIDsToPull } } }])]
        : []),

      this.atomicNode.unsetMany(nodes.map(({ stepID, parentNodeID }) => ({ entityID: stepID ?? parentNodeID, unsets: [{ path: '' }] }))),

      ...(stepsToPullFromNodes.length
        ? [
            this.atomicNodeData.pullMany(
              stepsToPullFromNodes.map(({ parentNodeID, stepID }) => ({ entityID: parentNodeID, pulls: [{ path: 'steps', match: stepID }] }))
            ),
          ]
        : []),
    ];
  }

  async removeManyNodes(diagramID: string, { nodes }: { nodes: Realtime.RemoveNode[] }) {
    await this.atomicUpdateByID(diagramID, this.atomicRemoveManyNodes(nodes));

    return nodes;
  }

  async patchManyNodes(diagramID: string, nodePatches: Array<{ nodeID: string; patch: Struct }>) {
    const sets = nodePatches.map(({ nodeID, patch }) => ({
      sets: Object.entries(patch).map(([key, value]) => ({ path: key, value })),
      entityID: nodeID,
    }));

    return this.atomicUpdateByID(diagramID, [this.atomicNode.setMany(sets)]);
  }

  async patchNode(diagramID: string, nodeID: string, patch: Struct) {
    return this.patchManyNodes(diagramID, [{ nodeID, patch }]);
  }

  async updateNodeCoords(diagramID: string, nodes: Record<string, [number, number]>) {
    const nodePatches = Object.entries(nodes).map(([nodeID, coords]) => ({ nodeID, patch: { coords } }));

    await this.patchManyNodes(diagramID, nodePatches);

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

  async updateManyNodeData(diagramID: string, nodeUpdates: ManyNodeDataUpdate[]) {
    const updates = this.extractUpdates(nodeUpdates);

    if (updates.length) {
      await this.atomicUpdateByID(diagramID, updates);
    }
  }

  async pullManyNodesData(diagramID: string, nodePulls: Array<{ nodeID: string; pulls: Atomic.PullOperation[] }>) {
    await this.atomicUpdateByID(diagramID, [this.atomicNodeData.pullMany(nodePulls.map(({ nodeID, pulls }) => ({ entityID: nodeID, pulls })))]);
  }

  async pullNodeData(diagramID: string, nodeID: string, pulls: Atomic.PullOperation[]) {
    await this.atomicUpdateByID(diagramID, [this.atomicNodeData.pull(nodeID, pulls)]);
  }

  async pushManyNodesData(diagramID: string, nodePushes: Array<{ nodeID: string; pushes: Atomic.PushOperation[] }>) {
    await this.atomicUpdateByID(diagramID, [this.atomicNodeData.pushMany(nodePushes.map(({ nodeID, pushes }) => ({ entityID: nodeID, pushes })))]);
  }

  async pushNodeData(diagramID: string, nodeID: string, pushes: Atomic.PushOperation[]) {
    await this.atomicUpdateByID(diagramID, [this.atomicNodeData.push(nodeID, pushes)]);
  }

  async unsetManyNodesData(diagramID: string, nodeUnsets: Array<{ nodeID: string; unsets: Atomic.UnsetOperation[] }>) {
    await this.atomicUpdateByID(diagramID, [this.atomicNodeData.unsetMany(nodeUnsets.map(({ nodeID, unsets }) => ({ entityID: nodeID, unsets })))]);
  }

  async unsetNodeData(diagramID: string, nodeID: string, unsets: Atomic.UnsetOperation[]) {
    await this.atomicUpdateByID(diagramID, [this.atomicNodeData.unset(nodeID, unsets)]);
  }

  async patchManyNodesData(diagramID: string, nodePatches: Array<{ nodeID: string; patches: Atomic.SetOperation[] }>) {
    await this.atomicUpdateByID(diagramID, [
      this.atomicNodeData.setMany(nodePatches.map(({ nodeID, patches }) => ({ entityID: nodeID, sets: patches }))),
    ]);
  }

  async patchNodeData(diagramID: string, nodeID: string, patches: Atomic.SetOperation[]) {
    const data = this.atomicNodeData.set(nodeID, patches);
    await this.atomicUpdateByID(diagramID, [data]);
  }

  private async reorderNodeData(diagramID: string, nodeID: string, { path, match, index }: Atomic.ReorderOperation) {
    const { nodes } = await this.findAndAtomicUpdateByID(diagramID, [this.atomicNodeData.pull(nodeID, [{ path, match }])]);

    /* eslint-disable you-dont-need-lodash-underscore/get, you-dont-need-lodash-underscore/find */
    const array = _.get(nodes[nodeID].data, path) as unknown[];
    const item = _.find(array, match);
    /* eslint-enable you-dont-need-lodash-underscore/get, you-dont-need-lodash-underscore/find */

    if (!item) throw new Error('Could not find item to reorder');

    await this.atomicUpdateByID(diagramID, [this.atomicNodeData.push(nodeID, [{ path, value: item, index }])]);
  }

  async addByKeyLink(diagramID: string, nodeID: string, key: string, target: string, data: BaseModels.LinkData = {}) {
    await this.patchNodeData(diagramID, nodeID, [
      { path: DiagramModel.byKeyPortPath(key, 'target'), value: target },
      { path: DiagramModel.byKeyPortPath(key, 'data'), value: data },
    ]);
  }

  async addBuiltInLink(diagramID: string, nodeID: string, type: BaseModels.PortType, target: string, data: BaseModels.LinkData = {}) {
    await this.patchNodeData(diagramID, nodeID, [
      { path: DiagramModel.builtInPortPath(type, 'target'), value: target },
      { path: DiagramModel.builtInPortPath(type, 'data'), value: data },
    ]);
  }

  async addDynamicLink(diagramID: string, nodeID: string, portID: string, target: string, data: BaseModels.LinkData = {}) {
    await this.patchNodeData(diagramID, nodeID, [
      { path: DiagramModel.dynamicPortPath(portID, 'target'), value: target },
      { path: DiagramModel.dynamicPortPath(portID, 'data'), value: data },
    ]);
  }

  async removeManyLinks(diagramID: string, links: Realtime.LinkDelete[]) {
    const patches = links.map((link) => ({
      nodeID: link.nodeID,
      patches: [{ path: DiagramModel.portPath(link, 'target'), value: null }],
    }));

    await this.patchManyNodesData(diagramID, patches);

    return links;
  }

  async patchManyLinks(diagramID: string, linkPatches: Realtime.LinkPatch[]) {
    const patches = linkPatches.map((patch) => ({
      nodeID: patch.nodeID,
      patches: Object.entries(patch.data).map(([key, value]) => ({ path: DiagramModel.portPath(patch, `data.${key}`), value })),
    }));

    await this.patchManyNodesData(diagramID, patches);

    return linkPatches;
  }

  async removeManyPorts(
    diagramID: string,
    { ports, nodeID, removeNodes }: { ports: Realtime.PortDelete[]; nodeID: string; removeNodes: Realtime.RemoveNode[] }
  ) {
    await this.atomicUpdateByID(diagramID, [
      this.atomicNodeData.unset(
        nodeID,
        ports.map((port) => ({ path: DiagramModel.portPath(port) }))
      ),

      ...this.atomicRemoveManyNodes(removeNodes),
    ]);

    return ports;
  }

  async removeBuiltInPort(
    diagramID: string,
    { type, nodeID, removeNodes }: { type: BaseModels.PortType; nodeID: string; removeNodes: Realtime.RemoveNode[] }
  ) {
    await this.atomicUpdateByID(diagramID, [
      this.atomicNodeData.unset(nodeID, [{ path: DiagramModel.builtInPortPath(type) }]),

      ...this.atomicRemoveManyNodes(removeNodes),
    ]);

    return type;
  }

  async removeDynamicPort(
    diagramID: string,
    { nodeID, portID, removeNodes }: { nodeID: string; portID: string; removeNodes: Realtime.RemoveNode[] }
  ) {
    await this.atomicUpdateByID(diagramID, [
      this.atomicNodeData.pull(nodeID, [{ path: 'portsV2.dynamic', match: { id: portID } }]),

      ...this.atomicRemoveManyNodes(removeNodes),
    ]);

    return portID;
  }

  async reorderPorts(diagramID: string, nodeID: string, portID: string, index: number) {
    await this.reorderNodeData(diagramID, nodeID, { path: 'portsV2.dynamic', match: { id: portID }, index });

    return portID;
  }

  async addByKeyPort(diagramID: string, nodeID: string, key: string, port: BaseModels.BasePort) {
    await this.patchNodeData(diagramID, nodeID, [{ path: DiagramModel.byKeyPortPath(key), value: port }]);

    return port;
  }

  async addBuiltInPort(diagramID: string, nodeID: string, type: BaseModels.PortType, port: BaseModels.BasePort) {
    await this.patchNodeData(diagramID, nodeID, [{ path: DiagramModel.builtInPortPath(type), value: port }]);

    return port;
  }

  async addDynamicPort(diagramID: string, nodeID: string, port: BaseModels.BasePort, index?: number) {
    await this.pushNodeData(diagramID, nodeID, [{ path: 'portsV2.dynamic', value: port, index }]);

    return port;
  }

  async addMenuItem(diagramID: string, value: BaseModels.Diagram.MenuItem, index?: number) {
    await this.atomicUpdateByID(diagramID, [Atomic.push([{ path: 'menuItems', value, index }])]);
  }

  async removeMenuItem(diagramID: string, sourceID: string) {
    await this.atomicUpdateByID(diagramID, [Atomic.pull([{ path: 'menuItems', match: { sourceID } }])]);
  }

  /**
   * @deprecated should be removed with Subprotocol 1.3.0
   */
  async reorderMenuNodeIDs(diagramID: string, { index, nodeID }: { index: number; nodeID: string }) {
    await this.atomicUpdateByID(diagramID, [Atomic.pull([{ path: 'menuNodeIDs', match: nodeID }])]);
    await this.atomicUpdateByID(diagramID, [Atomic.push([{ path: 'menuNodeIDs', value: nodeID, index }])]);
  }

  async reorderMenuItems(diagramID: string, { index, sourceID }: { index: number; sourceID: string }) {
    const diagram = await this.findAndAtomicUpdateByID(diagramID, [Atomic.pull([{ path: 'menuItems', match: { sourceID } }])]);

    const item = diagram.menuItems?.find((folder) => folder.sourceID === sourceID);

    if (!item) throw new Error('Could not find item to reorder');

    await this.addMenuItem(diagramID, item, index);
  }
}

export default DiagramModel;
