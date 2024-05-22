import { datadogRum } from '@datadog/browser-rum';
import { AlexaConstants } from '@voiceflow/alexa-types';
import { BaseNode } from '@voiceflow/base-types';
import { Nullish, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import _partition from 'lodash/partition';
import { createSelector } from 'reselect';

import { BlockType, StepMenuType } from '@/constants';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as CustomBlock from '@/ducks/customBlock';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Feature from '@/ducks/feature';
import * as History from '@/ducks/history';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Tracking from '@/ducks/tracking';
import * as TrackingEvents from '@/ducks/tracking/events';
import * as VersionV2 from '@/ducks/versionV2';
import * as ModalsV2 from '@/ModalsV2';
import { Pair, Point } from '@/types';
import { Coords } from '@/utils/geometry';
import { centerNodeGroup, getNodesGroupCenter } from '@/utils/node';
import { isMarkupBlockType, isMarkupOrCombinedBlockType } from '@/utils/typeGuards';

import { EntityType } from './constants';
import NodeEntity from './entities/nodeEntity';
import { createPortRemap, DUPLICATE_OFFSET, EngineConsumer, nodeDescriptorFactory } from './utils';

const nodeFactoryOptionsSelector = createSelector(
  [
    ProjectV2.active.platformSelector,
    ProjectV2.active.projectTypeSelector,
    VersionV2.active.voice.defaultVoiceSelector,
    Feature.allActiveFeaturesSelector,
    VersionV2.active.canvasNodeVisibilitySelector,
    CustomBlock.allCustomBlocksSelector,
  ],
  // eslint-disable-next-line max-params
  (platform, projectType, defaultVoice, allActiveFeatures, canvasNodeVisibility, allCustomBlocks) => ({
    features: allActiveFeatures,
    platform,
    projectType,
    defaultVoice,
    canvasNodeVisibility: canvasNodeVisibility || BaseNode.Utils.CanvasNodeVisibility.PREVIEW,
    allCustomBlocks,
  })
);

class NodeManager extends EngineConsumer {
  log = this.engine.log.child('node');

  internal = {
    addBlock: async ({
      node,
      data,
      diagramID,
      parentNode,
    }: {
      node: CreatorV2.NodeDescriptor;
      data: CreatorV2.DataDescriptor;
      diagramID?: string;
      parentNode: CreatorV2.ParentNodeDescriptor;
    }): Promise<void> => {
      const stepTypeColor = this.engine.select(VersionV2.active.defaultStepColorByStepType, {
        stepType: node.type,
      });
      const blockName = this.getNewBlockName(node.type);
      const blockID = parentNode.id;
      const { context } = this.engine;

      await this.dispatch.partialSync(
        Realtime.node.addBlock({
          ...context,
          diagramID: diagramID ?? context.diagramID,
          projectMeta: this.engine.getActiveProjectMeta(),
          schemaVersion: this.engine.getActiveSchemaVersion(),

          blockID,
          blockName,
          blockPorts: parentNode.ports,
          blockCoords: [node.x, node.y],
          blockColor: stepTypeColor,

          stepID: node.id,
          stepData: { ...data, type: node.type },
          stepPorts: node.ports,
        })
      );
    },

    addActions: async (
      node: CreatorV2.NodeDescriptor,
      data: CreatorV2.DataDescriptor,
      parentNode: CreatorV2.ParentNodeDescriptor
    ): Promise<void> => {
      const actionsID = parentNode.id;

      await this.dispatch.partialSync(
        Realtime.node.addActions({
          ...this.engine.context,
          actionsID,
          stepID: node.id,
          stepData: { ...data, type: node.type },
          stepPorts: node.ports,
          projectMeta: this.engine.getActiveProjectMeta(),
          actionsPorts: parentNode.ports,
          actionsCoords: [node.x, node.y],
          schemaVersion: this.engine.getActiveSchemaVersion(),
        })
      );
    },

    addMarkup: async (node: CreatorV2.NodeDescriptor, data: CreatorV2.DataDescriptor): Promise<void> => {
      const markupData = data as CreatorV2.DataDescriptor<Realtime.Markup.AnyNodeData>;

      await this.dispatch.partialSync(
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
    },

    importSnapshot: async (entities: Realtime.EntityMap, diagramID?: string): Promise<void> => {
      await this.dispatch.partialSync(
        Realtime.creator.importSnapshot({
          ...this.engine.context,
          ...entities,
          ...(diagramID ? { diagramID } : {}),
          projectMeta: this.engine.getActiveProjectMeta(),
          schemaVersion: this.engine.getActiveSchemaVersion(),
        })
      );
    },

    insertStep: async ({
      node,
      data,
      index,
      isActions,
      parentNodeID,
    }: {
      node: CreatorV2.NodeDescriptor;
      data: CreatorV2.DataDescriptor;
      index: number;
      isActions: boolean;
      parentNodeID: string;
    }): Promise<void> => {
      const stepIDs = this.select(CreatorV2.stepIDsByParentNodeIDSelector, { id: parentNodeID });

      const isAppend = index === stepIDs.length;
      const removeNodes = !isActions && isAppend ? this.getActionNodesToRemove(stepIDs[stepIDs.length - 1]) : [];
      const nodePortRemaps = isAppend ? createPortRemap(this.engine.getNodeByID(stepIDs[stepIDs.length - 1])) : [];

      await this.engine.comment.handleNodesDelete(
        Utils.array.unique(removeNodes.map((node) => node.stepID ?? node.parentNodeID))
      );
      await this.dispatch.partialSync(
        Realtime.node.insertStep({
          ...this.engine.context,
          data: { ...data, type: node.type },
          ports: node.ports,
          index,
          stepID: node.id,
          isActions,
          removeNodes,
          projectMeta: this.engine.getActiveProjectMeta(),
          parentNodeID,
          schemaVersion: this.engine.getActiveSchemaVersion(),
          nodePortRemaps,
        })
      );

      this.redrawNestedLinks(parentNodeID);
      this.redrawNestedThreads(parentNodeID);
    },

    insertManySteps: async ({
      steps,
      index,
      parentNodeID,
    }: {
      steps: { node: CreatorV2.NodeDescriptor; data: CreatorV2.DataDescriptor }[];
      index: number;
      parentNodeID: string;
    }): Promise<void> => {
      const stepIDs = this.select(CreatorV2.stepIDsByParentNodeIDSelector, { id: parentNodeID });

      const isAppend = index === stepIDs.length;
      const removeNodes = isAppend ? this.getActionNodesToRemove(stepIDs[stepIDs.length - 1]) : [];
      const nodePortRemaps = isAppend ? createPortRemap(this.engine.getNodeByID(stepIDs[stepIDs.length - 1])) : [];

      await this.engine.comment.handleNodesDelete(
        Utils.array.unique(removeNodes.map((node) => node.stepID ?? node.parentNodeID))
      );
      await this.dispatch.partialSync(
        Realtime.node.insertManySteps({
          ...this.engine.context,
          parentNodeID,
          steps: steps.map((step) => ({
            stepID: step.node.id,
            data: {
              ...step.data,
              type: step.node.type,
            },
            ports: step.node.ports,
          })),
          index,
          projectMeta: this.engine.getActiveProjectMeta(),
          removeNodes,
          schemaVersion: this.engine.getActiveSchemaVersion(),
          nodePortRemaps,
        })
      );

      this.redrawNestedLinks(parentNodeID);
      this.redrawNestedThreads(parentNodeID);
    },

    transplantSteps: async ({
      index,
      stepIDs,
      removeSource,
      targetParentNodeID,
      sourceParentNodeID,
    }: {
      index: number;
      stepIDs: string[];
      removeSource: boolean;
      targetParentNodeID: string;
      sourceParentNodeID: string;
    }): Promise<void> => {
      if (!stepIDs.length) return;

      const sourceStepIDs = this.select(CreatorV2.stepIDsByParentNodeIDSelector, { id: sourceParentNodeID });
      const targetStepIDs = this.select(CreatorV2.stepIDsByParentNodeIDSelector, { id: targetParentNodeID });

      const sourceBlockLastStepID = sourceStepIDs[sourceStepIDs.length - 1];
      const isMovingSourceLastStep = stepIDs.includes(sourceBlockLastStepID) && index !== targetStepIDs.length;

      const targetBlockLastStepID = targetStepIDs[targetStepIDs.length - 1];
      const isMovingTargetLastStep = index === targetStepIDs.length;

      const nodePortRemaps = [
        ...((isMovingSourceLastStep && createPortRemap(this.engine.getNodeByID(sourceBlockLastStepID))) || []),
        ...((isMovingTargetLastStep && createPortRemap(this.engine.getNodeByID(targetBlockLastStepID))) || []),
      ];

      const removeNodes = [
        ...((isMovingSourceLastStep && this.getActionNodesToRemove(sourceBlockLastStepID)) || []),
        ...((isMovingTargetLastStep && this.getActionNodesToRemove(targetBlockLastStepID)) || []),
      ];

      await this.engine.comment.handleNodesDelete(
        Utils.array.unique(removeNodes.map((node) => node.stepID ?? node.parentNodeID))
      );
      await this.dispatch.partialSync(
        Realtime.node.transplantSteps({
          ...this.engine.context,
          index,
          stepIDs,
          removeNodes,
          removeSource,
          nodePortRemaps,
          sourceParentNodeID,
          targetParentNodeID,
        })
      );

      this.redrawNestedLinks(targetParentNodeID);
      this.redrawNestedLinks(sourceParentNodeID);
      this.redrawNestedThreads(targetParentNodeID);
      this.redrawNestedThreads(sourceParentNodeID);
    },

    reorderSteps: async (parentNodeID: string, stepID: string, index: number): Promise<void> => {
      const stepIDs = this.select(CreatorV2.stepIDsByParentNodeIDSelector, { id: parentNodeID });
      const currentIndex = stepIDs.indexOf(stepID);
      if (currentIndex === -1) return;

      const lastStepID = stepIDs[stepIDs.length - 1];
      const isLastStepMoved = index === stepIDs.length || stepID === lastStepID;

      const removeNodes = isLastStepMoved ? this.getActionNodesToRemove(lastStepID) : [];
      const nodePortRemaps = isLastStepMoved ? createPortRemap(this.engine.getNodeByID(lastStepID)) : [];

      const finalIndex = currentIndex < index ? index - 1 : index;

      await this.engine.comment.handleNodesDelete(
        Utils.array.unique(removeNodes.map((node) => node.stepID ?? node.parentNodeID))
      );
      await this.dispatch.partialSync(
        Realtime.node.reorderSteps({
          ...this.engine.context,
          index: finalIndex,
          stepID,
          removeNodes,
          parentNodeID,
          nodePortRemaps,
        })
      );

      this.redrawNestedLinks(parentNodeID);
      this.redrawNestedThreads(parentNodeID);
    },

    isolateStep: async (nodeID: string, coords: Point, parentNode: CreatorV2.ParentNodeDescriptor): Promise<void> => {
      const node = this.engine.getNodeByID(nodeID);
      if (!node) return;

      const blockName = this.getNewBlockName(node.type);

      const projectMeta = this.engine.getActiveProjectMeta();
      const parentNodeStepIDs = this.select(CreatorV2.stepIDsByParentNodeIDSelector, { id: node.parentNode! });
      const stepIDs = [nodeID];

      // if we are isolating every step in a block, we are simply just moving the block
      const movingEntireBlock = parentNodeStepIDs.length === stepIDs.length;
      if (movingEntireBlock) {
        this.setOrigin(node.parentNode!, coords);
        await this.saveLocations([node.parentNode!]);
      } else {
        await this.dispatch.partialSync(
          Realtime.node.isolateSteps({
            ...this.engine.context,
            stepIDs,
            projectMeta,
            sourceParentNodeID: node.parentNode!,
            parentNodeID: parentNode.id,
            schemaVersion: this.engine.getActiveSchemaVersion(),
            parentNodeData: { ports: parentNode.ports, coords, name: blockName, type: Realtime.BlockType.COMBINED },
          })
        );
      }

      this.redrawNestedLinks(parentNode.id);
      this.redrawNestedLinks(node.parentNode!);
      this.redrawNestedThreads(parentNode.id);
      this.redrawNestedThreads(node.parentNode!);
    },

    updateManyData: async (
      updates: { nodeID: string; patch: Partial<Realtime.NodeData<unknown>> }[]
    ): Promise<void> => {
      if (!updates.length) return;

      const projectMeta = this.engine.getActiveProjectMeta();
      const nodes = updates.reduce<Realtime.NodeData<unknown>[]>((acc, { nodeID, patch }) => {
        const data = this.engine.getDataByNodeID(nodeID);
        if (data) {
          acc.push({ ...data, ...patch });
        }
        return acc;
      }, []);

      if (!nodes.length) return;

      await this.dispatch.partialSync(Realtime.node.updateDataMany({ ...this.engine.context, nodes, projectMeta }));
    },

    removeMany: async (nodeIDs: string[]): Promise<void> => {
      const nodes = this.select(CreatorV2.nodesByIDsSelector, { ids: nodeIDs });
      const removedIDs = new Set<string>();

      nodes.forEach((node) => {
        this.engine.activation.deactivate(EntityType.NODE, node.id);
        [...node.combinedNodes, node.id].forEach((childNodeID) => removedIDs.add(childNodeID));
      });

      const nodesToRemove = Array.from(removedIDs).map((nodeID) => {
        const parentNodeID = this.select(CreatorV2.parentNodeIDByStepIDSelector, { id: nodeID });

        return parentNodeID ? { parentNodeID, stepID: nodeID } : { parentNodeID: nodeID };
      });

      await this.engine.comment.handleNodesDelete(Array.from(removedIDs));
      await this.dispatch.partialSync(Realtime.node.removeMany({ ...this.engine.context, nodes: nodesToRemove }));
    },

    translate: (nodeID: string, movement: Pair<number>): void => {
      this.api(nodeID)?.instance?.translate?.(movement);
      this.updateOrigin(nodeID, movement);

      if (!this.engine.isFeatureEnabled(Realtime.FeatureFlag.EXPERIMENTAL_SYNC_LINKS)) {
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

      this.engine.io.nodeDragMany(nodeIDs, movement, origins);
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

      if (!Object.keys(nodes).length) return;

      await this.dispatch
        .partialSync(
          Realtime.node.moveMany({
            ...this.engine.context,
            blocks: nodes,
          })
        )
        .catch(datadogRum.addError);
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
    return (
      this.engine.activation.hasTargets(EntityType.NODE) && this.engine.activation.isTarget(EntityType.NODE, nodeID)
    );
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

    return (
      this.isActive(nodeID) ||
      [...(node?.combinedNodes ?? []), ...this.getAllLinkedOutActionsNodeIDs([nodeID])].some((childNodeID) =>
        this.isActive(childNodeID)
      )
    );
  }

  getRect(nodeID: string): DOMRect | null {
    return this.api(nodeID)?.instance?.getRect() ?? null;
  }

  async add<K extends keyof Realtime.NodeDataMap>({
    type,
    coords,
    nodeID = Utils.id.objectID(),
    menuType = StepMenuType.SIDEBAR,
    autoFocus,
    diagramID,
    factoryData,
    fromCanvasCoords = true,
  }: {
    type: K;
    coords: Coords;
    nodeID?: string;
    menuType?: StepMenuType;
    diagramID?: string;
    autoFocus?: boolean;
    // eslint-disable-next-line @typescript-eslint/ban-types
    factoryData?: Realtime.NodeDataMap[K] & Partial<Realtime.NodeData<{}>>;
    fromCanvasCoords?: boolean;
  }): Promise<string> {
    const [x, y] = fromCanvasCoords ? this.engine.canvas!.fromCoords(coords) : coords.raw();

    // create step
    const { node, data } = nodeDescriptorFactory(nodeID, type, factoryData, this.select(nodeFactoryOptionsSelector));
    const augmentedNode = { ...node, x, y };

    // create block around step
    const parentNodeID = Utils.id.objectID();
    const parentNode = {
      id: parentNodeID,
      ports: {
        in: [{ id: Realtime.Utils.port.getInPortID(parentNodeID) }],
        out: { dynamic: [], builtIn: {}, byKey: {} },
      },
    };

    this.log.debug(this.log.pending('adding node'), this.log.slug(nodeID));

    await this.dispatch(
      History.transaction(async () => {
        if (isMarkupBlockType(type)) {
          await this.internal.addMarkup(augmentedNode, data);
        } else {
          await this.internal.addBlock({
            node: augmentedNode,
            data,
            diagramID,
            parentNode,
          });
        }

        this.handleNewStep(augmentedNode, menuType, { autoFocus });
      })
    );

    this.log.info(this.log.success('added node'), this.log.slug(nodeID));

    if (type === BlockType.CUSTOM_BLOCK_POINTER) {
      this.dispatch(TrackingEvents.trackCustomBlockPointerCreated());
    }

    return nodeID;
  }

  async addActions<K extends keyof Realtime.NodeDataMap>(
    type: K,
    index: number,
    actionsNodeID: string | null,
    factoryData?: Partial<Realtime.NodeData<Realtime.NodeDataMap[K]>>,
    nodeID = Utils.id.objectID()
  ): Promise<{ nodeID: string; actionsNodeID: string }> {
    let parentNodeID = actionsNodeID;

    this.log.debug(this.log.pending('adding actions node'), this.log.slug(nodeID));

    const actionNode = parentNodeID ? this.engine.getDataByNodeID(parentNodeID) : null;

    if (parentNodeID && actionNode) {
      await this.insertStep(actionNode.nodeID, type, index, { nodeID, factoryData, autoFocus: false, isActions: true });
    } else {
      parentNodeID = Utils.id.objectID();

      const { node, data } = nodeDescriptorFactory(nodeID, type, factoryData, this.select(nodeFactoryOptionsSelector));

      const augmentedNode = { ...node, x: 0, y: 0 };
      const parentNode = {
        id: parentNodeID,
        ports: { in: [{ id: Utils.id.objectID() }], out: { byKey: {}, dynamic: [], builtIn: {} } },
      };

      await this.internal.addActions(augmentedNode, data, parentNode);
    }

    this.log.info(this.log.success('added actions node'), this.log.slug(nodeID));

    return { nodeID, actionsNodeID: parentNodeID };
  }

  private getNewBlockName(type: BlockType): string {
    if (Realtime.Utils.typeGuards.isCanvasChipBlockType(type)) return '';

    const rootNodeIDs = this.engine.getRootNodeIDs();

    return `New Block ${rootNodeIDs.length}`;
  }

  private handleNewStep<T extends { id: string; type: BlockType }>(
    node: T,
    menuType: StepMenuType,
    { autoFocus = true }: { autoFocus?: boolean } = {}
  ) {
    this.dispatch(Tracking.trackNewStepCreated({ stepType: node.type, menuType }));

    if (autoFocus) {
      this.engine.setActive(node.id);
    }
  }

  /**
   * imports a snapshot containing multiple nodes, ports and links to the canvas
   */
  async importSnapshot(entities: Realtime.EntityMap, coords: Coords, diagramID?: string): Promise<void> {
    if (!this.engine.canvas) return;

    this.log.debug(this.log.pending('adding multiple entities from snapshot'), entities);

    const point = this.engine.canvas.fromCoords(coords);
    const centeredEntities = centerNodeGroup(entities, point);

    await this.dispatch(History.transaction(() => this.internal.importSnapshot(centeredEntities, diagramID)));

    this.log.info(
      this.log.success('added multiple entities from snapshot'),
      this.log.value(entities.nodesWithData.length)
    );
  }

  /**
   * duplicates multiples nodes by their IDs
   *
   * we use the copy and paste logic to preserve the link connections, rather than reuse the single duplicate method above
   */
  async duplicateMany(nodeIDs: string[]): Promise<void> {
    if (!this.engine.canvas) return;

    const allNodeIDs = [...nodeIDs, ...this.getAllLinkedOutActionsNodeIDs(nodeIDs)];

    const { nodes, data, links, ports } = this.engine.clipboard.getNodesClipboardContext(allNodeIDs);

    const nodesWithData = nodes.map((node) => ({ data: data[node.id], node }));

    const { center: centerCoords } = getNodesGroupCenter(nodesWithData, links);

    const coords = this.engine.canvas.toCoords(centerCoords).add(DUPLICATE_OFFSET);

    const result = await this.engine.diagram.cloneEntities({ nodesWithData, ports, links }, coords);

    const parentNodes: string[] = [];

    result.nodesWithData.forEach(({ node }) => {
      if (isMarkupOrCombinedBlockType(node.type)) {
        parentNodes.push(node.id);
      }
    });

    if (parentNodes.length === 1) {
      this.engine.setActive(parentNodes[0]);
    } else {
      this.engine.selection.replaceNode(parentNodes);
    }
  }

  /**
   * patches a node's data by its ID
   */
  async updateData<T>(nodeID: string, patch: Partial<Realtime.NodeData<T>>): Promise<void> {
    await this.updateManyData([{ nodeID, patch }]);
  }

  /**
   * patches multiple nodes data by ID
   */
  async updateManyData<T>(updates: { nodeID: string; patch: Partial<Realtime.NodeData<T>> }[]): Promise<void> {
    this.log.debug(this.log.pending('updating many node data'), this.log.value(updates.length));
    await this.internal.updateManyData(updates);

    updates.forEach(({ nodeID }) => this.redraw(nodeID));

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
      await this.internal.removeMany(removableNodeIDs);

      this.log.info(this.log.success('removed multiple nodes'), this.log.value(removableNodeIDs.length));
    });
  }

  /**
   * remove a single node by its ID
   */
  remove(nodeID: string): Promise<void> {
    return this.removeMany([nodeID]);
  }

  /**
   * inserts a new step to a block at some index
   */
  async insertStep<K extends keyof Realtime.NodeDataMap>(
    parentNodeID: string,
    type: K,
    index: number,
    {
      nodeID = Utils.id.objectID(),
      menuType = StepMenuType.SIDEBAR,
      nodeData = {},
      isActions = false,
      autoFocus,
      factoryData,
    }: {
      nodeID?: string;
      menuType?: StepMenuType;
      nodeData?: Partial<Realtime.NodeData<Realtime.NodeDataMap[K]>>;
      autoFocus?: boolean;
      isActions?: boolean;
      factoryData?: Partial<Realtime.NodeData<Realtime.NodeDataMap[K]>>;
    } = {}
  ): Promise<void> {
    const { node, data } = nodeDescriptorFactory(nodeID, type, factoryData, this.select(nodeFactoryOptionsSelector));

    this.log.debug(this.log.pending('inserting step'), this.log.slug(node.id));

    const overrideData = Utils.object.omit(nodeData, ['nodeID']);
    const finalNodeData = { ...data, ...overrideData } as CreatorV2.DataDescriptor;

    await this.dispatch(
      History.transaction(async () => {
        await this.internal.insertStep({ node, data: finalNodeData, index, isActions, parentNodeID });

        await this.handleNewStep(node, menuType, { autoFocus });
      })
    );

    this.log.info(this.log.success('inserted step'), this.log.slug(node.id));
  }

  /**
   * inserts many new steps to a block at some index
   */
  async insertManySteps<T>(
    parentNodeID: string,
    steps: Realtime.NodeData<T>[],
    index: number,
    {
      autoFocus,
    }: {
      autoFocus?: boolean;
    } = {}
  ): Promise<void> {
    const parsedSteps = steps.map((step) => {
      const { node, data } = nodeDescriptorFactory(
        Utils.id.objectID(),
        step.type,
        Utils.object.omit(step, ['nodeID']),
        this.select(nodeFactoryOptionsSelector)
      );

      return {
        node,
        data: {
          ...data,
          ...step,
        },
      };
    });

    const nodeIDs = parsedSteps.map(({ node }) => node.id);

    this.log.debug(this.log.pending('inserting steps'), this.log.slug(nodeIDs.join(',')));

    await this.dispatch(
      History.transaction(async () => {
        await this.internal.insertManySteps({ index, steps: parsedSteps, parentNodeID });

        this.handleNewStep(parsedSteps[0].node, StepMenuType.SIDEBAR, { autoFocus });
      })
    );

    this.log.info(this.log.success('inserted step'), this.log.slug(nodeIDs.join(',')));
  }

  /**
   * relocate steps and blocks to within other blocks
   */
  async relocate(targetNodeID: string, nodeID: string, index: number): Promise<void> {
    const sourceNodeID = this.select(CreatorV2.parentNodeIDByStepIDSelector, { id: nodeID });

    if (sourceNodeID === targetNodeID) {
      await this.reorderSteps(targetNodeID, nodeID, index);
    } else if (sourceNodeID) {
      await this.transplantStep(targetNodeID, sourceNodeID, nodeID, index);
    } else {
      await this.transplantBlock(targetNodeID, nodeID, index);
    }
  }

  /**
   * relocates a step from one block to another at some index
   */
  private async transplantStep(
    targetParentNodeID: string,
    sourceParentNodeID: string,
    stepID: string,
    index: number
  ): Promise<void> {
    const stepIDs = this.select(CreatorV2.stepIDsByParentNodeIDSelector, { id: sourceParentNodeID });
    const removeSource = Utils.array.hasIdenticalMembers(stepIDs, [stepID]);

    this.log.debug(this.log.pending('transplanting step'), this.log.slug(stepID));

    await this.internal.transplantSteps({
      index,
      stepIDs: [stepID],
      removeSource,
      targetParentNodeID,
      sourceParentNodeID,
    });

    this.log.info(this.log.success('transplanted step'), this.log.slug(stepID));
  }

  /**
   * relocates all steps from one block to another at some index
   */
  private async transplantBlock(targetParentNodeID: string, sourceParentNodeID: string, index: number): Promise<void> {
    const stepIDs = this.select(CreatorV2.stepIDsByParentNodeIDSelector, { id: sourceParentNodeID });

    this.log.debug(this.log.pending('transplanting block'), this.log.slug(sourceParentNodeID));

    await this.internal.transplantSteps({
      index,
      stepIDs,
      removeSource: true,
      targetParentNodeID,
      sourceParentNodeID,
    });

    this.log.info(this.log.success('transplanted block'), this.log.slug(sourceParentNodeID));
  }

  /**
   * reorder a step within a single block
   */
  private async reorderSteps(parentNodeID: string, stepID: string, index: number): Promise<void> {
    this.log.debug(this.log.pending('reordering steps'), this.log.slug(stepID));
    await this.internal.reorderSteps(parentNodeID, stepID, index);
    this.log.info(this.log.success('reordering steps'), this.log.slug(stepID));
  }

  /**
   * iterates over all nested steps and all linked actions
   */
  private iterateStepsAndLinkedActions(parentNodeID: Nullish<string>, redraw: (nodeID: string) => void): void {
    if (!parentNodeID) return;

    this.select(CreatorV2.stepIDsByParentNodeIDSelector, { id: parentNodeID }).forEach(redraw);

    this.getAllLinkedOutActionsNodeIDs([parentNodeID]).forEach((actionsNodeID) =>
      this.iterateStepsAndLinkedActions(actionsNodeID, redraw)
    );
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

    await this.internal.isolateStep(nodeID, coords, parentNode);

    this.log.info(this.log.success('unmerged node'), this.log.slug(nodeID));
  }

  // location / rendering methods

  translate(nodeIDs: string[], movement: Pair<number>) {
    const activeNodeIDs = nodeIDs.filter((nodeID) => this.engine.nodes.has(nodeID));
    const origins = activeNodeIDs.map<Point>((nodeID) => {
      const node = this.engine.nodes.get(nodeID)!;

      return [node.x, node.y];
    });

    this.internal.translateMany(activeNodeIDs, movement, origins);
  }

  async saveLocations(nodeIDs: Nullish<string>[]): Promise<void> {
    const existingNodeIDs = nodeIDs?.filter((nodeID): nodeID is string => !!nodeID && this.engine.nodes.has(nodeID));
    if (!existingNodeIDs?.length) return;

    await this.dispatch(
      History.transaction(async () => {
        await Promise.all([this.internal.saveLocations(existingNodeIDs), this.saveLinks(existingNodeIDs)]);
      })
    );

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
    this.translateLinks(nodeID, movement, { sync });
    this.iterateStepsAndLinkedActions(nodeID, (combinedNodeID) =>
      this.translateLinks(combinedNodeID, movement, { sync })
    );
  }

  private translateLinks(nodeID: string, movement: Pair<number>, { sync }: { sync: boolean }): void {
    this.engine.getLinkIDsByNodeID(nodeID).forEach((linkID) => {
      if (!this.engine.links.has(linkID)) return;

      const link = this.engine.getLinkByID(linkID);

      if (!link) return;

      const isSource = link.source.nodeID === nodeID;
      let linkedNode = this.engine.getNodeByID(isSource ? link.target.nodeID : link.source.nodeID);

      if (!isSource && linkedNode) {
        const linkedParentNode = this.engine.getNodeByID(linkedNode.parentNode);

        if (linkedParentNode?.type === BlockType.ACTIONS) {
          const parentNodePorts = this.engine.select(CreatorV2.portsByNodeIDSelector, { id: linkedParentNode.id });
          const parentNodeInLinkID = this.engine.getLinkIDsByPortID(parentNodePorts?.in[0])[0];
          const parentNodeLinkedInNode = this.engine.getSourceNodeByLinkID(parentNodeInLinkID);

          linkedNode = parentNodeLinkedInNode ?? linkedNode;
        }
      }

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
      const combinedNodes =
        node?.combinedNodes.flatMap((childNodeID) => this.engine.getLinkIDsByNodeID(childNodeID)) ?? [];
      return [...nodeLinkIDs, ...combinedNodes];
    });

    const validLinkIDs = Utils.array.unique(linkIDs).filter((linkID) => this.engine.links.has(linkID));

    await this.engine.link.savePointsMany(validLinkIDs);
  }

  translateAllThreads(nodeID: string, movement: Pair<number>): void {
    const node = this.engine.getNodeByID(nodeID);

    if (!node) return;

    this.translateThreads(nodeID, movement);
    this.iterateStepsAndLinkedActions(nodeID, (combinedNodeID) => this.translateThreads(combinedNodeID, movement));
  }

  translateThreads(nodeID: string, movement: Pair<number>): void {
    if (!this.engine.comment.isModeActive && !this.engine.comment.isVisible) return;

    this.engine
      .getThreadIDsByNodeID(nodeID)
      .forEach((threadID) => this.engine.comment.translateThread(threadID, movement));
  }

  translateDetachedThreads(threadIDs: string[], movement: Pair<number>): void {
    if (!this.engine.comment.isModeActive && !this.engine.comment.isVisible) return;

    this.engine.comment.translateDetachedThreads(threadIDs, movement);
  }

  async drag(
    nodeID: string,
    movement: Pair<number>,
    { translateFirst }: { translateFirst?: boolean } = {}
  ): Promise<void> {
    if (this.engine.selection.isOneOfAnyTargets(nodeID)) {
      const nodeTargets = this.engine.selection.getTargets(EntityType.NODE);
      const threadTargets = this.engine.selection.getTargets(EntityType.THREAD);

      if (translateFirst) {
        this.translate(nodeTargets, movement);
        this.translateDetachedThreads(threadTargets, movement);

        await this.engine.drag.setGroup(nodeTargets);
      } else {
        await this.engine.drag.setGroup(nodeTargets);

        this.translate(nodeTargets, movement);
        this.translateDetachedThreads(threadTargets, movement);
      }
    } else if (this.engine.transformation.isActive && !this.engine.focus.isTarget(nodeID)) {
      this.engine.focus.reset();
    } else {
      if (!this.engine.selection.isTarget(EntityType.NODE, nodeID)) {
        this.engine.selection.reset();
      }

      if (translateFirst) {
        this.translate([nodeID], movement);

        await this.engine.drag.setTarget(nodeID);
      } else {
        await this.engine.drag.setTarget(nodeID);

        this.translate([nodeID], movement);
      }

      this.engine.merge.updateCandidates();
    }
  }

  async drop(): Promise<void> {
    this.engine.saveActiveLocations();

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
    this.iterateStepsAndLinkedActions(parentNodeID, (nodeID) => this.redrawLinks(nodeID));
  }

  redrawThreads(nodeID: string): void {
    const threadIDs = this.engine.getThreadIDsByNodeID(nodeID);

    this.engine.comment.forceRedrawThreads(threadIDs);
  }

  redrawNestedThreads(parentNodeID: Nullish<string>): void {
    if (!parentNodeID) return;

    this.redrawThreads(parentNodeID);
    this.iterateStepsAndLinkedActions(parentNodeID, (nodeID) => this.redrawThreads(nodeID));
  }

  getAllLinkedOutActionsNodeIDs(nodeIDs: string[]): Set<string> {
    const allPortIDs = nodeIDs
      .flatMap((nodeID) => [nodeID, ...(this.engine.getNodeByID(nodeID)?.combinedNodes ?? [])])
      .flatMap((nodeID) =>
        Realtime.Utils.port.flattenOutPorts(this.select(CreatorV2.portsByNodeIDSelector, { id: nodeID }))
      );

    const linkedOutActionsNodeIDs = new Set<string>();

    allPortIDs.forEach((portID) => {
      const linkedNode = this.select(CreatorV2.targetNodeByPortID, { id: portID });

      if (linkedNode?.type === Realtime.BlockType.ACTIONS) {
        linkedOutActionsNodeIDs.add(linkedNode.id);
      }
    });

    return linkedOutActionsNodeIDs;
  }

  async updateManyBlocksColor(nodeIDs: string[], color: string): Promise<void> {
    await this.updateManyData(nodeIDs.map((nodeID) => ({ nodeID, patch: { blockColor: color } })));
  }

  private getActionNodesToRemove(lastStepID: string): Array<{ stepID?: string; parentNodeID: string }> {
    const lastStep = this.engine.getNodeByID(lastStepID);

    if (lastStep?.type === Realtime.BlockType.CARDV2 || lastStep?.type === Realtime.BlockType.CAROUSEL) return [];

    const actionNodes = Array.from(this.getAllLinkedOutActionsNodeIDs(lastStepID ? [lastStepID] : []));

    return actionNodes.flatMap((nodeID) => [
      { parentNodeID: nodeID },
      ...this.engine.getStepIDsByParentNodeID(nodeID).map((stepID) => ({ parentNodeID: nodeID, stepID })),
    ]);
  }

  private isRemovingLocked(nodeIDs: string[], remove: (nodeIDs: string[]) => Promise<void>): boolean {
    const lockedNodes = this.select(DiagramV2.activeDiagramDeletionLockedNodesSelector);
    const combinedNodes = nodeIDs
      .map(this.engine.getNodeByID)
      .filter((node): node is Realtime.Node => node?.type === BlockType.COMBINED);

    const unRemovableCombinedNodeIDs = new Set(
      combinedNodes
        .filter((node) => node.combinedNodes.some((nestedNodeID) => !!lockedNodes[nestedNodeID]))
        .map((node) => node.id)
    );

    const [lockedNodeIDs, unlockedNodesIDs] = _partition(
      nodeIDs,
      (id) => !!lockedNodes[id] || unRemovableCombinedNodeIDs.has(id)
    );

    if (lockedNodeIDs.length) {
      // eslint-disable-next-line no-nested-ternary
      const text = unlockedNodesIDs.length
        ? 'Some blocks are'
        : nodeIDs.length > 1
          ? 'These blocks are'
          : 'This block is';

      ModalsV2.openConfirm({
        body: `${text} being actively working on and cannot be deleted`,

        header: 'Locked Blocks',

        cancelButtonText: unlockedNodesIDs.length ? 'Cancel' : null,

        confirmButtonText: unlockedNodesIDs.length ? 'Delete' : 'OK',

        confirm: async () => {
          if (!unlockedNodesIDs.length) return;

          await remove(unlockedNodesIDs);
        },
      });

      return true;
    }
    return false;
  }

  private isRemovingDefaultCommand(nodes: Realtime.Node[]): boolean {
    const commandNodes = nodes.filter(Realtime.Utils.node.isCommandNode);
    const commandNodesIDs = commandNodes.map(({ id }) => id);
    const commandNodeData = commandNodesIDs.map((nodeID) =>
      this.engine.getDataByNodeID<Realtime.NodeData.Command>(nodeID)
    );
    // if the deleted node is not a help intent or a stop intent
    const deletingStopIntent = commandNodeData.some((data) => data?.intent === AlexaConstants.AmazonIntent.STOP);
    const deletingHelpIntent = commandNodeData.some((data) => data?.intent === AlexaConstants.AmazonIntent.HELP);

    if ((deletingStopIntent || deletingHelpIntent) && this.engine.isRootDiagram()) {
      const homeBlockCombinedNodesIDs = this.engine.getNodeByID(commandNodes[0].parentNode)?.combinedNodes ?? [];
      const remainedCommandsData = homeBlockCombinedNodesIDs
        .filter((el) => !commandNodesIDs.includes(el))
        .map((nodeID) => this.engine.getDataByNodeID<Realtime.NodeData.Command>(nodeID));

      // logic: user deleting stop intent and there are no more stop intent left
      const missingStopIntent =
        remainedCommandsData.every((data) => data?.intent !== AlexaConstants.AmazonIntent.STOP) && deletingStopIntent;
      const missingHelpIntent =
        remainedCommandsData.every((data) => data?.intent !== AlexaConstants.AmazonIntent.HELP) && deletingHelpIntent;
      const requiredCommand =
        (missingStopIntent && AlexaConstants.AmazonIntent.STOP) ||
        (missingHelpIntent && AlexaConstants.AmazonIntent.HELP);

      if (requiredCommand) {
        ModalsV2.openConfirm({
          header: 'Required Commands',

          body: `${requiredCommand} is required by default`,

          confirm: Utils.functional.noop,

          cancelButtonText: null,

          confirmButtonText: 'OK',
        });

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
        const parentNodeID = this.select(CreatorV2.parentNodeIDByStepIDSelector, { id: nodeID });
        if (!parentNodeID || nodeIDs.includes(parentNodeID)) return [];

        const stepIDs = this.select(CreatorV2.stepIDsByParentNodeIDSelector, { id: parentNodeID });
        if (stepIDs.every((stepID) => nodeIDs.includes(stepID))) return [parentNodeID];

        return [];
      }),

      // remove all children from any blocks being removed
      ...nodeIDs.flatMap((nodeID) => this.select(CreatorV2.stepIDsByParentNodeIDSelector, { id: nodeID })),

      ...this.getAllLinkedOutActionsNodeIDs(nodeIDs),
    ]);
  }

  private async validateRemove(nodeIDs: string[], remove: (nodeIDs: string[]) => Promise<void>): Promise<void> {
    const removableNodes = this.engine
      .select(CreatorV2.nodesByIDsSelector, { ids: nodeIDs })
      .filter((node) => node.type !== BlockType.START);
    const removableNodeIDs = removableNodes.map(({ id }) => id);

    if (this.isRemovingDefaultCommand(removableNodes) || this.isRemovingLocked(removableNodeIDs, remove)) return;

    await remove(removableNodeIDs);
  }
}

export default NodeManager;
