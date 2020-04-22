import cuid from 'cuid';
import { partition as _partition } from 'lodash';
import { batch } from 'react-redux';

import { BlockType } from '@/constants';
import { BlockVariant } from '@/constants/canvas';
import * as Creator from '@/ducks/creator';
import { clearModal, setConfirm } from '@/ducks/modal';
import * as Realtime from '@/ducks/realtime';
import { EntityMap, Node, NodeData } from '@/models';
import { MergeStatus } from '@/pages/Canvas/constants';
import { Pair, Point } from '@/types';
import { isCommandNode } from '@/utils/node';

import { EngineConsumer, nodeFactory } from './utils';

class NodeManager extends EngineConsumer {
  internal = {
    add: (node: Creator.NodeDescriptor, data: Creator.DataDescriptor, parentNode: Creator.ParentNodeDescriptor) => {
      if (node.type === BlockType.COMMENT) {
        this.dispatch(Creator.addNode(node, data));
      } else {
        this.dispatch(Creator.addWrappedNode(node, data, parentNode));
      }
    },

    addMany: (entities: EntityMap, position: Point) => this.dispatch(Creator.addManyNodes(entities, position)),

    addNested: (parentNodeID: string, node: Creator.NodeDescriptor, data: Creator.DataDescriptor, mergedNodeID: string) => {
      this.dispatch(Creator.addNestedNode(parentNodeID, node, data, mergedNodeID));
      this.redrawNestedLinks(parentNodeID);
    },

    insertNested: (parentNodeID: string, index: number, nodeID: string) => {
      this.dispatch(Creator.insertNestedNode(parentNodeID, index, nodeID));

      this.redrawNestedLinks(parentNodeID);
    },

    unmerge: (nodeID: string, position: Point, parentNode: Creator.ParentNodeDescriptor) => {
      const node = this.engine.getNodeByID(nodeID);

      this.saveLocation(node.parentNode!);

      this.dispatch(Creator.unmergeNode(nodeID, position, parentNode));

      this.redrawNestedLinks(node.parentNode!);
    },

    merge: (mergedNodeID: string, sourceNodeID: string, targetNodeID: string, position: Point) => {
      this.dispatch(Creator.mergeNodes(sourceNodeID, targetNodeID, position, mergedNodeID));

      this.redrawLinks(sourceNodeID);
      this.redrawLinks(targetNodeID);
    },

    updateData: (nodeID: string, data: Partial<NodeData<unknown>>) => {
      this.dispatch(Creator.updateNodeData(nodeID, data));
    },

    remove: (nodeID: string) => {
      this.engine.activation.deactivate(nodeID);
      const { parentNode } = this.engine.getNodeByID(nodeID);

      // save last location of parent node in case unmerging
      if (parentNode) {
        this.saveLocation(parentNode);
      }

      this.dispatch(Creator.removeNode(nodeID));
    },

    removeMany: (nodeIDs: string[]) => {
      const nodes = nodeIDs.map(this.engine.getNodeByID);
      const removedIDs: string[] = [];
      const parentIDs: string[] = [];

      nodes.forEach((node) => {
        this.engine.activation.deactivate(node.id);

        if (node.parentNode) {
          if (!parentIDs.includes(node.parentNode)) {
            this.saveLocation(node.parentNode);
            parentIDs.push(node.parentNode);
          }

          if (!nodeIDs.includes(node.parentNode)) {
            removedIDs.push(node.id);
          }
        } else {
          removedIDs.push(node.id);
        }
      });

      this.dispatch(Creator.removeNodes(removedIDs));
    },

    translate: (nodeID: string, movement: Pair<number>) => {
      this.api(nodeID)?.translate?.(movement);
      this.updateOrigin(nodeID, movement);
      this.translateAllLinks(nodeID, movement);
    },

    translateBaseOnOrigin: (nodeID: string, movement: Pair<number>, origin: Point) => {
      const node = this.engine.nodes.get(nodeID);

      if (node) {
        this.internal.translate(nodeID, [movement[0] - (node.x - origin[0]), movement[1] - (node.y - origin[1])]);
      }
    },

    translateMany: (nodeIDs: string[], movement: Pair<number>) => nodeIDs.forEach((nodeID) => this.internal.translate(nodeID, movement)),

    translateManyOnOrigins: (nodeIDs: string[], movement: Pair<number>, origins: Point[]) => {
      nodeIDs.forEach((nodeID, i) => this.internal.translateBaseOnOrigin(nodeID, movement, origins[i]));
    },
  };

  api(nodeID: string) {
    return this.engine.nodes.get(nodeID)?.api;
  }

  // crud methods

  // eslint-disable-next-line max-params
  async add(type: BlockType, [x, y]: Point, factoryData?: Partial<NodeData<unknown>>) {
    const nodeID = cuid();
    const { node, data } = nodeFactory(type, factoryData);
    const augmentedNode = { ...node, x, y, id: nodeID };
    const parentNode = { id: cuid(), ports: { in: [{ id: cuid() }], out: [] } };

    await this.engine.realtime.sendUpdate(Realtime.addNode(augmentedNode, data, parentNode));
    this.internal.add(augmentedNode, data, parentNode);

    this.engine.saveHistory();
    this.engine.focus.set(nodeID);

    return nodeID;
  }

  async addMany(entities: EntityMap, position: Point) {
    await this.engine.realtime.sendUpdate(Realtime.addManyNodes(entities, position));
    this.internal.addMany(entities, position);
    this.engine.saveHistory();
  }

  async duplicate(nodeID: string) {
    const duplicateNodeID = await this.engine.diagram.duplicateNode(nodeID);

    this.engine.saveHistory();
    this.engine.focus.set(duplicateNodeID);
  }

  async updateData(nodeID: string, data: Partial<NodeData<unknown>>, save = true) {
    await this.engine.realtime.sendUpdate(Realtime.updateNodeData(nodeID, data));
    this.internal.updateData(nodeID, data);

    if (save) {
      this.engine.saveHistory();
    }
  }

  isRemovingLocked(nodeIDs: string[], remove: (nodeIDs: string[]) => Promise<void>) {
    const lockedNodes = this.engine.getDeleteLockedNodes();
    const combinedNodes = nodeIDs.map(this.engine.getNodeByID).filter((node) => node.type === BlockType.COMBINED);

    const unRemovableCombinedNodeIDs = combinedNodes
      .filter((node) => node.combinedNodes.some((nestedNodeID) => lockedNodes[nestedNodeID]))
      .map((node) => node.id);
    const [lockedNodeIDs, unlockedNodesIDs] = _partition(nodeIDs, (id) => lockedNodes[id] || unRemovableCombinedNodeIDs.includes(id));

    if (lockedNodeIDs.length) {
      // eslint-disable-next-line no-nested-ternary
      const text = unlockedNodesIDs.length ? 'Some blocks' : nodeIDs.length > 1 ? 'These blocks' : 'This block';

      this.dispatch(
        setConfirm({
          warning: false,
          text: `${text} being actively working on and cannot be deleted`,
          confirm: () => (unlockedNodesIDs.length ? remove(unlockedNodesIDs) : this.dispatch(clearModal())),
        })
      );
      return true;
    }
    return false;
  }

  isRemovingDefaultCommand(nodes: Node[]) {
    const commandNodes = nodes.filter((node) => isCommandNode(node));
    const commandNodesIDs = commandNodes.map(({ id }) => id);
    const commandNodeData = commandNodesIDs.map<NodeData<NodeData.Command>>(this.engine.getDataByNodeID);
    // if the deleted node is not a help intent or a stop intent
    const deletingStopIntent = commandNodeData.some((data) => data?.alexa?.intent === 'AMAZON.StopIntent');
    const deletingHelpIntent = commandNodeData.some((data) => data?.alexa?.intent === 'AMAZON.HelpIntent');

    if ((deletingStopIntent || deletingHelpIntent) && this.engine.isRootDiagram()) {
      const homeBlockCombinedNodesIDs = this.engine.getNodeByID(commandNodes[0].parentNode!).combinedNodes;
      const remainedCommandsData = homeBlockCombinedNodesIDs
        .filter((el) => !commandNodesIDs.includes(el))
        .map<NodeData<NodeData.Command>>(this.engine.getDataByNodeID);

      // logic: user deleting stop intent and there are no more stop intent left
      const missingStopIntent = remainedCommandsData.every((data) => data?.alexa?.intent !== 'AMAZON.StopIntent') && deletingStopIntent;
      const missingHelpIntent = remainedCommandsData.every((data) => data?.alexa?.intent !== 'AMAZON.HelpIntent') && deletingHelpIntent;
      const requiredCommand = (missingStopIntent && 'AMAZON.StopIntent') || (missingHelpIntent && 'AMAZON.HelpIntent');

      if (requiredCommand) {
        this.dispatch(
          setConfirm({
            warning: false,
            text: `${requiredCommand} is required by default`,
            confirm: () => this.dispatch(clearModal()),
          })
        );
        return requiredCommand;
      }
    }
    return false;
  }

  async validateRemove(nodeIDs: string[], remove: (nodeIDs: string[]) => Promise<void>) {
    const removableNodes = nodeIDs.map(this.engine.getNodeByID).filter((node) => node.type !== BlockType.START);
    const removableNodeIDs = removableNodes.map(({ id }) => id);

    if (this.isRemovingDefaultCommand(removableNodes) || this.isRemovingLocked(removableNodeIDs, remove)) return;

    const isSingleCombinedWithSingleStep =
      removableNodes.length === 1 && removableNodes[0].type === BlockType.COMBINED && removableNodes[0].combinedNodes.length === 1;

    if (!isSingleCombinedWithSingleStep && removableNodes.some((node) => [BlockType.COMBINED, BlockType.COMMAND].includes(node.type))) {
      this.dispatch(
        setConfirm({
          warning: true,
          text: `Are you sure you want to delete ${removableNodeIDs.length > 1 ? 'these blocks?' : 'this block?'}`,
          confirm: () => remove(removableNodeIDs),
        })
      );
      return;
    }

    await remove(removableNodeIDs);
  }

  remove(nodeID: string) {
    return this.validateRemove([nodeID], async ([removeNodeID]) => {
      await this.engine.realtime.sendUpdate(Realtime.removeNode(removeNodeID));
      this.internal.remove(removeNodeID);

      this.engine.saveHistory();
    });
  }

  removeMany(nodeIDs: string[]) {
    return this.validateRemove(nodeIDs, async (removableNodeIDs) => {
      await this.engine.realtime.sendUpdate(Realtime.removeManyNodes(removableNodeIDs));
      this.internal.removeMany(removableNodeIDs);
      this.engine.saveHistory();
    });
  }

  // nested node management methods

  async addNested(parentNodeID: string, type: BlockType) {
    const nodeID = cuid();
    const mergedNodeID = cuid();
    const { node, data } = nodeFactory(type);
    const augmentedNode = { ...node, id: nodeID };

    await this.engine.realtime.sendUpdate(Realtime.addNestedNode(parentNodeID, augmentedNode, data, mergedNodeID));
    this.internal.addNested(parentNodeID, augmentedNode, data, mergedNodeID);
    this.engine.saveHistory();
    this.engine.focus.set(nodeID);

    return nodeID;
  }

  async addNestedV2({
    parentNodeID,
    index,
    nodeID,
    type,
    factoryData,
    position,
  }: {
    parentNodeID: string;
    index: number;
    nodeID: string;
    type: BlockType;
    factoryData: Partial<NodeData<unknown>>;
    position: Point;
  }) {
    const childID = cuid();
    const combinedPortID = cuid();
    const { node, data } = nodeFactory(type, factoryData);
    const [x, y] = position;
    const augmentedNode = { ...node, x, y, id: childID };
    const parentNode = {
      id: nodeID,
      ports: { in: [{ id: combinedPortID }], out: [] },
    };

    batch(() => {
      this.internal.add(augmentedNode, data, parentNode);
      this.internal.insertNested(parentNodeID, index, nodeID);
    });

    await this.engine.realtime.sendUpdate(Realtime.addNode(augmentedNode, data, parentNode));
    await this.engine.realtime.sendUpdate(Realtime.insertNestedNode(parentNodeID, index, nodeID));

    this.engine.saveHistory();

    this.engine.focus.set(childID);
  }

  async insertNested(parentNodeID: string, index: number, nodeID: string) {
    this.internal.insertNested(parentNodeID, index, nodeID);
    await this.engine.realtime.sendUpdate(Realtime.insertNestedNode(parentNodeID, index, nodeID));

    this.engine.saveHistory();
  }

  async unmerge(nodeID: string, position: Point) {
    const parentNodeID = cuid();
    const parentPortID = cuid();
    const parentNode = {
      id: parentNodeID,
      ports: { in: [{ id: parentPortID }], out: [] },
    };

    await this.engine.realtime.sendUpdate(Realtime.unmergeNode(nodeID, position, parentNode));
    this.internal.unmerge(nodeID, position, parentNode);

    this.engine.saveHistory();
  }

  async merge(mergedNodeID: string, sourceNodeID: string, targetNodeID: string, invert?: boolean) {
    const { x, y } = this.engine.getNodeByID(invert ? sourceNodeID : targetNodeID);

    await this.engine.realtime.sendUpdate(Realtime.mergeNodes(mergedNodeID, sourceNodeID, targetNodeID, [x, y]));
    this.internal.merge(mergedNodeID, sourceNodeID, targetNodeID, [x, y]);
    this.engine.saveHistory();
  }

  // location / rendering methods

  async translate(nodeID: string, movement: Pair<number>, volatile = true) {
    if (this.engine.nodes.has(nodeID)) {
      const node = this.engine.nodes.get(nodeID)!;
      const origin: Point = [node.x, node.y];

      this.internal.translate(nodeID, movement);

      const action = Realtime.moveNode(nodeID, movement, origin);
      await this.engine.realtime[volatile ? 'sendVolatileUpdate' : 'sendUpdate'](action);
    }
  }

  async translateMany(nodeIDs: string[], movement: Pair<number>, volatile = true) {
    const activeNodeIDs = nodeIDs.filter((nodeID) => this.engine.nodes.has(nodeID));
    const origins = activeNodeIDs.map<Point>((nodeID) => {
      const node = this.engine.nodes.get(nodeID)!;

      return [node.x, node.y];
    });

    this.internal.translateMany(activeNodeIDs, movement);

    const action = Realtime.moveManyNodes(activeNodeIDs, movement, origins);
    await this.engine.realtime[volatile ? 'sendVolatileUpdate' : 'sendUpdate'](action);
  }

  saveLocation(nodeID: string) {
    if (!this.engine.nodes.has(nodeID)) return;

    const { x, y } = this.engine.nodes.get(nodeID)!;

    this.dispatch(Creator.updateNodeLocation(nodeID, [x, y]));
  }

  updateOrigin(nodeID: string, [moveX, moveY]: Pair<number>) {
    const node = this.engine.nodes.get(nodeID);

    if (node) {
      this.engine.nodes.set(nodeID, { ...node, x: node.x + moveX, y: node.y + moveY });
    }
  }

  setOrigin(nodeID: string, [x, y]: Point) {
    const node = this.engine.nodes.get(nodeID);

    if (node) {
      this.engine.nodes.set(nodeID, { ...node, x, y });
    }
  }

  translateAllLinks(nodeID: string, movement: Pair<number>) {
    const node = this.engine.getNodeByID(nodeID);

    if (!node) return;

    if (node.type === BlockType.COMBINED) {
      [nodeID, ...node.combinedNodes].forEach((combinedNodeID) => this.translateLinks(combinedNodeID, movement));
    } else {
      this.translateLinks(nodeID, movement);
    }
  }

  translateLinks(nodeID: string, movement: Pair<number>) {
    const node = this.engine.getNodeByID(nodeID);

    this.engine.getLinkIDsByNodeID(node.id).forEach((linkID) => {
      if (this.engine.links.has(linkID)) {
        const link = this.engine.getLinkByID(linkID);

        this.engine.link.translatePoint(linkID, movement, link.source.nodeID === nodeID);
      }
    });
  }

  drag(nodeID: string) {
    this.api(nodeID)?.drag?.();
  }

  drop(nodeID: string) {
    this.api(nodeID)?.drop?.();
  }

  setMergeStatus(nodeID: string, mergeStatus: MergeStatus) {
    this.api(nodeID)?.setMergeStatus?.(mergeStatus);
  }

  getBlockRect(nodeID: string) {
    return this.api(nodeID)!.getBlockRect!();
  }

  center(nodeID: string) {
    const [posX, posY] = this.api(nodeID)!.getPosition();

    const xOffset = window.innerWidth / 2;
    const yOffset = window.innerHeight / 2;

    const canvasAPI = this.engine.canvas!;

    canvasAPI.applyTransition();
    canvasAPI.setZoom(80);
    canvasAPI.setPosition([(xOffset - posX) * 0.8, (yOffset - posY - 100) * 0.8]);
  }

  rename(nodeID: string) {
    return this.api(nodeID)?.rename?.();
  }

  redraw(nodeID: string) {
    this.engine.dispatcher.redrawNode(nodeID);
  }

  redrawLinks(nodeID: string) {
    const node = this.engine.getNodeByID(nodeID);

    if (!node) return;

    node.ports.in.forEach((portID) => this.engine.port.redrawLinks(portID));
    node.ports.out.forEach((portID) => this.engine.port.redrawLinks(portID));

    if (node.combinedNodes.length) {
      this.redrawNestedLinks(nodeID);
    }
  }

  redrawNestedLinks(parentNodeID: string) {
    const node = this.engine.getNodeByID(parentNodeID);
    node?.combinedNodes.forEach((nodeID) => this.redrawLinks(nodeID));
  }

  updateBlockColor(nodeID: string, color: BlockVariant) {
    this.api(nodeID)?.updateBlockColor?.(color);
  }
}

export default NodeManager;
