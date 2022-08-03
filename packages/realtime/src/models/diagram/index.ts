/* eslint-disable sonarjs/no-nested-template-literals */
import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { Nullish, Struct, Utils } from '@voiceflow/common';
import { LinkDelete, LinkPatch, NodePortRemap, PortDelete } from '@voiceflow/realtime-sdk';
import _ from 'lodash';
import Mongo, { OptionalId } from 'mongodb';

import AbstractModel from '../_mongo';
import { Atomic, AtomicEntity } from '../utils';

const { ObjectId } = Mongo;

interface ManyNodeDataUpdate extends Atomic.Update {
  nodeID: string;
}

class DiagramModel extends AbstractModel<BaseModels.Diagram.Model> {
  public collectionName = 'diagrams';

  private static nodePath = (nodeID: string, path?: string): string => `nodes.${nodeID}${path ? `.${path}` : ''}`;

  private static nodeDataPath = (nodeID: string, path?: string): string => DiagramModel.nodePath(nodeID, `data${path ? `.${path}` : ''}`);

  private static dynamicPortPath = (portID: string, path?: string) => ['portsV2.dynamic', { id: portID }, ...(path ? [path] : [])];

  private static builtInPortPath = (type: BaseModels.PortType, path?: string) => `portsV2.builtIn.${type}${path ? `.${path}` : ''}`;

  private static byKeyPortPath = (key: string, path?: string) => `portsV2.byKey.${key}${path ? `.${path}` : ''}`;

  private static portPath = ({ type, key, portID }: PortDelete, path?: string) => {
    if (type) return DiagramModel.builtInPortPath(type, path);
    if (key) return DiagramModel.byKeyPortPath(key, path);
    if (portID) return DiagramModel.dynamicPortPath(portID, path);
    return '';
  };

  private atomicNode = new AtomicEntity(DiagramModel.nodePath);

  private atomicNodeData = new AtomicEntity(DiagramModel.nodeDataPath);

  atomicNodePortRemap(nodePortRemaps?: NodePortRemap[]) {
    if (!nodePortRemaps?.length) return [];

    const patches = nodePortRemaps.map(({ nodeID, ports, targetNodeID }) => ({
      entityID: nodeID,
      sets: [
        ...ports.filter(({ type, key }) => type || key).map((port) => ({ path: DiagramModel.portPath(port, 'target'), value: targetNodeID })),
        { path: 'portsV2.dynamic.$[].target', value: targetNodeID },
      ],
    }));

    return [this.atomicNodeData.setMany(patches)];
  }

  async findManyByVersion(versionID: string, filter?: string[]) {
    return this.findMany({ versionID: new ObjectId(versionID) }, filter);
  }

  async addStep({
    step,
    index,
    diagramID,
    parentNodeID,
    nodePortRemaps,
  }: {
    step: BaseModels.BaseStep;
    index?: Nullish<number>;
    diagramID: string;
    parentNodeID: string;
    nodePortRemaps?: NodePortRemap[];
  }) {
    const isIntent = step.type === BaseNode.NodeType.INTENT;

    await this.atomicUpdateById(diagramID, [
      ...(isIntent ? [Atomic.push([{ path: 'intentStepIDs', value: [step.nodeID] }])] : []),

      this.atomicNode.set(step.nodeID, [{ path: '', value: step }]),

      this.atomicNodeData.push(parentNodeID, [{ path: 'steps', value: step.nodeID, index }]),

      ...this.atomicNodePortRemap(nodePortRemaps),
    ]);

    return step;
  }

  async addManyNodes(diagramID: string, nodes: BaseModels.BaseDiagramNode[], nodePortRemaps?: NodePortRemap[]) {
    const intentStepIDs = nodes.flatMap((node) => (node.type === BaseNode.NodeType.INTENT ? [node.nodeID] : []));

    await this.atomicUpdateById(diagramID, [
      ...(intentStepIDs.length ? [Atomic.push([{ path: 'intentStepIDs', value: intentStepIDs }])] : []),

      this.atomicNode.setMany(nodes.map((node) => ({ entityID: node.nodeID, sets: [{ path: '', value: node }] }))),
      ...this.atomicNodePortRemap(nodePortRemaps),
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
    await this.atomicUpdateById(diagramID, [
      this.atomicNode.set(parentNode.nodeID, [{ path: '', value: parentNode }]),
      this.atomicNodeData.pull(sourceParentNodeID, [{ path: 'steps', match: { $in: stepIDs } }]),
    ]);

    return stepIDs;
  }

  async reorderSteps({
    index,
    stepID,
    diagramID,
    parentNodeID,
    nodePortRemaps,
  }: {
    index: number;
    stepID: string;
    diagramID: string;
    parentNodeID: string;
    nodePortRemaps?: NodePortRemap[];
  }) {
    const remapQuery = this.atomicNodePortRemap(nodePortRemaps);

    await this.atomicUpdateById(diagramID, [this.atomicNodeData.pull(parentNodeID, [{ path: 'steps', match: stepID }]), ...remapQuery]);
    await this.atomicUpdateById(diagramID, [this.atomicNodeData.push(parentNodeID, [{ path: 'steps', value: stepID, index }])]);

    return stepID;
  }

  async transplantSteps({
    index,
    stepIDs,
    diagramID,
    removeSource,
    nodePortRemaps,
    sourceParentNodeID,
    targetParentNodeID,
  }: {
    index: number;
    stepIDs: string[];
    diagramID: string;
    removeSource?: boolean;
    nodePortRemaps?: NodePortRemap[];
    sourceParentNodeID: string;
    targetParentNodeID: string;
  }) {
    const remapQuery = this.atomicNodePortRemap(nodePortRemaps);

    await this.atomicUpdateById(diagramID, [
      removeSource
        ? this.atomicNode.unset(sourceParentNodeID, [{ path: '' }])
        : this.atomicNodeData.pull(sourceParentNodeID, [{ path: 'steps', match: { $in: stepIDs } }]),

      this.atomicNodeData.push(targetParentNodeID, [{ path: 'steps', value: stepIDs, index }]),

      ...remapQuery,
    ]);

    return stepIDs;
  }

  async removeManyNodes(diagramID: string, nodes: { parentNodeID: string; stepID?: Nullish<string> }[]) {
    const [stepsToPull, nodesToPull] = Utils.array.separate(nodes, ({ stepID }) => !!stepID);
    const parentNodeIDsToPull = new Set(nodesToPull.map(({ parentNodeID }) => parentNodeID));
    const stepIDsToPull = stepsToPull.map(({ stepID }) => stepID);

    // do not attempt to pull a step from a node that is also being deleted
    const stepsToPullFromNodes = stepsToPull.filter(({ parentNodeID }) => !parentNodeIDsToPull.has(parentNodeID));

    await this.atomicUpdateById(diagramID, [
      ...(stepIDsToPull.length ? [Atomic.pull([{ path: 'intentStepIDs', match: { $in: stepIDsToPull } }])] : []),

      this.atomicNode.unsetMany(nodes.map(({ stepID, parentNodeID }) => ({ entityID: stepID ?? parentNodeID, unsets: [{ path: '' }] }))),

      ...(stepsToPullFromNodes.length
        ? [
            this.atomicNodeData.pullMany(
              stepsToPullFromNodes.map(({ parentNodeID, stepID }) => ({ entityID: parentNodeID, pulls: [{ path: 'steps', match: stepID }] }))
            ),
          ]
        : []),
    ]);

    return nodes;
  }

  async patchManyNodes(diagramID: string, nodePatches: Array<{ nodeID: string; patch: Struct }>) {
    const sets = nodePatches.map(({ nodeID, patch }) => ({
      sets: Object.entries(patch).map(([key, value]) => ({ path: key, value })),
      entityID: nodeID,
    }));

    return this.atomicUpdateById(diagramID, [this.atomicNode.setMany(sets)]);
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
      await this.atomicUpdateById(diagramID, updates);
    }
  }

  async pullManyNodesData(diagramID: string, nodePulls: Array<{ nodeID: string; pulls: Atomic.PullOperation[] }>) {
    await this.atomicUpdateById(diagramID, [this.atomicNodeData.pullMany(nodePulls.map(({ nodeID, pulls }) => ({ entityID: nodeID, pulls })))]);
  }

  async pullNodeData(diagramID: string, nodeID: string, pulls: Atomic.PullOperation[]) {
    await this.atomicUpdateById(diagramID, [this.atomicNodeData.pull(nodeID, pulls)]);
  }

  async pushManyNodesData(diagramID: string, nodePushes: Array<{ nodeID: string; pushes: Atomic.PushOperation[] }>) {
    await this.atomicUpdateById(diagramID, [this.atomicNodeData.pushMany(nodePushes.map(({ nodeID, pushes }) => ({ entityID: nodeID, pushes })))]);
  }

  async pushNodeData(diagramID: string, nodeID: string, pushes: Atomic.PushOperation[]) {
    await this.atomicUpdateById(diagramID, [this.atomicNodeData.push(nodeID, pushes)]);
  }

  async unsetManyNodesData(diagramID: string, nodeUnsets: Array<{ nodeID: string; unsets: Atomic.UnsetOperation[] }>) {
    await this.atomicUpdateById(diagramID, [this.atomicNodeData.unsetMany(nodeUnsets.map(({ nodeID, unsets }) => ({ entityID: nodeID, unsets })))]);
  }

  async unsetNodeData(diagramID: string, nodeID: string, unsets: Atomic.UnsetOperation[]) {
    await this.atomicUpdateById(diagramID, [this.atomicNodeData.unset(nodeID, unsets)]);
  }

  async patchManyNodesData(diagramID: string, nodePatches: Array<{ nodeID: string; patches: Atomic.SetOperation[] }>) {
    await this.atomicUpdateById(diagramID, [
      this.atomicNodeData.setMany(nodePatches.map(({ nodeID, patches }) => ({ entityID: nodeID, sets: patches }))),
    ]);
  }

  async patchNodeData(diagramID: string, nodeID: string, patches: Atomic.SetOperation[]) {
    await this.atomicUpdateById(diagramID, [this.atomicNodeData.set(nodeID, patches)]);
  }

  private async reorderNodeData(diagramID: string, nodeID: string, { path, match, index }: Atomic.ReorderOperation) {
    const { nodes } = await this.findAndAtomicUpdateById(diagramID, [this.atomicNodeData.pull(nodeID, [{ path, match }])]);

    /* eslint-disable you-dont-need-lodash-underscore/get, you-dont-need-lodash-underscore/find */
    const array = _.get(nodes[nodeID].data, path) as unknown[];
    const item = _.find(array, match);
    /* eslint-enable you-dont-need-lodash-underscore/get, you-dont-need-lodash-underscore/find */

    if (!item) throw new Error('Could not find item to reorder');

    await this.atomicUpdateById(diagramID, [this.atomicNodeData.push(nodeID, [{ path, value: item, index }])]);
  }

  async addByKeyLink(diagramID: string, nodeID: string, key: string, target: string) {
    await this.patchNodeData(diagramID, nodeID, [{ path: DiagramModel.byKeyPortPath(key, 'target'), value: target }]);
  }

  async addBuiltInLink(diagramID: string, nodeID: string, type: BaseModels.PortType, target: string) {
    await this.patchNodeData(diagramID, nodeID, [{ path: DiagramModel.builtInPortPath(type, 'target'), value: target }]);
  }

  async addDynamicLink(diagramID: string, nodeID: string, portID: string, target: string) {
    await this.patchNodeData(diagramID, nodeID, [{ path: DiagramModel.dynamicPortPath(portID, 'target'), value: target }]);
  }

  async removeManyLinks(diagramID: string, links: LinkDelete[]) {
    const patches = links.map((link) => ({
      nodeID: link.nodeID,
      patches: [{ path: DiagramModel.portPath(link, 'target'), value: null }],
    }));

    await this.patchManyNodesData(diagramID, patches);

    return links;
  }

  async patchManyLinks(diagramID: string, linkPatches: LinkPatch[]) {
    const patches = linkPatches.map((patch) => ({
      nodeID: patch.nodeID,
      patches: Object.entries(patch.data).map(([key, value]) => ({ path: DiagramModel.portPath(patch, `data.${key}`), value })),
    }));

    await this.patchManyNodesData(diagramID, patches);

    return linkPatches;
  }

  async removeManyPorts(diagramID: string, nodeID: string, ports: PortDelete[]) {
    await this.unsetNodeData(
      diagramID,
      nodeID,
      ports.map((port) => ({ path: DiagramModel.portPath(port) }))
    );

    return ports;
  }

  async removeBuiltInPort(diagramID: string, nodeID: string, type: BaseModels.PortType) {
    await this.unsetNodeData(diagramID, nodeID, [{ path: DiagramModel.builtInPortPath(type) }]);

    return type;
  }

  async removeDynamicPort(diagramID: string, nodeID: string, portID: string) {
    await this.pullNodeData(diagramID, nodeID, [{ path: 'portsV2.dynamic', match: { id: portID } }]);

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

  async create(diagramData: OptionalId<BaseModels.Diagram.Model>) {
    const data = { ...diagramData, versionID: new ObjectId(diagramData.versionID) };
    return this.insertOne(data);
  }
}

export default DiagramModel;
