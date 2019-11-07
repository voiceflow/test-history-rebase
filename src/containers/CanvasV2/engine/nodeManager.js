import { BlockType } from '@/constants';
import * as Creator from '@/ducks/creator';
import { clearModal, setConfirm } from '@/ducks/modal';
import * as Realtime from '@/ducks/realtime';

import { EngineConsumer, cloneNodeGroup, nodeFactory } from './utils';

const DUPLICATE_OFFSET = 40;

class NodeManager extends EngineConsumer {
  internal = {
    add: (node, data, nodeID) => this.dispatch(Creator.addNode(node, data, nodeID)),

    addMany: (nodeGroup, position) => this.dispatch(Creator.addManyNodes(nodeGroup, position)),

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
      this.api(nodeID)?.translate(movement);
      this.updateOrigin(nodeID, movement);
      this.translateAllLinks(nodeID, movement);
    },

    translateMany: (nodeIDs, movement) => nodeIDs.forEach((nodeID) => this.internal.translate(nodeID, movement)),
  };

  api(nodeID) {
    return this.engine.nodes.get(nodeID)?.api;
  }

  // crud methods

  add(nodeID, type, [x, y]) {
    const { node, data } = nodeFactory(type);
    const augmentedNode = { ...node, x, y };

    this.internal.add(augmentedNode, data, nodeID);
    this.dispatch(Realtime.addNode(augmentedNode, data, nodeID));
    this.engine.saveHistory();
    this.engine.focus.set(nodeID);
  }

  addMany(nodeGroup, position) {
    this.internal.addMany(nodeGroup, position);
    this.dispatch(Realtime.addManyNodes(nodeGroup, position));
    this.engine.saveHistory();
  }

  clone(nodeGroup, position) {
    const clonedNodeGroup = cloneNodeGroup(nodeGroup);
    this.addMany(clonedNodeGroup, position);

    return clonedNodeGroup;
  }

  duplicate(nodeID) {
    const node = this.engine.getNodeByID(nodeID);
    const data = this.engine.getDataByNodeID(nodeID);

    const clonedNodeGroup = this.clone(
      {
        nodesWithData: [{ node, data: { ...data, name: `${data.name} copy` } }],
        ports: [...node.ports.in, ...node.ports.out].map(this.engine.getPortByID),
        links: [],
      },
      [node.x + DUPLICATE_OFFSET, node.y + DUPLICATE_OFFSET]
    );

    this.engine.saveHistory();
    this.engine.focus.set(clonedNodeGroup.nodesWithData[0]?.node.id);
  }

  updateData(nodeID, data, save = true) {
    this.internal.updateData(nodeID, data);
    this.dispatch(Realtime.updateNodeData(nodeID, data));

    if (save) {
      this.engine.saveHistory();
    }
  }

  // TODO: move this validator out into a seperate handler
  validateRemove(nodeIDs, remove) {
    const removableNodes = nodeIDs.map(this.engine.getNodeByID).filter((node) => node.type !== BlockType.START);
    const removableNodeIDs = removableNodes.map(({ id }) => id);
    const commandNodes = removableNodes.filter((node) => node.type === BlockType.COMMAND);
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
            confirm: () => {
              this.dispatch(clearModal());
            },
          })
        );
        return;
      }
    }

    if (removableNodes.some((node) => [BlockType.COMBINED, BlockType.COMMAND].includes(node.type))) {
      this.dispatch(
        setConfirm({
          warning: true,
          text: `Are you sure you want to delete ${removableNodes.length > 1 ? 'these blocks?' : 'this block?'}`,
          confirm: () => remove(removableNodeIDs),
        })
      );
      return;
    }

    remove(removableNodeIDs);
  }

  remove(nodeID) {
    this.validateRemove([nodeID], ([removeNodeID]) => {
      this.internal.remove(removeNodeID);
      this.dispatch(Realtime.removeNode(removeNodeID));
      this.engine.saveHistory();
    });
  }

  removeMany(nodeIDs) {
    this.validateRemove(nodeIDs, (removableNodeIDs) => {
      this.internal.removeMany(removableNodeIDs);
      this.dispatch(Realtime.removeManyNodes(removableNodeIDs));
      this.engine.saveHistory();
    });
  }

  // nested node management methods

  addNested(parentNodeID, nodeID, type) {
    const { node, data } = nodeFactory(type);
    this.dispatch(Creator.addNestedNode(parentNodeID, { ...node, type }, data, nodeID));
    this.engine.saveHistory();
    this.engine.focus.set(nodeID);
    this.redrawNestedLinks(parentNodeID);
  }

  insertNested(parentNodeID, index, nodeID) {
    this.dispatch(Creator.insertNestedNode(parentNodeID, index, nodeID));
    this.engine.saveHistory();
    this.redrawNestedLinks(parentNodeID);
  }

  reorderNested(parentNodeID, sourceIndex, targetIndex) {
    this.dispatch(Creator.reorderNestedNodes(parentNodeID, sourceIndex, targetIndex));
    this.engine.saveHistory();
    this.redrawNestedLinks(parentNodeID);
  }

  unmerge(nodeID, position) {
    const { parentNode } = this.engine.getNodeByID(nodeID);
    this.saveLocation(parentNode);
    this.dispatch(Creator.unmergeNode(nodeID, position));
    this.redrawNestedLinks(parentNode);
  }

  async merge(sourceNodeID, targetNodeID, invert) {
    // QUESTION: why does this only work when async?
    await this.dispatch(Creator.mergeNodes(sourceNodeID, targetNodeID, invert));

    this.engine.saveHistory();
    this.redrawLinks(sourceNodeID);
    this.redrawLinks(targetNodeID);
  }

  // location / rendering methods

  translate(nodeID, movement) {
    if (this.engine.nodes.has(nodeID)) {
      this.internal.translate(nodeID, movement);
      this.dispatch(Realtime.moveNode(nodeID, movement));
    }
  }

  translateMany(nodeIDs, movement) {
    const activeNodeIDs = nodeIDs.filter((nodeID) => this.engine.nodes.has(nodeID));

    this.internal.translateMany(activeNodeIDs, movement);
    this.dispatch(Realtime.moveManyNodes(activeNodeIDs, movement));
  }

  saveLocation(nodeID) {
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
    if (node.type === BlockType.COMBINED) {
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

    [...node.ports.in, ...node.ports.out].forEach((portID) => this.engine.port.redrawLinks(portID));

    if (node.combinedNodes.length) {
      this.redrawNestedLinks(nodeID);
    }
  }

  redrawNestedLinks(parentNodeID) {
    const node = this.engine.getNodeByID(parentNodeID);
    node?.combinedNodes.forEach((nodeID) => this.redrawLinks(nodeID));
  }
}

export default NodeManager;
