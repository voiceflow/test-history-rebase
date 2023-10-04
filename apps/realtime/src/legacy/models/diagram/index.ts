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

const OBJECT_ID_KEYS = ['_id', 'versionID', 'diagramID'] as const;
const READ_ONLY_KEYS = ['_id', 'versionID', 'diagramID', 'creatorID'] as const;

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

  private versionIDDiagramIDFilter(versionID: string, diagramID: string) {
    return { versionID: new ObjectId(versionID), diagramID: new ObjectId(diagramID) };
  }

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

  async findByVersionIDAndDiagramID(versionID: string, diagramID: string, fields?: (keyof DBDiagramModel)[]) {
    return this.findOne(this.versionIDDiagramIDFilter(versionID, diagramID), fields);
  }

  async findManyByVersionIDAndDiagramIDs(versionID: string, diagramIDs: string[]): Promise<DBDiagramModel[]>;

  async findManyByVersionIDAndDiagramIDs<Key extends keyof DBDiagramModel>(
    versionID: string,
    diagramIDs: string[],
    fields: Key[]
  ): Promise<Pick<DBDiagramModel, Key>[]>;

  async findManyByVersionIDAndDiagramIDs<Key extends keyof DBDiagramModel>(
    versionID: string,
    diagramIDs: string[],
    fields?: Key[]
  ): Promise<Partial<DBDiagramModel>[]> {
    return this.findMany({ versionID: new ObjectId(versionID), diagramID: { $in: diagramIDs.map((id) => new ObjectId(id)) } }, fields);
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

  async updateOneByVersionIDAndDiagramID(versionID: string, diagramID: string, data: Partial<BaseModels.Diagram.Model>) {
    return this.updateOne(this.versionIDDiagramIDFilter(versionID, diagramID), data);
  }

  async deleteOneByVersionIDAndDiagramID(versionID: string, diagramID: string) {
    return this.deleteOne(this.versionIDDiagramIDFilter(versionID, diagramID));
  }

  async deleteManyByVersionIDAndDiagramIDs(versionID: string, diagramIDs: string[]) {
    await this.deleteMany({
      versionID: new ObjectId(versionID),
      diagramID: { $in: diagramIDs.map((id) => new ObjectId(id)) },
    });
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
      step: BaseModels.BaseStep;
      index: Nullish<number>;
      isActions: boolean;
      removeNodes: Realtime.RemoveNode[];
      parentNodeID: string;
      nodePortRemaps: Realtime.NodePortRemap[];
    }
  ) {
    const isMenuNode = !isActions && Realtime.Utils.typeGuards.isDiagramMenuDBNode(step);

    await this.atomicUpdateOne(this.versionIDDiagramIDFilter(versionID, diagramID), [
      ...(isMenuNode ? [Atomic.push([{ path: 'menuItems', value: [{ type: BaseModels.Diagram.MenuItemType.NODE, sourceID: step.nodeID }] }])] : []),

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

    await this.atomicUpdateOne(this.versionIDDiagramIDFilter(versionID, diagramID), [
      ...(menuItems.length ? [Atomic.push([{ path: 'menuItems', value: menuItems }])] : []),

      this.atomicNode.setMany(stepsSets),

      this.atomicNodeData.push(parentNodeID, [{ path: 'steps', value: allNodeIDs, index }]),

      ...this.atomicNodePortRemap(nodePortRemaps),
      ...this.atomicRemoveManyNodes(removeNodes),
    ]);

    return steps;
  }

  async addManyNodes(versionID: string, diagramID: string, { nodes }: { nodes: BaseModels.BaseDiagramNode[] }) {
    const menuItems = nodes
      .filter(Realtime.Utils.typeGuards.isDiagramMenuDBNode)
      .map<BaseModels.Diagram.MenuItem>((node) => ({ type: BaseModels.Diagram.MenuItemType.NODE, sourceID: node.nodeID }));

    await this.atomicUpdateOne(this.versionIDDiagramIDFilter(versionID, diagramID), [
      ...(menuItems.length ? [Atomic.push([{ path: 'menuItems', value: menuItems }])] : []),

      this.atomicNode.setMany(nodes.map((node) => ({ entityID: node.nodeID, sets: [{ path: '', value: node }] }))),
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
    await this.atomicUpdateOne(this.versionIDDiagramIDFilter(versionID, diagramID), [
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

    await this.atomicUpdateOne(this.versionIDDiagramIDFilter(versionID, diagramID), [
      this.atomicNodeData.pull(parentNodeID, [{ path: 'steps', match: stepID }]),
      ...remapQuery,
      ...this.atomicRemoveManyNodes(removeNodes),
    ]);

    await this.atomicUpdateOne(this.versionIDDiagramIDFilter(versionID, diagramID), [
      this.atomicNodeData.push(parentNodeID, [{ path: 'steps', value: stepID, index }]),
    ]);

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

    await this.atomicUpdateOne(this.versionIDDiagramIDFilter(versionID, diagramID), [
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

  async removeManyNodes(versionID: string, diagramID: string, { nodes }: { nodes: Realtime.RemoveNode[] }) {
    await this.atomicUpdateOne(this.versionIDDiagramIDFilter(versionID, diagramID), this.atomicRemoveManyNodes(nodes));

    return nodes;
  }

  async patchManyNodes(versionID: string, diagramID: string, nodePatches: Array<{ nodeID: string; patch: Struct }>) {
    const sets = nodePatches.map(({ nodeID, patch }) => ({
      sets: Object.entries(patch).map(([key, value]) => ({ path: key, value })),
      entityID: nodeID,
    }));

    return this.atomicUpdateOne(this.versionIDDiagramIDFilter(versionID, diagramID), [this.atomicNode.setMany(sets)]);
  }

  async patchNode(versionID: string, diagramID: string, nodeID: string, patch: Struct) {
    return this.patchManyNodes(versionID, diagramID, [{ nodeID, patch }]);
  }

  async updateNodeCoords(versionID: string, diagramID: string, nodes: Record<string, [number, number]>) {
    const nodePatches = Object.entries(nodes).map(([nodeID, coords]) => ({ nodeID, patch: { coords } }));

    await this.patchManyNodes(versionID, diagramID, nodePatches);

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
      await this.atomicUpdateOne(this.versionIDDiagramIDFilter(versionID, diagramID), updates);
    }
  }

  async pullManyNodesData(versionID: string, diagramID: string, nodePulls: Array<{ nodeID: string; pulls: Atomic.PullOperation[] }>) {
    await this.atomicUpdateOne(this.versionIDDiagramIDFilter(versionID, diagramID), [
      this.atomicNodeData.pullMany(nodePulls.map(({ nodeID, pulls }) => ({ entityID: nodeID, pulls }))),
    ]);
  }

  async pullNodeData(versionID: string, diagramID: string, nodeID: string, pulls: Atomic.PullOperation[]) {
    await this.atomicUpdateOne(this.versionIDDiagramIDFilter(versionID, diagramID), [this.atomicNodeData.pull(nodeID, pulls)]);
  }

  async pushManyNodesData(versionID: string, diagramID: string, nodePushes: Array<{ nodeID: string; pushes: Atomic.PushOperation[] }>) {
    await this.atomicUpdateOne(this.versionIDDiagramIDFilter(versionID, diagramID), [
      this.atomicNodeData.pushMany(nodePushes.map(({ nodeID, pushes }) => ({ entityID: nodeID, pushes }))),
    ]);
  }

  async pushNodeData(versionID: string, diagramID: string, nodeID: string, pushes: Atomic.PushOperation[]) {
    await this.atomicUpdateOne(this.versionIDDiagramIDFilter(versionID, diagramID), [this.atomicNodeData.push(nodeID, pushes)]);
  }

  async unsetManyNodesData(versionID: string, diagramID: string, nodeUnsets: Array<{ nodeID: string; unsets: Atomic.UnsetOperation[] }>) {
    await this.atomicUpdateOne(this.versionIDDiagramIDFilter(versionID, diagramID), [
      this.atomicNodeData.unsetMany(nodeUnsets.map(({ nodeID, unsets }) => ({ entityID: nodeID, unsets }))),
    ]);
  }

  async unsetNodeData(versionID: string, diagramID: string, nodeID: string, unsets: Atomic.UnsetOperation[]) {
    await this.atomicUpdateOne(this.versionIDDiagramIDFilter(versionID, diagramID), [this.atomicNodeData.unset(nodeID, unsets)]);
  }

  async patchManyNodesData(versionID: string, diagramID: string, nodePatches: Array<{ nodeID: string; patches: Atomic.SetOperation[] }>) {
    await this.atomicUpdateOne(this.versionIDDiagramIDFilter(versionID, diagramID), [
      this.atomicNodeData.setMany(nodePatches.map(({ nodeID, patches }) => ({ entityID: nodeID, sets: patches }))),
    ]);
  }

  async patchNodeData(versionID: string, diagramID: string, nodeID: string, patches: Atomic.SetOperation[]) {
    const data = this.atomicNodeData.set(nodeID, patches);
    await this.atomicUpdateOne(this.versionIDDiagramIDFilter(versionID, diagramID), [data]);
  }

  private async reorderNodeData(versionID: string, diagramID: string, nodeID: string, { path, match, index }: Atomic.ReorderOperation) {
    const { nodes } = await this.findOneAndAtomicUpdate(this.versionIDDiagramIDFilter(versionID, diagramID), [
      this.atomicNodeData.pull(nodeID, [{ path, match }]),
    ]);

    /* eslint-disable you-dont-need-lodash-underscore/get, you-dont-need-lodash-underscore/find */
    const array = _.get(nodes[nodeID].data, path) as unknown[];
    const item = _.find(array, match);
    /* eslint-enable you-dont-need-lodash-underscore/get, you-dont-need-lodash-underscore/find */

    if (!item) throw new Error('Could not find item to reorder');

    await this.atomicUpdateByID(diagramID, [this.atomicNodeData.push(nodeID, [{ path, value: item, index }])]);
  }

  async addByKeyLink(versionID: string, diagramID: string, nodeID: string, link: { key: string; target: string; data?: BaseModels.LinkData }) {
    await this.patchNodeData(versionID, diagramID, nodeID, [
      { path: DiagramModel.byKeyPortPath(link.key, 'target'), value: link.target },
      { path: DiagramModel.byKeyPortPath(link.key, 'data'), value: link.data ?? {} },
    ]);
  }

  async addBuiltInLink(
    versionID: string,
    diagramID: string,
    nodeID: string,
    link: { type: BaseModels.PortType; target: string; data?: BaseModels.LinkData }
  ) {
    await this.patchNodeData(versionID, diagramID, nodeID, [
      { path: DiagramModel.builtInPortPath(link.type, 'target'), value: link.target },
      { path: DiagramModel.builtInPortPath(link.type, 'data'), value: link.data ?? {} },
    ]);
  }

  async addDynamicLink(versionID: string, diagramID: string, nodeID: string, link: { portID: string; target: string; data?: BaseModels.LinkData }) {
    await this.patchNodeData(versionID, diagramID, nodeID, [
      { path: DiagramModel.dynamicPortPath(link.portID, 'target'), value: link.target },
      { path: DiagramModel.dynamicPortPath(link.portID, 'data'), value: link.data ?? {} },
    ]);
  }

  async removeManyLinks(versionID: string, diagramID: string, links: Realtime.LinkDelete[]) {
    const patches = links.map((link) => ({
      nodeID: link.nodeID,
      patches: [{ path: DiagramModel.portPath(link, 'target'), value: null }],
    }));

    await this.patchManyNodesData(versionID, diagramID, patches);

    return links;
  }

  async patchManyLinks(versionID: string, diagramID: string, linkPatches: Realtime.LinkPatch[]) {
    const patches = linkPatches.map((patch) => ({
      nodeID: patch.nodeID,
      patches: Object.entries(patch.data).map(([key, value]) => ({ path: DiagramModel.portPath(patch, `data.${key}`), value })),
    }));

    await this.patchManyNodesData(versionID, diagramID, patches);

    return linkPatches;
  }

  async removeManyPorts(
    versionID: string,
    diagramID: string,
    { ports, nodeID, removeNodes }: { ports: Realtime.PortDelete[]; nodeID: string; removeNodes: Realtime.RemoveNode[] }
  ) {
    await this.atomicUpdateOne(this.versionIDDiagramIDFilter(versionID, diagramID), [
      this.atomicNodeData.unset(
        nodeID,
        ports.map((port) => ({ path: DiagramModel.portPath(port) }))
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
    await this.atomicUpdateOne(this.versionIDDiagramIDFilter(versionID, diagramID), [
      this.atomicNodeData.unset(nodeID, [{ path: DiagramModel.builtInPortPath(type) }]),

      ...this.atomicRemoveManyNodes(removeNodes),
    ]);

    return type;
  }

  async removeDynamicPort(
    versionID: string,
    diagramID: string,
    { nodeID, portID, removeNodes }: { nodeID: string; portID: string; removeNodes: Realtime.RemoveNode[] }
  ) {
    await this.atomicUpdateOne(this.versionIDDiagramIDFilter(versionID, diagramID), [
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
    await this.patchNodeData(versionID, diagramID, nodeID, [{ path: DiagramModel.byKeyPortPath(key), value: port }]);

    return port;
  }

  async addBuiltInPort(versionID: string, diagramID: string, nodeID: string, type: BaseModels.PortType, port: BaseModels.BasePort) {
    await this.patchNodeData(versionID, diagramID, nodeID, [{ path: DiagramModel.builtInPortPath(type), value: port }]);

    return port;
  }

  async addDynamicPort(versionID: string, diagramID: string, nodeID: string, port: BaseModels.BasePort, index?: number) {
    await this.pushNodeData(versionID, diagramID, nodeID, [{ path: 'portsV2.dynamic', value: port, index }]);

    return port;
  }

  async addMenuItem(versionID: string, diagramID: string, value: BaseModels.Diagram.MenuItem, index?: number) {
    await this.atomicUpdateOne(
      {
        ...this.versionIDDiagramIDFilter(versionID, diagramID),
        menuItems: { $not: { $elemMatch: { sourceID: value.sourceID } } },
      },
      [Atomic.push([{ path: 'menuItems', value, index }])]
    );
  }

  async removeMenuItem(versionID: string, diagramID: string, sourceID: string) {
    await this.atomicUpdateOne(this.versionIDDiagramIDFilter(versionID, diagramID), [Atomic.pull([{ path: 'menuItems', match: { sourceID } }])]);
  }

  /**
   * @deprecated should be removed with Subprotocol 1.3.0
   */
  async reorderMenuNodeIDs(versionID: string, diagramID: string, { index, nodeID }: { index: number; nodeID: string }) {
    await this.atomicUpdateOne(this.versionIDDiagramIDFilter(versionID, diagramID), [Atomic.pull([{ path: 'menuNodeIDs', match: nodeID }])]);
    await this.atomicUpdateOne(this.versionIDDiagramIDFilter(versionID, diagramID), [Atomic.push([{ path: 'menuNodeIDs', value: nodeID, index }])]);
  }

  async reorderMenuItems(versionID: string, diagramID: string, { index, sourceID }: { index: number; sourceID: string }) {
    const diagram = await this.findOneAndAtomicUpdate(this.versionIDDiagramIDFilter(versionID, diagramID), [
      Atomic.pull([{ path: 'menuItems', match: { sourceID } }]),
    ]);

    const item = diagram.menuItems?.find((folder) => folder.sourceID === sourceID);

    if (!item) throw new Error('Could not find item to reorder');

    await this.addMenuItem(versionID, diagramID, item, index);
  }

  async syncCustomBlockPorts(versionID: string, diagramID: string, updatePatch: Record<string, { label: string; portID: string }[]>) {
    await this.pushManyNodesData(
      versionID,
      diagramID,
      Object.keys(updatePatch).reduce<Array<{ nodeID: string; pushes: Atomic.PushOperation[] }>>((nodeData, nodeID) => {
        return [
          ...nodeData,
          {
            nodeID,
            pushes: [
              {
                path: 'portsV2.dynamic',
                value: updatePatch[nodeID].map(({ label, portID }) => ({
                  id: portID,
                  type: label,
                  target: null,
                })),
              },
            ],
          },
        ];
      }, [])
    );
  }
}

export default DiagramModel;
