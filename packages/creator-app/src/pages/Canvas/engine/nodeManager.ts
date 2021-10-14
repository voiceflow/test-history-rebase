import { Node as BaseNode } from '@voiceflow/base-types';
import _partition from 'lodash/partition';
import { batch } from 'react-redux';

import { BlockType } from '@/constants';
import { BlockVariant } from '@/constants/canvas';
import * as Creator from '@/ducks/creator';
import * as Diagram from '@/ducks/diagram';
import * as Feature from '@/ducks/feature';
import * as Modal from '@/ducks/modal';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Realtime from '@/ducks/realtime';
import * as Version from '@/ducks/version';
import { EntityMap, Node, NodeData } from '@/models';
import { Pair, Point } from '@/types';
import { objectID } from '@/utils';
import { Coords } from '@/utils/geometry';
import { getNodesGroupCenter, isCommandNode } from '@/utils/node';
import { getPlatformDefaultVoice } from '@/utils/platform';
import reduxBatchUndo from '@/utils/reduxBatchUndo';
import { isMarkupBlockType, isMarkupOrCombinedBlockType } from '@/utils/typeGuards';

import { DUPLICATE_OFFSET, EngineConsumer, nodeFactory } from './utils';

class NodeManager extends EngineConsumer {
  log = this.engine.log.child('node');

  internal = {
    add: (node: Creator.NodeDescriptor, data: Creator.DataDescriptor, parentNode: Creator.ParentNodeDescriptor) => {
      if (node.type === BlockType.COMMENT) {
        this.dispatch(Creator.addNode(node, data));
      } else if (isMarkupBlockType(node.type)) {
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
      this.redrawNestedThreads(parentNodeID);
    },

    unmerge: (nodeID: string, position: Point, parentNode: Creator.ParentNodeDescriptor) => {
      const node = this.engine.getNodeByID(nodeID);

      this.saveLocation(node.parentNode!);

      this.dispatch(Creator.unmergeNode(nodeID, position, parentNode));

      this.redrawNestedLinks(node.parentNode!);
      this.redrawNestedThreads(node.parentNode!);
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
      this.api(nodeID)?.instance?.translate?.(movement);
      this.updateOrigin(nodeID, movement);
      this.translateAllLinks(nodeID, movement);
      this.translateAllThreads(nodeID, movement);
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

    getNodeFactoryOptions: () => {
      const platform = this.select(ProjectV2.active.platformSelector);
      const defaultVoice = this.select(Version.activeDefaultVoiceSelector);
      const allActiveFeatures = this.select(Feature.allActiveFeaturesSelector);
      const canvasNodeVisibility = this.select(Version.activeCanvasNodeVisibilitySelector);

      return {
        features: allActiveFeatures,
        platform,
        defaultVoice: defaultVoice || getPlatformDefaultVoice(platform),
        canvasNodeVisibility: canvasNodeVisibility || BaseNode.Utils.CanvasNodeVisibility.PREVIEW,
      };
    },

    saveLocation: (nodeID: string) => {
      if (!this.engine.nodes.has(nodeID)) return;

      const { x, y } = this.engine.nodes.get(nodeID)!;

      this.dispatch(Creator.updateNodeLocation(nodeID, [x, y]));
    },
  };

  api(nodeID: string) {
    return this.engine.nodes.get(nodeID)?.api;
  }

  isReady(nodeID: string) {
    return this.engine.nodes.get(nodeID)?.api?.isReady();
  }

  /**
   * check to see if a node is active
   */
  isActive(nodeID: string) {
    return this.engine.activation.hasTargets && this.engine.activation.isTarget(nodeID);
  }

  /**
   * check to see if a node or its parent parent is active
   */
  isBranchActive(nodeID: string) {
    const node = this.engine.getNodeByID(nodeID);

    return (node?.parentNode && this.isActive(node.parentNode)) || this.isActive(nodeID);
  }

  /**
   * check to see if a node or any of its descendents are active
   */
  isSubtreeActive(nodeID: string) {
    const node = this.engine.getNodeByID(nodeID);

    return this.isActive(nodeID) || node.combinedNodes.some((childNodeID) => this.isActive(childNodeID));
  }

  getRect(nodeID: string) {
    return this.api(nodeID)?.instance?.getRect();
  }

  // crud methods

  async removeIntentStepIDs(removedNodes: Node[]): Promise<void> {
    const removedIntentStepIDs = removedNodes.filter(({ type }) => type === BlockType.INTENT).map(({ id }) => id);

    if (removedIntentStepIDs.length) {
      await this.dispatch(Diagram.removeActiveDiagramIntentStepIDs(removedIntentStepIDs));
    }
  }

  async addIntentStepIDs<T extends { node: { id: string; type: BlockType } }>(addNodes: T[]): Promise<void> {
    const addedIntentStepIDs = addNodes.filter(({ node }) => node.type === BlockType.INTENT).map(({ node }) => node.id);

    if (addedIntentStepIDs.length) {
      await this.dispatch(Diagram.addActiveDiagramIntentStepIDs(addedIntentStepIDs));
    }
  }

  async add(
    type: BlockType,
    coords: Coords,
    factoryData?: Partial<NodeData<unknown>>,
    nodeID: string = objectID(),
    autoFocus = true
  ): Promise<string> {
    const [x, y] = this.engine.canvas!.fromCoords(coords);

    const { node, data } = nodeFactory(type, factoryData, this.internal.getNodeFactoryOptions());
    const augmentedNode = { ...node, x, y, id: nodeID };
    const parentNode = { id: objectID(), ports: { in: [{ id: objectID() }], out: [] } };

    this.log.debug(this.log.pending('adding node'), this.log.slug(nodeID));

    await this.engine.realtime.sendUpdate(Realtime.addNode(augmentedNode, data, parentNode));
    this.internal.add(augmentedNode, data, parentNode);

    this.engine.saveHistory();

    await this.addIntentStepIDs([{ node: augmentedNode, data }]);

    if (autoFocus) {
      this.engine.setActive(nodeID);
    }

    this.log.info(this.log.success('added node'), this.log.slug(nodeID));

    return nodeID;
  }

  async addMany(entities: EntityMap, coords: Coords): Promise<void> {
    this.log.debug(this.log.pending('adding many nodes'), entities);

    const point = this.engine.canvas!.fromCoords(coords);

    await this.engine.realtime.sendUpdate(Realtime.addManyNodes(entities, point));

    this.internal.addMany(entities, point);
    this.engine.saveHistory();

    await this.addIntentStepIDs(entities.nodesWithData);

    this.log.info(this.log.success('added many nodes'), this.log.value(entities.nodesWithData.length));
  }

  async duplicate(nodeID: string): Promise<void> {
    this.log.debug(this.log.pending('duplicating node'), this.log.slug(nodeID));

    const duplicateNodeWithData = await this.engine.diagram.duplicateNode(nodeID);

    if (duplicateNodeWithData?.node?.id) {
      this.engine.saveHistory();
      this.engine.setActive(duplicateNodeWithData.node.id);

      await this.addIntentStepIDs([duplicateNodeWithData]);

      this.log.info(this.log.success('duplicated node'), this.log.slug(nodeID));
    }
  }

  // We use the copy and paste logic to preserve the link connections, rather than reuse the single duplicate method above
  async duplicateMany(nodeIDs: string[]): Promise<void> {
    const clipboardData = this.engine.clipboard.getClipboardContext(nodeIDs);

    const combinedAndMarkupNodes = clipboardData.nodes
      .filter(({ type }) => isMarkupOrCombinedBlockType(type))
      .map((node) => ({ data: clipboardData.data[node.id], node }));

    const { center: centerCoords } = getNodesGroupCenter(combinedAndMarkupNodes, clipboardData.links);
    const coords = this.engine.canvas!.toCoords(centerCoords).add(DUPLICATE_OFFSET);

    const { nodesWithData } = await this.engine.clipboard.cloneClipboardContext(clipboardData, coords);

    const parentNodes: string[] = [];

    nodesWithData.forEach(({ node }) => {
      if (isMarkupOrCombinedBlockType(node.type)) {
        parentNodes.push(node.id);
      }
    });

    this.engine.selection.replace(parentNodes);

    await this.engine.saveHistory();

    await this.addIntentStepIDs(nodesWithData);
  }

  async updateData<T extends unknown = unknown>(nodeID: string, data: Partial<NodeData<T>>, save = true): Promise<void> {
    this.log.debug(this.log.pending('updating node data'), this.log.slug(nodeID), data);

    await this.engine.realtime.sendUpdate(Realtime.updateNodeData(nodeID, data));
    this.internal.updateData(nodeID, data);
    this.redraw(nodeID);

    if (save) {
      this.engine.saveHistory();
    }

    this.log.info(this.log.success('updated node data'), this.log.slug(nodeID));
  }

  isRemovingLocked(nodeIDs: string[], remove: (nodeIDs: string[]) => Promise<void>): boolean {
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
        Modal.setConfirm({
          warning: false,
          text: `${text} being actively working on and cannot be deleted`,
          confirm: () => (unlockedNodesIDs.length ? remove(unlockedNodesIDs) : this.dispatch(Modal.clearModal())),
        })
      );

      return true;
    }
    return false;
  }

  isRemovingDefaultCommand(nodes: Node[]): boolean {
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
          Modal.setConfirm({
            warning: false,
            text: `${requiredCommand} is required by default`,
            confirm: () => this.dispatch(Modal.clearModal()),
          })
        );

        return true;
      }
    }

    return false;
  }

  async validateRemove(
    nodeIDs: string[],
    remove: (nodeIDs: string[]) => Promise<void>,
    { disableConfirmPrompt }: { disableConfirmPrompt?: boolean } = {}
  ): Promise<void> {
    const removableNodes = nodeIDs.map(this.engine.getNodeByID).filter((node) => node.type !== BlockType.START);
    const removableNodeIDs = removableNodes.map(({ id }) => id);

    if (this.isRemovingDefaultCommand(removableNodes) || this.isRemovingLocked(removableNodeIDs, remove)) return;

    const isSingleCombinedWithSingleStep =
      removableNodes.length === 1 && removableNodes[0].type === BlockType.COMBINED && removableNodes[0].combinedNodes.length === 1;

    if (
      !disableConfirmPrompt &&
      !isSingleCombinedWithSingleStep &&
      removableNodes.some((node) => [BlockType.COMBINED, BlockType.COMMAND].includes(node.type))
    ) {
      this.dispatch(
        Modal.setConfirm({
          warning: true,
          text: `Are you sure you want to delete ${removableNodeIDs.length > 1 ? 'these blocks?' : 'this block?'}`,
          confirm: () => remove(removableNodeIDs),
        })
      );
      return;
    }

    await remove(removableNodeIDs);
  }

  remove(nodeID: string): Promise<void> {
    this.log.debug(this.log.pending('removing node'), this.log.slug(nodeID));

    return this.validateRemove([nodeID], async ([removeNodeID]) => {
      const allNodeIDs = [removeNodeID, ...this.select(Creator.combinedNodeIDsSelector)(removeNodeID)];
      const nodesToRemove = this.select(Creator.allNodesByIDsSelector)(allNodeIDs);

      await this.engine.comment.handleNodesDelete(allNodeIDs);

      await this.engine.realtime.sendUpdate(Realtime.removeNode(removeNodeID));
      this.internal.remove(removeNodeID);

      this.engine.saveHistory();

      await this.removeIntentStepIDs(nodesToRemove);

      this.dispatch(Creator.validateTopicAvailability());

      this.log.info(this.log.success('remove node'), this.log.slug(removeNodeID));
    });
  }

  removeMany(nodeIDs: string[], { disableConfirmPrompt }: { disableConfirmPrompt?: boolean } = {}): Promise<void> {
    this.log.debug(this.log.pending('removed multiple nodes'), nodeIDs);

    return this.validateRemove(
      nodeIDs,
      async (removableNodeIDs) => {
        const allNodeIDs = [...removableNodeIDs, ...removableNodeIDs.flatMap(this.select(Creator.combinedNodeIDsSelector))];
        const nodesToRemove = this.select(Creator.allNodesByIDsSelector)(allNodeIDs);

        await this.engine.comment.handleNodesDelete(allNodeIDs);

        await this.engine.realtime.sendUpdate(Realtime.removeManyNodes(removableNodeIDs));
        this.internal.removeMany(removableNodeIDs);

        this.engine.saveHistory();

        await this.removeIntentStepIDs(nodesToRemove);

        this.dispatch(Creator.validateTopicAvailability());

        this.log.info(this.log.success('removed multiple nodes'), this.log.value(removableNodeIDs.length));
      },
      { disableConfirmPrompt }
    );
  }

  // nested node management methods

  async addNested(parentNodeID: string, type: BlockType): Promise<string> {
    const nodeID = objectID();
    const mergedNodeID = objectID();
    const { node, data } = nodeFactory(type, undefined, this.internal.getNodeFactoryOptions());
    const augmentedNode = { ...node, id: nodeID };

    this.log.debug(this.log.pending('adding nested node'), this.log.slug(nodeID));

    await this.engine.realtime.sendUpdate(Realtime.addNestedNode(parentNodeID, augmentedNode, data, mergedNodeID));

    this.internal.addNested(parentNodeID, augmentedNode, data, mergedNodeID);
    this.engine.saveHistory();
    this.engine.setActive(nodeID);

    await this.addIntentStepIDs([{ node: augmentedNode, data }]);

    this.log.info(this.log.success('added nested node'), this.log.slug(nodeID));

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
  }): Promise<void> {
    const childID = objectID();
    const combinedPortID = objectID();
    const { node, data } = nodeFactory(type, factoryData, this.internal.getNodeFactoryOptions());
    const [x, y] = position;
    const augmentedNode = { ...node, x, y, id: childID };
    const parentNode = {
      id: nodeID,
      ports: { in: [{ id: combinedPortID }], out: [] },
    };

    this.log.debug(this.log.pending('adding nested node'), this.log.slug(childID));

    batch(() => {
      this.internal.add(augmentedNode, data, parentNode);
      this.internal.insertNested(parentNodeID, index, nodeID);
    });

    await this.engine.realtime.sendUpdate(Realtime.addNode(augmentedNode, data, parentNode));
    await this.engine.realtime.sendUpdate(Realtime.insertNestedNode(parentNodeID, index, nodeID));

    this.engine.saveHistory();

    this.engine.setActive(childID);

    await this.addIntentStepIDs([{ node: augmentedNode, data }]);

    this.log.info(this.log.success('added nested node'), this.log.slug(childID));
  }

  async insertNested(parentNodeID: string, index: number, nodeID: string): Promise<void> {
    this.log.debug(this.log.pending('inserting nested node'), this.log.slug(nodeID));

    this.internal.insertNested(parentNodeID, index, nodeID);
    await this.engine.realtime.sendUpdate(Realtime.insertNestedNode(parentNodeID, index, nodeID));

    this.engine.saveHistory();

    this.log.info(this.log.success('inserted nested node'), this.log.slug(nodeID));
  }

  async unmerge(nodeID: string, position: Point): Promise<void> {
    const parentNodeID = objectID();
    const parentPortID = objectID();
    const parentNode = {
      id: parentNodeID,
      ports: { in: [{ id: parentPortID }], out: [] },
    };

    this.log.debug(this.log.pending('unmerging node'), this.log.slug(nodeID));

    await this.engine.realtime.sendUpdate(Realtime.unmergeNode(nodeID, position, parentNode));
    this.internal.unmerge(nodeID, position, parentNode);
    this.engine.saveHistory();

    this.log.info(this.log.success('unmerged node'), this.log.slug(nodeID));
  }

  // location / rendering methods

  async translate(nodeID: string, movement: Pair<number>, volatile = true): Promise<void> {
    if (!this.engine.nodes.has(nodeID)) return;

    const node = this.engine.nodes.get(nodeID)!;
    const origin: Point = [node.x, node.y];

    this.internal.translate(nodeID, movement);

    const action = Realtime.moveNode(nodeID, movement, origin);
    await this.engine.realtime[volatile ? 'sendVolatileUpdate' : 'sendUpdate'](action);
  }

  async translateMany(nodeIDs: string[], movement: Pair<number>, volatile = true): Promise<void> {
    const activeNodeIDs = nodeIDs.filter((nodeID) => this.engine.nodes.has(nodeID));
    const origins = activeNodeIDs.map<Point>((nodeID) => {
      const node = this.engine.nodes.get(nodeID)!;

      return [node.x, node.y];
    });

    this.internal.translateMany(activeNodeIDs, movement);

    const action = Realtime.moveManyNodes(activeNodeIDs, movement, origins);
    await this.engine.realtime[volatile ? 'sendVolatileUpdate' : 'sendUpdate'](action);
  }

  saveLocation(nodeID: string): void {
    if (!this.engine.nodes.has(nodeID)) return;

    reduxBatchUndo.start();

    this.saveLinks(nodeID);
    this.internal.saveLocation(nodeID);

    reduxBatchUndo.end();

    this.log.debug('location saved', this.log.slug(nodeID));
  }

  updateOrigin(nodeID: string, [moveX, moveY]: Pair<number>): void {
    const node = this.engine.nodes.get(nodeID);

    if (node) {
      this.engine.nodes.set(nodeID, { ...node, x: node.x + moveX, y: node.y + moveY });
    }
  }

  setOrigin(nodeID: string, [x, y]: Point): void {
    const node = this.engine.nodes.get(nodeID);

    if (node) {
      this.engine.nodes.set(nodeID, { ...node, x, y });

      this.log.debug('set origin', this.log.slug(nodeID));
    }
  }

  translateAllLinks(nodeID: string, movement: Pair<number>, { reposition = false }: { reposition?: boolean } = {}): void {
    const node = this.engine.getNodeByID(nodeID);

    if (!node) return;

    if (node.type === BlockType.COMBINED) {
      [nodeID, ...node.combinedNodes].forEach((combinedNodeID) => this.translateLinks(combinedNodeID, movement, { reposition }));
    } else {
      this.translateLinks(nodeID, movement, { reposition });
    }
  }

  translateLinks(nodeID: string, movement: Pair<number>, { reposition }: { reposition: boolean }): void {
    const node = this.engine.getNodeByID(nodeID);

    this.engine.getLinkIDsByNodeID(node.id).forEach((linkID) => {
      if (this.engine.links.has(linkID)) {
        const link = this.engine.getLinkByID(linkID);
        const isSource = link.source.nodeID === nodeID;
        const linkedNode = this.engine.getNodeByID(isSource ? link.target.nodeID : link.source.nodeID);

        this.engine.link.translatePoint(linkID, movement, {
          isSource,
          reposition,
          sourceAndTargetSelected: !!linkedNode && this.engine.drag.isInGroup(linkedNode.parentNode || linkedNode.id),
        });
      }
    });
  }

  saveLinks(nodeID: string): void {
    const node = this.engine.getNodeByID(nodeID);
    const nodeLinkIDs = this.engine.getLinkIDsByNodeID(nodeID);
    const combinedNodes = node.combinedNodes.flatMap((childNodeID) => this.engine.getLinkIDsByNodeID(childNodeID));
    const linkIDs = [...nodeLinkIDs, ...combinedNodes].filter((linkID) => this.engine.links.has(linkID));

    this.engine.link.savePointsMany(linkIDs);
  }

  translateAllThreads(nodeID: string, movement: Pair<number>): void {
    const node = this.engine.getNodeByID(nodeID);

    if (!node) return;

    [nodeID, ...node.combinedNodes].forEach((combinedNodeID) => this.translateThreads(combinedNodeID, movement));
  }

  translateThreads(nodeID: string, movement: Pair<number>): void {
    if (this.engine.comment.isActive) {
      const movementVector = this.engine.canvas!.toVector(movement);
      this.engine.getThreadIDsByNodeID(nodeID).forEach((threadID) => this.engine.comment.translateThread(threadID, movementVector));
    }
  }

  async drag(nodeID: string, movement: Pair<number>): Promise<void> {
    if (this.engine.selection.isOneOfManyTargets(nodeID)) {
      const targets = this.engine.selection.getTargets();

      await this.engine.drag.setGroup(targets);
      await this.translateMany(targets, movement);
    } else if (this.engine.transformation.isActive && !this.engine.focus.isTarget(nodeID)) {
      this.engine.focus.reset();
    } else {
      if (!this.engine.selection.isTarget(nodeID)) {
        this.engine.selection.reset();
      }

      await this.engine.drag.setTarget(nodeID);
      await this.translate(nodeID, movement);
      this.engine.transformation.components.transformOverlay?.translate(movement);

      this.engine.merge.updateCandidates();
    }
  }

  async drop(): Promise<void> {
    this.engine.saveActiveLocations();
    this.engine.saveHistory();

    await this.engine.drag.reset();
    this.engine.transformation.reinitialize();
  }

  center(nodeID: string, animate = true): void {
    const node = this.engine.getNodeByID(nodeID);
    const center = this.api(nodeID)?.instance?.getCenterPoint();

    if (!center || isMarkupBlockType(node.type)) return;

    this.engine.center(center, animate);

    this.log.info('centered canvas on node', this.log.slug(nodeID));
  }

  rename(nodeID: string): void {
    return this.api(nodeID)?.instance?.rename();
  }

  redraw(nodeID: string): void {
    this.engine.dispatcher.redrawNode(nodeID);
  }

  redrawLinks(nodeID: string): void {
    const node = this.engine.getNodeByID(nodeID);

    if (!node) return;

    node.ports.in.forEach((portID) => this.engine.port.redrawLinks(portID));
    node.ports.out.forEach((portID) => this.engine.port.redrawLinks(portID));

    if (node.combinedNodes.length) {
      this.redrawNestedLinks(nodeID);
    }
  }

  redrawNestedLinks(parentNodeID: string): void {
    const node = this.engine.getNodeByID(parentNodeID);

    node?.combinedNodes.forEach((nodeID) => this.redrawLinks(nodeID));
  }

  redrawThreads(nodeID: string): void {
    this.engine.getThreadIDsByNodeID(nodeID).forEach((threadID) => this.engine.comment.redrawThread(threadID));
  }

  redrawNestedThreads(nodeID: string): void {
    const node = this.engine.getNodeByID(nodeID);

    if (!node) return;

    [nodeID, ...node.combinedNodes].forEach((childNodeID) => this.redrawThreads(childNodeID));
  }

  updateBlockColor(nodeID: string, color: BlockVariant): Promise<void> {
    return this.updateData(nodeID, { blockColor: color });
  }
}

export default NodeManager;
