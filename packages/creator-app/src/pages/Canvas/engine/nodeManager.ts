import { AlexaConstants } from '@voiceflow/alexa-types';
import { BaseNode } from '@voiceflow/base-types';
import { Nullish, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import _partition from 'lodash/partition';
import { batch } from 'react-redux';
import { createSelector } from 'reselect';

import { FeatureFlag } from '@/config/features';
import { BlockType } from '@/constants';
import * as Creator from '@/ducks/creator';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as Feature from '@/ducks/feature';
import * as History from '@/ducks/history';
import * as Modal from '@/ducks/modal';
import * as ProjectV2 from '@/ducks/projectV2';
import * as RealtimeDuck from '@/ducks/realtime';
import * as Tracking from '@/ducks/tracking';
import * as VersionV2 from '@/ducks/versionV2';
import { Pair, Point } from '@/types';
import { Coords } from '@/utils/geometry';
import { centerNodeGroup, getNodesGroupCenter, isCommandNode } from '@/utils/node';
import { getPlatformDefaultVoice } from '@/utils/platform';
import reduxBatchUndo from '@/utils/reduxBatchUndo';
import { isMarkupBlockType, isMarkupOrCombinedBlockType } from '@/utils/typeGuards';
import * as Sentry from '@/vendors/sentry';

import NodeEntity from './entities/nodeEntity';
import { createPortRemap, DUPLICATE_OFFSET, EngineConsumer, nodeDescriptorFactory } from './utils';

const nodeFactoryOptionsSelector = createSelector(
  [
    ProjectV2.active.platformSelector,
    ProjectV2.active.projectTypeSelector,
    VersionV2.active.defaultVoiceSelector,
    Feature.allActiveFeaturesSelector,
    VersionV2.active.canvasNodeVisibilitySelector,
  ],
  (platform, projectType, defaultVoice, allActiveFeatures, canvasNodeVisibility) => ({
    features: allActiveFeatures,
    platform,
    projectType,
    defaultVoice: defaultVoice || getPlatformDefaultVoice(platform),
    canvasNodeVisibility: canvasNodeVisibility || BaseNode.Utils.CanvasNodeVisibility.PREVIEW,
  })
);

class NodeManager extends EngineConsumer {
  log = this.engine.log.child('node');

  internal = {
    /**
     * @deprecated remove after update atomic actions phase 2 is complete
     */
    addManyStartingBlocks: async (nodesWithData: Realtime.NodeWithData[]): Promise<void> => {
      const startingBlocks = nodesWithData.map(({ node, data }) => ({ blockID: node.id, name: data.name }));
      await this.dispatch.sync(Realtime.diagram.addNewStartingBlocks({ ...this.engine.context, startingBlocks }));
    },

    /**
     * @deprecated remove after update atomic actions phase 2 is complete
     */
    addNewStartingBlock: async (newBlock: { id: string; name: string }): Promise<void> => {
      const startingBlocks = [{ blockID: newBlock.id, name: newBlock.name }];
      await this.dispatch.sync(Realtime.diagram.addNewStartingBlocks({ ...this.engine.context, startingBlocks }));
    },

    /**
     * @deprecated remove after update atomic actions phase 2 is complete
     */
    removeStartingBlocks: async (blockIDs: string[]): Promise<void> => {
      const blockIDsToRemove = [...new Set(blockIDs)];
      await this.dispatch.sync(Realtime.diagram.removeStartingBlocks({ ...this.engine.context, startingBlockIds: blockIDsToRemove }));
    },

    /**
     * @deprecated remove after update atomic actions phase 2 is complete
     */
    updateStartingBlock: async (startingBlock: Realtime.diagram.DiagramStartingBlock): Promise<void> => {
      await this.dispatch.sync(Realtime.diagram.updateStartingBlock({ ...this.engine.context, startingBlock }));
    },

    addBlock: async (node: Creator.NodeDescriptor, data: Creator.DataDescriptor, parentNode: Creator.ParentNodeDescriptor): Promise<void> => {
      const blockName = this.getNewBlockName();
      const blockID = parentNode.id;

      if (this.isAtomicActionsPhase2) {
        await this.dispatch.sync(
          Realtime.node.addBlock({
            ...this.engine.context,
            blockID,
            blockPorts: parentNode.ports,
            blockCoords: [node.x, node.y],
            blockName,
            stepID: node.id,
            stepData: {
              ...data,
              type: node.type,
            },
            stepPorts: node.ports,
            projectMeta: this.engine.getActiveProjectMeta(),
            schemaVersion: this.engine.getActiveSchemaVersion(),
          })
        );
      } else {
        this.dispatch(Creator.addWrappedNode(node, data, parentNode));
        this.internal.addNewStartingBlock({ id: blockID, name: blockName });
      }
    },

    addMarkup: async (node: Creator.NodeDescriptor, data: Creator.DataDescriptor): Promise<void> => {
      if (this.isAtomicActionsPhase2) {
        const markupData = data as Creator.DataDescriptor<Realtime.Markup.AnyNodeData>;

        await this.dispatch.sync(
          Realtime.node.addMarkup({
            ...this.engine.context,
            nodeID: node.id,
            data: {
              ...markupData,
              type: node.type,
            },
            coords: [node.x, node.y],
            projectMeta: this.engine.getActiveProjectMeta(),
            schemaVersion: this.engine.getActiveSchemaVersion(),
          })
        );
      } else {
        this.dispatch(Creator.addNode(node, data));
      }
    },

    /**
     * @deprecated
     */
    addV1: async (node: Creator.NodeDescriptor, data: Creator.DataDescriptor, parentNode: Creator.ParentNodeDescriptor): Promise<void> => {
      if (isMarkupBlockType(node.type)) {
        return this.internal.addMarkup(node, data);
      }

      return this.internal.addBlock(node, data, parentNode);
    },

    importSnapshot: async (entities: Realtime.EntityMap): Promise<void> => {
      if (this.isAtomicActionsPhase2) {
        await this.dispatch.sync(
          Realtime.creator.importSnapshot({
            ...this.engine.context,
            ...entities,
            projectMeta: this.engine.getActiveProjectMeta(),
            schemaVersion: this.engine.getActiveSchemaVersion(),
          })
        );
      } else {
        this.dispatch(Creator.addManyNodes(entities));
        this.internal.addManyStartingBlocks(entities.nodesWithData);
      }
    },

    appendStep: async (blockID: string, node: Creator.NodeDescriptor, data: Creator.DataDescriptor): Promise<void> => {
      if (this.isAtomicActionsPhase2) {
        const stepIDs = this.select(CreatorV2.stepIDsByBlockIDSelector, { id: blockID });
        await this.dispatch.sync(
          Realtime.node.insertStep({
            ...this.engine.context,
            blockID,
            stepID: node.id,
            data: {
              ...data,
              type: node.type,
            },
            ports: node.ports,
            projectMeta: this.engine.getActiveProjectMeta(),
            schemaVersion: this.engine.getActiveSchemaVersion(),
            index: stepIDs.length,
            nodePortRemaps: [],
          })
        );
      } else {
        this.dispatch(Creator.addNestedNode(blockID, node, data));
      }

      this.redrawNestedLinks(blockID);
    },

    /**
     * @deprecated
     */
    insertNestedNode: (parentNodeID: string, index: number, nodeID: string): void => {
      this.dispatch(Creator.insertNestedNode(parentNodeID, index, nodeID));

      this.redrawNestedLinks(parentNodeID);
      this.redrawNestedThreads(parentNodeID);
    },

    insertStepV2: async (blockID: string, node: Creator.NodeDescriptor, data: Creator.DataDescriptor, index: number): Promise<void> => {
      const stepIDs = this.select(CreatorV2.stepIDsByBlockIDSelector, { id: blockID });
      const nodePortRemaps = index === stepIDs.length ? createPortRemap(this.engine.getNodeByID(stepIDs[stepIDs.length - 1])) : undefined;

      await this.dispatch.sync(
        Realtime.node.insertStep({
          ...this.engine.context,
          blockID,
          stepID: node.id,
          data: {
            ...data,
            type: node.type,
          },
          ports: node.ports,
          index,
          projectMeta: this.engine.getActiveProjectMeta(),
          schemaVersion: this.engine.getActiveSchemaVersion(),
          nodePortRemaps,
        })
      );

      this.redrawNestedLinks(blockID);
      this.redrawNestedThreads(blockID);
    },

    transplantSteps: async (targetBlockID: string, sourceBlockID: string, stepIDs: string[], index: number, removeSource = false): Promise<void> => {
      if (!stepIDs.length) return;

      const sourceStepIDs = this.select(CreatorV2.stepIDsByBlockIDSelector, { id: sourceBlockID });
      const targetStepIDs = this.select(CreatorV2.stepIDsByBlockIDSelector, { id: targetBlockID });

      const sourceBlockLastStepID = sourceStepIDs[sourceStepIDs.length - 1];
      const isMovingSourceLastStep = stepIDs.includes(sourceBlockLastStepID) && index !== targetStepIDs.length;

      const targetBlockLastStepID = targetStepIDs[targetStepIDs.length - 1];
      const isMovingTargetLastStep = index === targetStepIDs.length;

      const nodePortRemaps = [
        ...((isMovingSourceLastStep && createPortRemap(this.engine.getNodeByID(sourceBlockLastStepID))) || []),
        ...((isMovingTargetLastStep && createPortRemap(this.engine.getNodeByID(targetBlockLastStepID))) || []),
      ];

      await this.dispatch.sync(
        Realtime.node.transplantSteps({ ...this.engine.context, sourceBlockID, targetBlockID, stepIDs, index, removeSource, nodePortRemaps })
      );

      this.redrawNestedLinks(targetBlockID);
      this.redrawNestedThreads(targetBlockID);
    },

    reorderSteps: async (blockID: string, stepID: string, index: number): Promise<void> => {
      const stepIDs = this.select(CreatorV2.stepIDsByBlockIDSelector, { id: blockID });
      const currentIndex = stepIDs.indexOf(stepID);
      if (currentIndex === -1) return;

      const lastStepID = stepIDs[stepIDs.length - 1];
      const isLastStepMoved = index === stepIDs.length || stepID === lastStepID;
      const nodePortRemaps = isLastStepMoved ? createPortRemap(this.engine.getNodeByID(lastStepID)) : undefined;

      const finalIndex = currentIndex < index ? index - 1 : index;
      await this.dispatch.sync(Realtime.node.reorderSteps({ ...this.engine.context, blockID, stepID, index: finalIndex, nodePortRemaps }));

      this.redrawNestedLinks(blockID);
      this.redrawNestedThreads(blockID);
    },

    isolateStep: async (nodeID: string, coords: Point, parentNode: Creator.ParentNodeDescriptor): Promise<void> => {
      const node = this.engine.getNodeByID(nodeID);
      if (!node) return;

      const blockName = this.getNewBlockName();

      if (this.isAtomicActionsPhase2) {
        const projectMeta = this.engine.getActiveProjectMeta();
        const parentBlockStepIDs = this.select(CreatorV2.stepIDsByBlockIDSelector, { id: node.parentNode! });
        const stepIDs = [nodeID];

        // if we are isolating every step in a block, we are simply just moving the block
        const movingEntireBlock = parentBlockStepIDs.length === stepIDs.length;
        if (movingEntireBlock) {
          this.setOrigin(node.parentNode!, coords);
          await this.saveLocations([node.parentNode!]);
        } else {
          await this.dispatch.sync(
            Realtime.node.isolateSteps({
              ...this.engine.context,
              sourceBlockID: node.parentNode!,
              blockID: parentNode.id,
              blockPorts: parentNode.ports,
              blockCoords: coords,
              stepIDs,
              blockName,
              projectMeta,
              schemaVersion: this.engine.getActiveSchemaVersion(),
            })
          );
        }
      } else {
        this.saveLocations([node.parentNode!]);
        this.dispatch(Creator.unmergeNode(nodeID, coords, parentNode));
        this.internal.addNewStartingBlock({ id: node.id, name: blockName });
      }

      this.redrawNestedLinks(node.parentNode!);
      this.redrawNestedThreads(node.parentNode!);
    },

    updateManyData: async (updates: { nodeID: string; patch: Partial<Realtime.NodeData<unknown>> }[]): Promise<void> => {
      if (!updates.length) return;

      if (this.isAtomicActionsPhase2) {
        const projectMeta = this.engine.getActiveProjectMeta();
        const nodes = updates.reduce<Realtime.NodeData<unknown>[]>((acc, { nodeID, patch }) => {
          const data = this.engine.getDataByNodeID(nodeID);
          if (data) {
            acc.push({ ...data, ...patch });
          }
          return acc;
        }, []);

        await this.dispatch.sync(Realtime.node.updateDataMany({ ...this.engine.context, nodes, projectMeta }));
      } else {
        updates.forEach(({ nodeID, patch }) => {
          this.dispatch(Creator.updateNodeData(nodeID, patch));
        });
      }
    },

    removeMany: async (nodeIDs: string[]): Promise<void> => {
      const nodes = this.select(CreatorV2.nodesByIDsSelector, { ids: nodeIDs });
      const removedIDs = new Set<string>();
      const parentIDs = new Set<string>();

      nodes.forEach((node) => {
        this.engine.activation.deactivate(node.id);
        if (node.parentNode) {
          parentIDs.add(node.parentNode);
        }
        [...node.combinedNodes, node.id].forEach((childNodeID) => removedIDs.add(childNodeID));
      });

      const nodesToRemove = Array.from(removedIDs).map((nodeID) => {
        const blockID = this.select(CreatorV2.blockIDByStepIDSelector, { id: nodeID });

        return blockID ? { blockID, stepID: nodeID } : { blockID: nodeID };
      });

      // save last location of parent nodes in case unmerging
      const notRemovedParentIDs = Array.from(parentIDs).filter((parentID) => !removedIDs.has(parentID));
      this.saveLocations(notRemovedParentIDs);

      await this.dispatch.sync(Realtime.node.removeMany({ ...this.engine.context, nodes: nodesToRemove }));
    },

    translate: (nodeID: string, movement: Pair<number>): void => {
      this.api(nodeID)?.instance?.translate?.(movement);
      this.updateOrigin(nodeID, movement);

      if (!this.engine.isFeatureEnabled(FeatureFlag.EXPERIMENTAL_SYNC_LINKS)) {
        this.translateAllLinks(nodeID, movement);
      }

      this.translateAllThreads(nodeID, movement);
    },

    translateBaseOnOrigin: (nodeID: string, movement: Pair<number>, origin: Point): void => {
      const node = this.engine.nodes.get(nodeID);

      if (node) {
        this.internal.translate(nodeID, [movement[0] - (node.x - origin[0]), movement[1] - (node.y - origin[1])]);
      }
    },

    translateMany: (nodeIDs: string[], movement: Pair<number>, origins: Point[]) => {
      nodeIDs.forEach((nodeID) => this.internal.translate(nodeID, movement));

      if (this.isAtomicActionsAwareness) {
        this.engine.io.nodeDragMany(nodeIDs, movement, origins);
      }
    },

    translateManyOnOrigins: (nodeIDs: string[], movement: Pair<number>, origins: Point[]) => {
      nodeIDs.forEach((nodeID, i) => this.internal.translateBaseOnOrigin(nodeID, movement, origins[i]));
    },

    saveLocations: async (nodeIDs: string[]): Promise<void> => {
      const nodes = nodeIDs.reduce<Record<string, [number, number]>>((acc, nodeID) => {
        const node = this.engine.nodes.get(nodeID);
        if (node) acc[nodeID] = [node.x, node.y];
        return acc;
      }, {});

      if (this.isAtomicActionsPhase2 && !!Object.keys(nodes).length) {
        await this.dispatch
          .sync(
            Realtime.node.moveMany({
              ...this.engine.context,
              blocks: nodes,
            })
          )
          .catch(Sentry.error);
      } else {
        Object.entries(nodes).forEach(([nodeID, coords]) => this.dispatch(Creator.updateNodeLocation(nodeID, coords)));
      }
    },
  };

  api(nodeID: string): NodeEntity | null {
    return this.engine.nodes.get(nodeID)?.api ?? null;
  }

  isReady(nodeID: string): boolean {
    return !!this.engine.nodes.get(nodeID)?.api?.isReady();
  }

  /**
   * check to see if a node is active
   */
  isActive(nodeID: string): boolean {
    return this.engine.activation.hasTargets && this.engine.activation.isTarget(nodeID);
  }

  /**
   * check to see if a node or its parent parent is active
   */
  isBranchActive(nodeID: string): boolean {
    const node = this.engine.getNodeByID(nodeID);

    return (node?.parentNode && this.isActive(node.parentNode)) || this.isActive(nodeID);
  }

  /**
   * check to see if a node or any of its descendents are active
   */
  isSubtreeActive(nodeID: string): boolean {
    const node = this.engine.getNodeByID(nodeID);

    return this.isActive(nodeID) || !!node?.combinedNodes.some((childNodeID) => this.isActive(childNodeID));
  }

  getRect(nodeID: string): DOMRect | null {
    return this.api(nodeID)?.instance?.getRect() ?? null;
  }

  async add<K extends keyof Realtime.NodeDataMap>(
    type: K,
    coords: Coords,
    factoryData?: Realtime.NodeDataMap[K] & Partial<Realtime.NodeData<{}>>,
    nodeID: string = Utils.id.objectID(),
    autoFocus = true
  ): Promise<string> {
    const [x, y] = this.engine.canvas!.fromCoords(coords);

    const { node, data } = nodeDescriptorFactory(type, factoryData, this.select(nodeFactoryOptionsSelector));
    const augmentedNode = { ...node, x, y, id: nodeID };
    const parentNode = { id: Utils.id.objectID(), ports: { in: [{ id: Utils.id.objectID() }], out: { dynamic: [], builtIn: {}, byKey: {} } } };

    this.log.debug(this.log.pending('adding node'), this.log.slug(nodeID));

    if (!this.isAtomicActionsPhase2) {
      await this.engine.realtime.sendUpdate(RealtimeDuck.addNode(augmentedNode, data, parentNode));
    }

    await this.dispatch(
      History.transaction(async () => {
        if (isMarkupBlockType(type)) {
          await this.internal.addMarkup(augmentedNode, data);
        } else {
          await this.internal.addBlock(augmentedNode, data, parentNode);
        }

        this.engine.saveHistory();
        // TODO: fold this into the actions that add new steps to have better atomicity
        await this.handleNewStep(augmentedNode, data, autoFocus);
      })
    );

    this.log.info(this.log.success('added node'), this.log.slug(nodeID));

    return nodeID;
  }

  private getNewBlockName(): string {
    const rootNodeIDs = this.engine.getRootNodeIDs();
    return `New Block ${rootNodeIDs.length}`;
  }

  private async handleNewStep<T extends { id: string; type: BlockType }>(node: T, data: Realtime.NodeData<any>, autoFocus = true) {
    this.dispatch(Tracking.trackNewStepCreated({ stepType: node.type }));

    await this.registerIntentSteps([{ node, data }]);

    if (autoFocus) {
      this.engine.setActive(node.id);
    }
  }

  /**
   * imports a snapshot containing multiple nodes, ports and links to the canvas
   */
  async importSnapshot(entities: Realtime.EntityMap, coords: Coords): Promise<void> {
    this.log.debug(this.log.pending('adding multiple entities from snapshot'), entities);

    const point = this.engine.canvas!.fromCoords(coords);
    const centeredEntities = centerNodeGroup(entities, point);

    if (!this.isAtomicActionsPhase2) {
      await this.engine.realtime.sendUpdate(RealtimeDuck.addManyNodes(centeredEntities, point));
    }

    await this.dispatch(
      History.transaction(async () => {
        await this.internal.importSnapshot(centeredEntities);
        this.engine.saveHistory();

        await this.registerIntentSteps(entities.nodesWithData);
      })
    );

    this.log.info(this.log.success('added multiple entities from snapshot'), this.log.value(entities.nodesWithData.length));
  }

  /**
   * duplicates a node by its ID
   */
  async duplicate(nodeID: string): Promise<void> {
    this.log.debug(this.log.pending('duplicating node'), this.log.slug(nodeID));

    const duplicateNodeWithData = await this.engine.diagram.duplicateNode(nodeID);

    if (duplicateNodeWithData?.node?.id) {
      this.engine.saveHistory();
      this.engine.setActive(duplicateNodeWithData.node.id);

      await this.registerIntentSteps([duplicateNodeWithData]);
      await this.internal.addNewStartingBlock({ id: duplicateNodeWithData.node.id, name: duplicateNodeWithData.data.name });

      this.log.info(this.log.success('duplicated node'), this.log.slug(nodeID));
    }
  }

  /**
   * duplicates multiples nodes by their IDs
   *
   * we use the copy and paste logic to preserve the link connections, rather than reuse the single duplicate method above
   */
  async duplicateMany(nodeIDs: string[]): Promise<void> {
    const clipboardData = this.engine.clipboard.getClipboardContext(nodeIDs);

    const { center: centerCoords } = getNodesGroupCenter(
      clipboardData.nodes.map((node) => ({ data: clipboardData.data[node.id], node })),
      clipboardData.links
    );

    const coords = this.engine.canvas!.toCoords(centerCoords).add(DUPLICATE_OFFSET);

    const { nodesWithData } = await this.engine.clipboard.cloneClipboardContext(clipboardData, coords);

    const parentNodes: string[] = [];

    nodesWithData.forEach(({ node }) => {
      if (isMarkupOrCombinedBlockType(node.type)) {
        parentNodes.push(node.id);
      }
    });

    this.engine.selection.replace(parentNodes);

    this.engine.saveHistory();

    await this.registerIntentSteps(nodesWithData);
    await this.internal.addManyStartingBlocks(nodesWithData);
  }

  /**
   * patches a node's data by its ID
   */
  async updateData<T extends unknown = unknown>(nodeID: string, patch: Partial<Realtime.NodeData<T>>, save = true): Promise<void> {
    this.updateManyData([{ nodeID, patch }], save);
  }

  /**
   * patches multiple nodes data by ID
   */
  async updateManyData<T extends unknown = unknown>(updates: { nodeID: string; patch: Partial<Realtime.NodeData<T>> }[], save = true): Promise<void> {
    this.log.debug(this.log.pending('updating many node data'), this.log.value(updates.length));

    if (!this.isAtomicActionsPhase2) {
      await Promise.all(updates.map(({ nodeID, patch }) => this.engine.realtime.sendUpdate(RealtimeDuck.updateNodeData(nodeID, patch))));
    }
    await this.internal.updateManyData(updates);

    updates.forEach(({ nodeID, patch }) => {
      if (patch.name && this.engine.getDataByNodeID(nodeID)?.type === Realtime.BlockType.COMBINED) {
        this.internal.updateStartingBlock({ blockID: nodeID, name: patch.name });
      }
      this.redraw(nodeID);
    });

    if (save) {
      this.engine.saveHistory();
    }

    this.log.info(this.log.success('updated many node data'), this.log.value(updates.length));
  }

  /**
   * removes many nodes by their IDs
   */
  removeMany(nodeIDs: string[]): Promise<void> {
    if (!nodeIDs.length) {
      this.log.debug('attempted to remove empty set of nodes');

      return Promise.resolve();
    }

    const allNodeIDs = this.collectNodesToRemove(nodeIDs);

    this.log.debug(this.log.pending('removing multiple nodes'), allNodeIDs);

    return this.validateRemove(allNodeIDs, async (removableNodeIDs) => {
      await this.engine.comment.handleNodesDelete(removableNodeIDs);

      if (!this.isAtomicActionsPhase2) {
        await this.engine.realtime.sendUpdate(RealtimeDuck.removeManyNodes(removableNodeIDs));
        await this.internal.removeStartingBlocks(removableNodeIDs);
      }

      await this.internal.removeMany(removableNodeIDs);

      this.engine.saveHistory();

      this.dispatch(Creator.validateTopicAvailability());

      this.log.info(this.log.success('removed multiple nodes'), this.log.value(removableNodeIDs.length));
    });
  }

  /**
   * remove a single node by its ID
   */
  remove(nodeID: string): Promise<void> {
    return this.removeMany([nodeID]);
  }

  // nested node management methods

  /**
   * appends a new step to a block
   */
  async appendStep(blockID: string, type: BlockType): Promise<void> {
    const stepID = Utils.id.objectID();
    const { node, data } = nodeDescriptorFactory(type, undefined, this.select(nodeFactoryOptionsSelector));
    const nodeWithID = { ...node, id: stepID };

    this.log.debug(this.log.pending('adding nested node'), this.log.slug(stepID));

    if (!this.isAtomicActionsPhase2) {
      await this.engine.realtime.sendUpdate(RealtimeDuck.addNestedNode(blockID, nodeWithID, data));
    }

    await this.dispatch(
      History.transaction(async () => {
        await this.internal.appendStep(blockID, nodeWithID, data);

        this.engine.saveHistory();
        // TODO: fold this into the actions that add new steps to have better atomicity
        await this.handleNewStep(nodeWithID, data);
      })
    );

    this.log.info(this.log.success('added nested node'), this.log.slug(stepID));
  }

  /**
   * @deprecated
   */
  private async insertStepV1(blockID: string, node: Creator.NodeDescriptor, data: Creator.DataDescriptor, index: number): Promise<void> {
    const parentNode = {
      id: Utils.id.objectID(),
      ports: { in: [{ id: Utils.id.objectID() }], out: { byKey: {}, dynamic: [], builtIn: {} } },
    };

    this.log.debug(this.log.pending('adding nested node'), this.log.slug(node.id));

    batch(() => {
      this.internal.addV1(node, data, parentNode);
      this.internal.insertNestedNode(blockID, index, parentNode.id);
    });

    await this.engine.realtime.sendUpdate(RealtimeDuck.addNode(node, data, parentNode));
    await this.engine.realtime.sendUpdate(RealtimeDuck.insertNestedNode(blockID, index, node.id));

    this.engine.saveHistory();
    await this.handleNewStep(node, data);

    this.log.info(this.log.success('added nested node'), this.log.slug(node.id));
  }

  /**
   * inserts a new step to a block at some index
   */
  async insertStepV2<K extends keyof Realtime.NodeDataMap>(
    blockID: string,
    type: K,
    index: number,
    factoryData?: Realtime.NodeDataMap[K] & Partial<Realtime.NodeData<{}>>,
    nodeID: string = Utils.id.objectID()
  ): Promise<void> {
    const { node, data } = nodeDescriptorFactory(type, factoryData, this.select(nodeFactoryOptionsSelector));
    const nodeWithID = { ...node, id: nodeID };

    if (!this.isAtomicActionsPhase2) {
      await this.insertStepV1(blockID, nodeWithID, data, index);
      return;
    }

    this.log.debug(this.log.pending('inserting step'), this.log.slug(nodeWithID.id));

    await this.dispatch(
      History.transaction(async () => {
        await this.internal.insertStepV2(blockID, nodeWithID, data, index);
        // TODO: fold this into the actions that add new steps to have better atomicity
        await this.handleNewStep(nodeWithID, data);
      })
    );

    this.log.info(this.log.success('inserted step'), this.log.slug(nodeWithID.id));
  }

  /**
   * @deprecated
   */
  private async relocateV1(parentNodeID: string, index: number, nodeID: string): Promise<void> {
    this.log.debug(this.log.pending('inserting nested node'), this.log.slug(nodeID));

    this.internal.insertNestedNode(parentNodeID, index, nodeID);

    if (!this.isAtomicActionsPhase2) {
      await this.engine.realtime.sendUpdate(RealtimeDuck.insertNestedNode(parentNodeID, index, nodeID));
    }

    this.engine.saveHistory();

    this.log.info(this.log.success('inserted nested node'), this.log.slug(nodeID));
  }

  /**
   * relocate steps and blocks to within other blocks
   */
  async relocateV2(targetBlockID: string, nodeID: string, index: number): Promise<void> {
    if (!this.isAtomicActionsPhase2) {
      await this.relocateV1(targetBlockID, index, nodeID);
      return;
    }

    const sourceBlockID = this.select(CreatorV2.blockIDByStepIDSelector, { id: nodeID });

    if (sourceBlockID === targetBlockID) {
      await this.reorderSteps(targetBlockID, nodeID, index);
    } else if (sourceBlockID) {
      await this.transplantStep(targetBlockID, sourceBlockID, nodeID, index);
    } else {
      await this.transplantBlock(targetBlockID, nodeID, index);
    }
  }

  /**
   * relocates a step from one block to another at some index
   */
  private async transplantStep(targetBlockID: string, sourceBlockID: string, stepID: string, index: number): Promise<void> {
    const stepIDs = this.select(CreatorV2.stepIDsByBlockIDSelector, { id: sourceBlockID });
    const removeSource = Utils.array.hasIdenticalMembers(stepIDs, [stepID]);

    this.log.debug(this.log.pending('transplanting step'), this.log.slug(stepID));
    await this.internal.transplantSteps(targetBlockID, sourceBlockID, [stepID], index, removeSource);
    this.log.info(this.log.success('transplanted step'), this.log.slug(stepID));
  }

  /**
   * relocates all steps from one block to another at some index
   */
  private async transplantBlock(targetBlockID: string, sourceBlockID: string, index: number): Promise<void> {
    const stepIDs = this.select(CreatorV2.stepIDsByBlockIDSelector, { id: sourceBlockID });

    this.log.debug(this.log.pending('transplanting block'), this.log.slug(sourceBlockID));
    await this.internal.transplantSteps(targetBlockID, sourceBlockID, stepIDs, index, true);
    this.log.info(this.log.success('transplanted block'), this.log.slug(sourceBlockID));
  }

  /**
   * reorder a step within a single block
   */
  private async reorderSteps(blockID: string, stepID: string, index: number): Promise<void> {
    this.log.debug(this.log.pending('reordering steps'), this.log.slug(stepID));
    await this.internal.reorderSteps(blockID, stepID, index);
    this.log.info(this.log.success('reordering steps'), this.log.slug(stepID));
  }

  /**
   * isolates a known step into its own block on the canvas
   */
  async isolateStep(nodeID: string, coords: Point): Promise<void> {
    const parentNodeID = Utils.id.objectID();
    const parentPortID = Utils.id.objectID();
    const parentNode = {
      id: parentNodeID,
      ports: { in: [{ id: parentPortID }], out: { dynamic: [], builtIn: {}, byKey: {} } },
    };

    this.log.debug(this.log.pending('unmerging node'), this.log.slug(nodeID));

    if (!this.isAtomicActionsPhase2) {
      await this.engine.realtime.sendUpdate(RealtimeDuck.unmergeNode(nodeID, coords, parentNode));
    }

    await this.internal.isolateStep(nodeID, coords, parentNode);
    this.engine.saveHistory();

    this.log.info(this.log.success('unmerged node'), this.log.slug(nodeID));
  }

  // location / rendering methods

  async translate(nodeIDs: string[], movement: Pair<number>, volatile = true): Promise<void> {
    const activeNodeIDs = nodeIDs.filter((nodeID) => this.engine.nodes.has(nodeID));
    const origins = activeNodeIDs.map<Point>((nodeID) => {
      const node = this.engine.nodes.get(nodeID)!;

      return [node.x, node.y];
    });

    await this.internal.translateMany(activeNodeIDs, movement, origins);

    const action = RealtimeDuck.moveManyNodes(activeNodeIDs, movement, origins);

    if (volatile && !this.isAtomicActionsAwareness) {
      this.engine.realtime.sendVolatileUpdate(action);
    } else if (!volatile && !this.isAtomicActionsPhase2) {
      await this.engine.realtime.sendUpdate(action);
    }
  }

  async saveLocations(nodeIDs: Nullish<string>[]): Promise<void> {
    const existingNodeIDs = nodeIDs?.filter((nodeID): nodeID is string => !!nodeID && this.engine.nodes.has(nodeID));
    if (!existingNodeIDs?.length) return;

    reduxBatchUndo.start();

    await Promise.all([this.saveLinks(existingNodeIDs), this.internal.saveLocations(existingNodeIDs)]);

    reduxBatchUndo.end();

    this.log.debug(`location saved for ${this.log.value(existingNodeIDs.length)} nodes`);
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

  translateAllLinks(nodeID: string, movement: Pair<number>, { sync = false }: { sync?: boolean } = {}): void {
    [nodeID, ...this.select(CreatorV2.stepIDsByBlockIDSelector, { id: nodeID })].forEach((id) => this.translateLinks(id, movement, { sync }));
  }

  private translateLinks(nodeID: string, movement: Pair<number>, { sync }: { sync: boolean }): void {
    this.engine.getLinkIDsByNodeID(nodeID).forEach((linkID) => {
      if (!this.engine.links.has(linkID)) return;

      const link = this.engine.getLinkByID(linkID);

      if (!link) return;

      const isSource = link.source.nodeID === nodeID;
      const linkedNode = this.engine.getNodeByID(isSource ? link.target.nodeID : link.source.nodeID);

      this.engine.link.translatePoint(linkID, movement, {
        sync,
        isSource,
        sourceAndTargetSelected: !!linkedNode && this.engine.drag.isInGroup(linkedNode.parentNode || linkedNode.id),
      });
    });
  }

  async saveLinks(nodeIDs: string[]): Promise<void> {
    const linkIDs = nodeIDs.flatMap((nodeID) => {
      const node = this.engine.getNodeByID(nodeID);
      const nodeLinkIDs = this.engine.getLinkIDsByNodeID(nodeID);
      const combinedNodes = node?.combinedNodes.flatMap((childNodeID) => this.engine.getLinkIDsByNodeID(childNodeID)) ?? [];
      return [...nodeLinkIDs, ...combinedNodes];
    });

    const validLinkIDs = Utils.array.unique(linkIDs).filter((linkID) => this.engine.links.has(linkID));

    await this.engine.link.savePointsMany(validLinkIDs, { saveHistory: false });
  }

  translateAllThreads(nodeID: string, movement: Pair<number>): void {
    const node = this.engine.getNodeByID(nodeID);

    if (!node) return;

    [nodeID, ...node.combinedNodes].forEach((combinedNodeID) => this.translateThreads(combinedNodeID, movement));
  }

  translateThreads(nodeID: string, movement: Pair<number>): void {
    if (this.engine.comment.isModeActive || this.engine.comment.isVisible) {
      const movementVector = this.engine.canvas!.toVector(movement);
      this.engine.getThreadIDsByNodeID(nodeID).forEach((threadID) => this.engine.comment.translateThread(threadID, movementVector));
    }
  }

  async drag(nodeID: string, movement: Pair<number>, { translateFirst }: { translateFirst?: boolean } = {}): Promise<void> {
    if (this.engine.selection.isOneOfManyTargets(nodeID)) {
      const targets = this.engine.selection.getTargets();

      await (translateFirst ? this.translate(targets, movement) : this.engine.drag.setGroup(targets));
      await (translateFirst ? this.engine.drag.setGroup(targets) : this.translate(targets, movement));
    } else if (this.engine.transformation.isActive && !this.engine.focus.isTarget(nodeID)) {
      this.engine.focus.reset();
    } else {
      if (!this.engine.selection.isTarget(nodeID)) {
        this.engine.selection.reset();
      }

      await (translateFirst ? this.translate([nodeID], movement) : this.engine.drag.setTarget(nodeID));
      await (translateFirst ? this.engine.drag.setTarget(nodeID) : this.translate([nodeID], movement));

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
    const center = this.api(nodeID)?.instance?.getCenterPoint();

    if (!center || this.engine.isNodeOfType(nodeID, isMarkupBlockType)) return;

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
    const ports = this.select(CreatorV2.portsByNodeIDSelector, { id: nodeID });

    Realtime.Utils.port.flattenAllPorts(ports).forEach((portID) => this.engine.port.redrawLinks(portID));
    this.redrawNestedLinks(nodeID);
  }

  redrawPorts(nodeID: string): void {
    const ports = this.select(CreatorV2.portsByNodeIDSelector, { id: nodeID });
    const outPortIDs = Realtime.Utils.port.flattenOutPorts(ports);

    outPortIDs.forEach((portID) => this.engine.port.redraw(portID));
  }

  redrawNestedLinks(parentNodeID: Nullish<string>): void {
    this.select(CreatorV2.stepIDsByBlockIDSelector, { id: parentNodeID }).forEach((nodeID) => this.redrawLinks(nodeID));
  }

  redrawThreads(nodeID: string): void {
    this.engine.getThreadIDsByNodeID(nodeID).forEach((threadID) => this.engine.comment.redrawThread(threadID));
  }

  redrawNestedThreads(nodeID: Nullish<string>): void {
    if (!nodeID) return;

    [nodeID, ...this.select(CreatorV2.stepIDsByBlockIDSelector, { id: nodeID })].forEach((childNodeID) => this.redrawThreads(childNodeID));
  }

  async updateManyBlocksColor(nodeIDs: string[], color: string): Promise<void> {
    await this.updateManyData(nodeIDs.map((nodeID) => ({ nodeID, patch: { blockColor: color } })));
  }

  private async registerIntentSteps<T extends { node: { id: string; type: BlockType }; data: Realtime.NodeData<any> }>(
    addedNodes: T[]
  ): Promise<void> {
    const addedIntentSteps = addedNodes.reduce<Realtime.diagram.RegisterIntentStepsPayload['intentSteps']>((acc, { node, data }) => {
      if (node.type === BlockType.INTENT) {
        const platformData = data as Realtime.NodeData.Intent;

        acc.push({
          stepID: node.id,
          intent: platformData?.intent
            ? { intentID: platformData.intent, global: platformData.availability === BaseNode.Intent.IntentAvailability.GLOBAL }
            : null,
        });
      }

      return acc;
    }, []);

    if (addedIntentSteps.length) {
      await this.dispatch.sync(Realtime.diagram.registerIntentSteps({ ...this.engine.context, intentSteps: addedIntentSteps }));
    }
  }

  private isRemovingLocked(nodeIDs: string[], remove: (nodeIDs: string[]) => Promise<void>): boolean {
    const lockedNodes = this.select(RealtimeDuck.deletionLockedNodesSelector);
    const combinedNodes = nodeIDs.map(this.engine.getNodeByID).filter((node): node is Realtime.Node => node?.type === BlockType.COMBINED);

    const unRemovableCombinedNodeIDs = new Set(
      combinedNodes.filter((node) => node.combinedNodes.some((nestedNodeID) => !!lockedNodes[nestedNodeID])).map((node) => node.id)
    );

    const [lockedNodeIDs, unlockedNodesIDs] = _partition(nodeIDs, (id) => !!lockedNodes[id] || unRemovableCombinedNodeIDs.has(id));

    if (lockedNodeIDs.length) {
      // eslint-disable-next-line no-nested-ternary
      const text = unlockedNodesIDs.length ? 'Some blocks are' : nodeIDs.length > 1 ? 'These blocks are' : 'This block is';

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

  private isRemovingDefaultCommand(nodes: Realtime.Node[]): boolean {
    const commandNodes = nodes.filter(isCommandNode);
    const commandNodesIDs = commandNodes.map(({ id }) => id);
    const commandNodeData = commandNodesIDs.map((nodeID) => this.engine.getDataByNodeID<Realtime.NodeData.Command>(nodeID));
    // if the deleted node is not a help intent or a stop intent
    const deletingStopIntent = commandNodeData.some((data) => data?.intent === AlexaConstants.AmazonIntent.STOP);
    const deletingHelpIntent = commandNodeData.some((data) => data?.intent === AlexaConstants.AmazonIntent.HELP);

    if ((deletingStopIntent || deletingHelpIntent) && this.engine.isRootDiagram()) {
      const homeBlockCombinedNodesIDs = this.engine.getNodeByID(commandNodes[0].parentNode)?.combinedNodes ?? [];
      const remainedCommandsData = homeBlockCombinedNodesIDs
        .filter((el) => !commandNodesIDs.includes(el))
        .map((nodeID) => this.engine.getDataByNodeID<Realtime.NodeData.Command>(nodeID));

      // logic: user deleting stop intent and there are no more stop intent left
      const missingStopIntent = remainedCommandsData.every((data) => data?.intent !== AlexaConstants.AmazonIntent.STOP) && deletingStopIntent;
      const missingHelpIntent = remainedCommandsData.every((data) => data?.intent !== AlexaConstants.AmazonIntent.HELP) && deletingHelpIntent;
      const requiredCommand = (missingStopIntent && AlexaConstants.AmazonIntent.STOP) || (missingHelpIntent && AlexaConstants.AmazonIntent.HELP);

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

  private collectNodesToRemove(nodeIDs: string[]) {
    return Utils.array.unique([
      ...nodeIDs,

      // remove the block if all child steps are being removed
      ...nodeIDs.flatMap((nodeID) => {
        const blockID = this.select(CreatorV2.blockIDByStepIDSelector, { id: nodeID });
        if (!blockID || nodeIDs.includes(blockID)) return [];

        const stepIDs = this.select(CreatorV2.stepIDsByBlockIDSelector, { id: blockID });
        if (stepIDs.every((stepID) => nodeIDs.includes(stepID))) return [blockID];

        return [];
      }),

      // remove all children from any blocks being removed
      ...nodeIDs.flatMap((nodeID) => this.select(CreatorV2.stepIDsByBlockIDSelector, { id: nodeID })),
    ]);
  }

  private async validateRemove(nodeIDs: string[], remove: (nodeIDs: string[]) => Promise<void>): Promise<void> {
    const removableNodes = this.engine.select(CreatorV2.nodesByIDsSelector, { ids: nodeIDs }).filter((node) => node.type !== BlockType.START);
    const removableNodeIDs = removableNodes.map(({ id }) => id);

    if (this.isRemovingDefaultCommand(removableNodes) || this.isRemovingLocked(removableNodeIDs, remove)) return;

    await remove(removableNodeIDs);
  }
}

export default NodeManager;
