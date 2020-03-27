import cuid from 'cuid';
import { partition as _partition } from 'lodash';

import { FeatureFlag } from '@/config/features';
import { BlockType } from '@/constants';
import * as Creator from '@/ducks/creator';
import { clearModal, setConfirm } from '@/ducks/modal';
import * as Realtime from '@/ducks/realtime';

import { EngineConsumer, nodeFactory } from './utils';

class NodeManager extends EngineConsumer {
  internal = {
    add: (node, data, nodeID) => this.dispatch(Creator.addNode(node, data, nodeID)),

    addWrapped: (node, data, nodeID, parentNodeID, parentPortID) =>
      this.dispatch(Creator.addWrappedNode(node, data, nodeID, parentNodeID, parentPortID)),

    addMany: (nodeGroup, position) => this.dispatch(Creator.addManyNodes(nodeGroup, position)),

    addNested: (parentNodeID, nodeID, node, data, mergedNodeID) => {
      this.dispatch(Creator.addNestedNode(parentNodeID, node, data, nodeID, mergedNodeID));
      this.redrawNestedLinks(parentNodeID);
    },

    insertNested: (parentNodeID, index, nodeID) => {
      this.dispatch(Creator.insertNestedNode(parentNodeID, index, nodeID));
      this.redrawNestedLinks(parentNodeID);
    },

    unmerge: (nodeID, position) => {
      const { parentNode } = this.engine.getNodeByID(nodeID);
      const isBlockRedesignEnabled = this.engine.isFeatureEnabled(FeatureFlag.BLOCK_REDESIGN);

      this.saveLocation(parentNode);
      this.dispatch(Creator.unmergeNode(nodeID, position, { isBlockRedesignEnabled }));
      this.redrawNestedLinks(parentNode);
    },

    merge: (mergedNodeID, sourceNodeID, targetNodeID, position) => {
      this.dispatch(Creator.mergeNodes(sourceNodeID, targetNodeID, position, mergedNodeID));

      this.redrawLinks(sourceNodeID);
      this.redrawLinks(targetNodeID);
    },

    updateData: (nodeID, data) => {
      this.dispatch(Creator.updateNodeData(nodeID, data));
    },

    remove: (nodeID) => {
      this.engine.activation.deactivate(nodeID);
      const { parentNode } = this.engine.getNodeByID(nodeID);

      // save last location of parent node in case unmerging
      if (parentNode) {
        this.saveLocation(parentNode);
      }

      this.dispatch(Creator.removeNode(nodeID));
    },

    removeMany: (nodeIDs) => {
      const nodes = nodeIDs.map(this.engine.getNodeByID);
      const removedIDs = [];
      const parentIDs = [];

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

    translate: (nodeID, movement) => {
      this.api(nodeID)?.translate?.(movement);
      this.updateOrigin(nodeID, movement);
      this.translateAllLinks(nodeID, movement);
    },

    translateBaseOnOrigin: (nodeID, movement, origin) => {
      const node = this.engine.nodes.get(nodeID);

      this.internal.translate(nodeID, [movement[0] - (node.x - origin[0]), movement[1] - (node.y - origin[1])]);
    },

    translateMany: (nodeIDs, movement) => nodeIDs.forEach((nodeID) => this.internal.translate(nodeID, movement)),
    translateManyOnOrigins: (nodeIDs, movement, origins) => {
      nodeIDs.forEach((nodeID, i) => this.internal.translateBaseOnOrigin(nodeID, movement, origins[i]));
    },
  };

  api(nodeID) {
    return this.engine.nodes.get(nodeID)?.api;
  }

  // crud methods

  // eslint-disable-next-line max-params
  async add(nodeID, type, [x, y], factoryData, parentNodeID = cuid(), parentPortID = cuid()) {
    const { node, data } = nodeFactory(type, factoryData);
    const augmentedNode = { ...node, x, y };

    if (this.engine.isFeatureEnabled(FeatureFlag.BLOCK_REDESIGN) && node.type !== BlockType.COMMENT) {
      await this.engine.realtime.sendUpdate(Realtime.addNode(augmentedNode, data, nodeID, parentNodeID, parentPortID));
      this.internal.addWrapped(augmentedNode, data, nodeID, parentNodeID, parentPortID);
    } else {
      await this.addSingle(augmentedNode, data, nodeID);
    }

    this.engine.saveHistory();
    this.engine.focus.set(nodeID);
  }

  async addSingle(node, data, nodeID) {
    await this.engine.realtime.sendUpdate(Realtime.addNode(node, data, nodeID));
    this.internal.add(node, data, nodeID);
  }

  async addMany(nodeGroup, position) {
    await this.engine.realtime.sendUpdate(Realtime.addManyNodes(nodeGroup, position));
    this.internal.addMany(nodeGroup, position);
    this.engine.saveHistory();
  }

  async duplicate(nodeID) {
    const duplicateNodeID = await this.engine.diagram.duplicateNode(nodeID, this.dispatch);

    this.engine.saveHistory();
    this.engine.focus.set(duplicateNodeID);
  }

  async updateData(nodeID, data, save = true) {
    await this.engine.realtime.sendUpdate(Realtime.updateNodeData(nodeID, data));
    this.internal.updateData(nodeID, data);

    if (save) {
      this.engine.saveHistory();
    }
  }

  isRemovingLocked(nodeIDs, remove) {
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

  isRemovingDefaultCommand(nodes) {
    const commandNodes = nodes.filter((node) => node.type === BlockType.COMMAND);
    const commandNodesIDs = commandNodes.map(({ id }) => id);
    // if the deleted node is not a help intent or a stop intent
    const deletingStopIntent = commandNodesIDs.map(this.engine.getDataByNodeID).some((data) => data?.alexa?.intent === 'AMAZON.StopIntent');
    const deletingHelpIntent = commandNodesIDs.map(this.engine.getDataByNodeID).some((data) => data?.alexa?.intent === 'AMAZON.HelpIntent');

    if ((deletingStopIntent || deletingHelpIntent) && this.engine.isRootDiagram()) {
      const homeBlockCombinedNodesIDs = this.engine.getNodeByID(commandNodes[0].parentNode).combinedNodes;
      const remainedCommandsData = homeBlockCombinedNodesIDs.filter((el) => !commandNodesIDs.includes(el)).map(this.engine.getDataByNodeID);

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

  validateRemove(nodeIDs, remove) {
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

    remove(removableNodeIDs);
  }

  remove(nodeID) {
    return this.validateRemove([nodeID], async ([removeNodeID]) => {
      await this.engine.realtime.sendUpdate(Realtime.removeNode(removeNodeID));
      this.internal.remove(removeNodeID);
      this.engine.saveHistory();
    });
  }

  removeMany(nodeIDs) {
    return this.validateRemove(nodeIDs, async (removableNodeIDs) => {
      await this.engine.realtime.sendUpdate(Realtime.removeManyNodes(removableNodeIDs));
      this.internal.removeMany(removableNodeIDs);
      this.engine.saveHistory();
    });
  }

  // nested node management methods

  async addNested(parentNodeID, nodeID, type, mergedNodeID = cuid()) {
    const { node, data } = nodeFactory(type);

    await this.engine.realtime.sendUpdate(Realtime.addNestedNode(parentNodeID, nodeID, node, data, mergedNodeID));
    this.internal.addNested(parentNodeID, nodeID, node, data, mergedNodeID);
    this.engine.saveHistory();
    this.engine.focus.set(nodeID);
  }

  async insertNested(parentNodeID, index, nodeID) {
    await this.engine.realtime.sendUpdate(Realtime.insertNestedNode(parentNodeID, index, nodeID));
    this.internal.insertNested(parentNodeID, index, nodeID);
    this.engine.saveHistory();
  }

  async unmerge(nodeID, position) {
    await this.engine.realtime.sendUpdate(Realtime.unmergeNode(nodeID, position));
    this.internal.unmerge(nodeID, position);
    this.engine.saveHistory();
  }

  async merge(mergedNodeID, sourceNodeID, targetNodeID, invert) {
    const { x, y } = this.engine.getNodeByID(invert ? sourceNodeID : targetNodeID);

    await this.engine.realtime.sendUpdate(Realtime.mergeNodes(mergedNodeID, sourceNodeID, targetNodeID, [x, y]));
    this.internal.merge(mergedNodeID, sourceNodeID, targetNodeID, [x, y]);
    this.engine.saveHistory();
  }

  // location / rendering methods

  async translate(nodeID, movement, volatile = true) {
    if (this.engine.nodes.has(nodeID)) {
      const node = this.engine.nodes.get(nodeID);
      const origin = [node.x, node.y];

      this.internal.translate(nodeID, movement);

      const action = Realtime.moveNode(nodeID, movement, origin);
      await this.engine.realtime[volatile ? 'sendVolatileUpdate' : 'sendUpdate'](action);
    }
  }

  async translateMany(nodeIDs, movement, volatile = true) {
    const activeNodeIDs = nodeIDs.filter((nodeID) => this.engine.nodes.has(nodeID));
    const origins = activeNodeIDs.map((nodeID) => {
      const node = this.engine.nodes.get(nodeID);

      return [node.x, node.y];
    });

    this.internal.translateMany(activeNodeIDs, movement);

    const action = Realtime.moveManyNodes(activeNodeIDs, movement, origins);
    await this.engine.realtime[volatile ? 'sendVolatileUpdate' : 'sendUpdate'](action);
  }

  saveLocation(nodeID) {
    if (!this.engine.nodes.has(nodeID)) return;

    const { x, y } = this.engine.nodes.get(nodeID);

    this.dispatch(Creator.updateNodeLocation(nodeID, [x, y]));
  }

  updateOrigin(nodeID, [moveX, moveY]) {
    const node = this.engine.nodes.get(nodeID);

    this.engine.nodes.set(nodeID, { ...node, x: node.x + moveX, y: node.y + moveY });
  }

  setOrigin(nodeID, [x, y]) {
    const node = this.engine.nodes.get(nodeID);

    this.engine.nodes.set(nodeID, { ...node, x, y });
  }

  translateAllLinks(nodeID, movement) {
    const node = this.engine.getNodeByID(nodeID);
    if (this.engine.isFeatureEnabled(FeatureFlag.BLOCK_REDESIGN) && node.type === BlockType.COMBINED) {
      [nodeID, ...node.combinedNodes].forEach((combinedNodeID) => this.translateLinks(combinedNodeID, movement));
    } else if (node.type === BlockType.COMBINED) {
      node.combinedNodes.forEach((combinedNodeID) => this.translateLinks(combinedNodeID, movement));
    } else {
      this.translateLinks(nodeID, movement);
    }
  }

  translateLinks(nodeID, movement) {
    const node = this.engine.getNodeByID(nodeID);

    this.engine.getLinkIDsByNodeID(node.id).forEach((linkID) => {
      if (this.engine.links.has(linkID)) {
        const link = this.engine.getLinkByID(linkID);

        this.engine.link.translatePoint(linkID, movement, link.source.nodeID === nodeID);
      }
    });
  }

  drag(nodeID) {
    this.api(nodeID)?.drag?.();
  }

  drop(nodeID) {
    this.api(nodeID)?.drop?.();
  }

  setMergeStatus(nodeID, mergeStatus) {
    this.api(nodeID)?.setMergeStatus?.(mergeStatus);
  }

  getBlockRect(nodeID) {
    return this.api(nodeID).getBlockRect();
  }

  center(nodeID) {
    const [posX, posY] = this.api(nodeID).getPosition();

    const xOffset = window.innerWidth / 2;
    const yOffset = window.innerHeight / 3;

    const canvasAPI = this.engine.canvas;

    canvasAPI.applyTransition();
    canvasAPI.setZoom(80);
    canvasAPI.setPosition([(xOffset - posX) * 0.8, (yOffset - posY - 100) * 0.8]);
  }

  rename(nodeID) {
    return this.api(nodeID).rename?.();
  }

  redraw(nodeID) {
    this.engine.dispatcher.redrawNode(nodeID);
  }

  redrawLinks(nodeID) {
    const node = this.engine.getNodeByID(nodeID);

    if (!node) return;

    [...node.ports.in, ...node.ports.out].forEach((portID) => this.engine.port.redrawLinks(portID));

    if (node.combinedNodes.length) {
      this.redrawNestedLinks(nodeID);
    }
  }

  redrawNestedLinks(parentNodeID) {
    const node = this.engine.getNodeByID(parentNodeID);
    node?.combinedNodes.forEach((nodeID) => this.redrawLinks(nodeID));
  }

  updateBlockColor(nodeID, color) {
    this.api(nodeID).updateBlockColor?.(color);
  }
}

export default NodeManager;
