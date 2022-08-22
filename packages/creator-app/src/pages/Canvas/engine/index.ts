import { BaseModels } from '@voiceflow/base-types';
import { Nullish, Struct } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { logger } from '@voiceflow/ui';
import EventEmitter from 'eventemitter3';
import React from 'react';

import { CanvasAPI } from '@/components/Canvas';
import { MovementCalculator } from '@/components/Canvas/types';
import { PageProgress } from '@/components/PageProgressBar';
import { isDebug } from '@/config';
import { BlockType, PageProgressBar } from '@/constants';
import * as Creator from '@/ducks/creator';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as Diagram from '@/ducks/diagram';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Feature from '@/ducks/feature';
import * as History from '@/ducks/history';
import * as ProjectV2 from '@/ducks/projectV2';
import * as RealtimeDuck from '@/ducks/realtime';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Thread from '@/ducks/threadV2';
import * as UI from '@/ducks/ui';
import * as Version from '@/ducks/versionV2';
import { RealtimeSubscriptionValue } from '@/gates/RealtimeLoadingGate/contexts';
import { CanvasAction } from '@/pages/Canvas/constants';
import { CanvasContainerAPI } from '@/pages/Canvas/types';
import { DiagramHeartbeatContextValue } from '@/pages/Project/contexts';
import { State, Store } from '@/store/types';
import { Pair, Point } from '@/types';
import { Coords } from '@/utils/geometry';
import { getNodesGroupCenter } from '@/utils/node';

import ActivationEngine from './activationEngine';
import ClipboardEngine from './clipboardEngine';
import CommentEngine from './commentEngine';
import DiagramEngine from './diagramEngine';
import Dispatcher from './dispatcher';
import DragEngine from './dragEngine';
import LinkEntity, { PortLinkInstance } from './entities/linkEntity';
import NodeEntity from './entities/nodeEntity';
import PortEntity from './entities/portEntity';
import ThreadEntity from './entities/threadEntity';
import FocusEngine from './focusEngine';
import GroupSelectionEngine from './groupSelectionEngine';
import HighlightEngine from './highlightEngine';
import IOEngine from './ioEngine';
import LinkCreationEngine from './linkCreationEngine';
import LinkManager from './linkManager';
import MarkupEngine from './markupEngine';
import MergeEngine from './mergeEngine';
import NodeManager from './nodeManager';
import PortManager from './portManager';
import PrototypeEngine from './prototypeEngine';
import RealtimeEngine from './realtimeEngine';
import SelectionEngine from './selectionEngine';
import TransformationEngine from './transformationEngine';
import { ComponentManager } from './utils';

const expireInstance = (entities: Map<string, { api: { instanceID: string } }>, entityID: string, instanceID: string) => {
  if (entities.has(entityID) && entities.get(entityID)!.api.instanceID === instanceID) {
    entities.delete(entityID);
  }
};

declare global {
  interface Window {
    Cypress?: boolean;
    vf_engine?: Engine | null;
    cypress_clipboard?: string | null; // store clipboard data into window to access it in cypress
  }
}

class Engine extends ComponentManager<{ container: CanvasContainerAPI; diagramHeartbeat: DiagramHeartbeatContextValue }> {
  log = logger.child('engine');

  emitter = new EventEmitter<string>();

  io = new IOEngine(this);

  drag = new DragEngine(this);

  activation = new ActivationEngine(this);

  focus = new FocusEngine(this);

  selection = new SelectionEngine(this);

  groupSelection = new GroupSelectionEngine(this);

  highlight = new HighlightEngine(this);

  linkCreation = new LinkCreationEngine(this);

  transformation = new TransformationEngine(this);

  clipboard = new ClipboardEngine(this);

  diagram = new DiagramEngine(this);

  merge = new MergeEngine(this);

  link = new LinkManager(this);

  port = new PortManager(this);

  node = new NodeManager(this);

  markup = new MarkupEngine(this);

  comment = new CommentEngine(this);

  prototype = new PrototypeEngine(this);

  nodes = new Map<string, { api: NodeEntity; type: BlockType; x: number; y: number }>();

  ports = new Map<string, { api: PortEntity }>();

  links = new Map<string, { api: LinkEntity }>();

  threads = new Map<string, { api: ThreadEntity }>();

  portLinkInstances = new Map<string, { api: PortLinkInstance }>();

  supportedLinks: string[] = [];

  canvas: CanvasAPI | null = null;

  realtime: RealtimeEngine;

  dispatcher: Dispatcher;

  get services() {
    return [
      this.drag,
      this.focus,
      this.selection,
      this.groupSelection,
      this.activation,
      this.highlight,
      this.linkCreation,
      this.clipboard,
      this.diagram,
      this.merge,
      this.link,
      this.port,
      this.node,
      this.realtime,
      this.dispatcher,
      this.markup,
      this.transformation,
      this.comment,
    ];
  }

  get context() {
    return {
      workspaceID: this.select(Session.activeWorkspaceIDSelector)!,
      projectID: this.select(Session.activeProjectIDSelector)!,
      versionID: this.select(Session.activeVersionIDSelector)!,
      diagramID: this.getDiagramID()!,
    };
  }

  constructor(public store: Store, public mousePosition: React.RefObject<Point>, realtimeSubscription: RealtimeSubscriptionValue) {
    super();

    if (isDebug()) {
      window.vf_engine = this;
    }

    // do not change these to property declarations, they depend on this.store being set
    this.realtime = new RealtimeEngine(realtimeSubscription, this);
    this.dispatcher = new Dispatcher(this);

    this.log.info(this.log.init('initialized canvas engine'), this.log.value(this.select(Session.activeVersionIDSelector)));
  }

  // store accessors

  select = <T, A extends any[]>(selector: (state: State, ...args: A) => T, ...args: A): T => selector(this.store.getState(), ...args);

  getNodeByID = (nodeID: Nullish<string>) => this.select(CreatorV2.nodeByIDSelector, { id: nodeID });

  getZoomType = () => this.select(UI.zoomTypeSelector);

  getDataByNodeID = <T>(nodeID: string) => this.select(CreatorV2.nodeDataByIDSelector, { id: nodeID }) as Realtime.NodeData<T> | null;

  isNodeMovementLocked = (nodeID: string) => this.select(RealtimeDuck.isNodeMovementLockedSelector)(nodeID);

  getLockOwner = (nodeID: string) => this.select(RealtimeDuck.editLockOwnerSelector)(nodeID);

  isNodeFocused = () => this.select(Creator.hasFocusedNode);

  getLinkByID = (linkID: Nullish<string>) => this.select(CreatorV2.linkByIDSelector, { id: linkID });

  getPortByID = (portID: string) => this.select(CreatorV2.portByIDSelector, { id: portID });

  hasLinksByPortID = (portID: string) => this.select(CreatorV2.hasLinksByPortIDSelector, { id: portID });

  hasLinksByNodeID = (nodeID: string) => this.select(CreatorV2.hasLinksByNodeIDSelector, { id: nodeID });

  getThreadIDsByNodeID = (nodeID: string) => this.select(Thread.threadIDsByNodeIDSelector)(nodeID);

  getLinkIDsByPortID = (portID: Nullish<string>) => this.select(CreatorV2.linkIDsByPortIDSelector, { id: portID });

  getLinkIDsByNodeID = (nodeID: Nullish<string>) => this.select(CreatorV2.linkIDsByNodeIDSelector, { id: nodeID });

  getRootNodeIDs = () => this.select(CreatorV2.blockIDsSelector);

  isRootNode = (nodeID: string) => this.select(CreatorV2.isBlockSelector, { id: nodeID });

  getDiagramByID = (diagramID: string) => this.select(DiagramV2.diagramByIDSelector, { id: diagramID });

  isRootDiagram = () => this.select(CreatorV2.isRootDiagramActiveSelector);

  getDiagramID = () => this.select(CreatorV2.activeDiagramIDSelector);

  isFeatureEnabled = (featureID: Realtime.FeatureFlag) => this.select(Feature.isFeatureEnabledSelector)(featureID);

  isStraightLinks = () => this.select(ProjectV2.active.isStraightLinksSelector);

  currentPathName = () => this.select(Router.pathnameSelector);

  getActivePlatform = () => this.select(ProjectV2.active.platformSelector);

  getActiveProjectMeta = () => this.select(ProjectV2.active.metaSelector);

  getActiveSchemaVersion = () => this.select(Version.active.schemaVersionSelector);

  getTargetNodeByLinkID = (linkID: Nullish<string>) => this.getNodeByID(this.getLinkByID(linkID)?.target.nodeID);

  getSourceNodeByLinkID = (linkID: Nullish<string>) => this.getNodeByID(this.getLinkByID(linkID)?.source.nodeID);

  isNodeOfType = (nodeID: Nullish<string>, types: BlockType | BlockType[] | ((type: BlockType) => boolean)): boolean => {
    const nodeType = this.select(CreatorV2.nodeTypeByIDSelector, { id: nodeID });

    if (!nodeType) return false;

    if (typeof types === 'function') return types(nodeType);

    if (Array.isArray(types)) return types.includes(nodeType);

    return nodeType === types;
  };

  // entity registration methods
  registerCanvas(canvas: CanvasAPI | null): void {
    this.canvas = canvas;

    if (canvas) {
      this.emitter.emit(CanvasAction.RENDERED);
    }

    this.log.debug(this.log.init(canvas ? 'registered' : 'expired'), this.log.value('<Canvas>'));
  }

  registerNode(nodeID: string, api: NodeEntity) {
    const node = this.getNodeByID(nodeID);

    if (!node) {
      return;
    }

    const { id, x, y, type } = node;

    this.nodes.set(id, { x, y, api, type });
  }

  expireNode(nodeID: string, instanceID: string): void {
    expireInstance(this.nodes, nodeID, instanceID);
  }

  registerPort(portID: string, api: PortEntity): void {
    this.ports.set(portID, { api });

    this.addSupportedLinks(portID);
  }

  expirePort(portID: string, instanceID: string): void {
    expireInstance(this.ports, portID, instanceID);
  }

  registerLink(linkID: string, api: LinkEntity): void {
    this.links.set(linkID, { api });
  }

  expireLink(linkID: string, instanceID: string): void {
    expireInstance(this.links, linkID, instanceID);
  }

  registerThread(threadID: string, api: ThreadEntity): void {
    this.threads.set(threadID, { api });
  }

  expireThread(threadID: string, instanceID: string): void {
    expireInstance(this.threads, threadID, instanceID);
  }

  registerPortLinkInstance(linkID: string, api: PortLinkInstance): void {
    this.portLinkInstances.set(linkID, { api });
  }

  expirePortLinkInstance(linkID: string): void {
    this.portLinkInstances.delete(linkID);
  }

  // canvas orchestration methods

  disableAllModes(): Promise<void> {
    this.clearActivation({ skipUrlSync: true });

    return this.store.dispatch(Router.goToCurrentCanvas());
  }

  get isCanvasBusy(): boolean {
    return this.linkCreation.isDrawing || this.groupSelection.isDrawing || this.drag.hasTarget || this.drag.hasGroup;
  }

  addClass(className: string): void {
    this.components.container?.addClass(className);
    this.log.debug(this.log.init('added class'), this.log.value(className));
  }

  removeClass(className: string): void {
    this.components.container?.removeClass(className);
    this.log.debug(this.log.reset('removed class'), this.log.value(className));
  }

  showCanvas(): void {
    this.store.dispatch(Creator.showCanvas());
  }

  hideCanvas(): void {
    this.store.dispatch(Creator.hideCanvas());
  }

  /**
   * render all missing links for the port with the given ID
   */
  addSupportedLinks(portID: string): void {
    const links = this.getLinkIDsByPortID(portID)
      .filter((linkID) => !this.supportedLinks.includes(linkID))
      .map(this.getLinkByID)
      .filter((link): link is Realtime.Link => !!link && this.ports.has(link.source.portID) && this.ports.has(link.target.portID));

    if (links.length) {
      this.supportedLinks.push(...links.map((link) => link.id));
    }
  }

  /**
   * update the store entry for the viewport
   */
  updateViewport(diagramID: string, x: number, y: number, zoom: number): void {
    const action = Realtime.diagram.viewport.crud.update({ key: diagramID, value: { id: diagramID, x, y, zoom } });

    this.emitter.emit(CanvasAction.IDLE);
    this.store.dispatch(action);
    this.comment.generateCandidates();
  }

  panViewport(movement: Pair<number>): void {
    this.emitter.emit(CanvasAction.PAN, movement);
    this.realtime.panViewport(movement);
    this.io.panViewport(movement);
  }

  zoomViewport(calculateMovement: MovementCalculator): void {
    this.emitter.emit(CanvasAction.ZOOM, calculateMovement);
    this.realtime.zoomViewport(calculateMovement);
    this.io.zoomViewport(calculateMovement);
  }

  saveActiveLocations(): void {
    const targets: Nullish<string>[] = [];
    if (this.selection.hasTargets) {
      targets.push(...this.selection.getTargets());
    }
    if (this.drag.hasTarget) {
      targets.push(this.drag.target);
    }
    this.node.saveLocations(targets);
  }

  setActive(
    nodeID: string,
    options?: {
      routeState?: Struct;
      isSelection?: boolean;
      skipURLSync?: boolean;
      nodeSubPath?: string;
    }
  ): void {
    if (options?.isSelection) {
      this.selection.toggle(nodeID);
    } else {
      this.focus.set(nodeID);

      if (!options?.skipURLSync) {
        this.store.dispatch(Router.goToCurrentCanvasNode(nodeID, options?.nodeSubPath, options?.routeState));
      }
    }
  }

  /**
   * clear activation state of all nodes
   */
  clearActivation({ skipUrlSync, skipSaveLocations }: { skipUrlSync?: boolean; skipSaveLocations?: boolean } = {}): void {
    if (!skipSaveLocations) {
      this.saveActiveLocations();
    }

    const hasFocusTarget = this.focus.hasTarget;

    this.focus.reset();
    this.selection.reset();
    this.transformation.reset();

    if (!skipUrlSync && hasFocusTarget) {
      this.store.dispatch(Router.goToCurrentCanvas());
    }
  }

  private getNextAvailableSibling(targetNodeID: string): string | null {
    const node = this.getNodeByID(targetNodeID);

    const parentNodeData = this.getNodeByID(node?.parentNode);
    if (!parentNodeData) return null;

    const { combinedNodes } = parentNodeData;
    const targetIndex = combinedNodes.findIndex((id) => id === targetNodeID);

    // Try the next sibling first, if that doesnt exist, try the previous
    return combinedNodes[targetIndex + 1] ?? combinedNodes[targetIndex - 1] ?? null;
  }

  /**
   * remove any selected or focused nodes
   */
  async removeActive({ focusNextChild }: { focusNextChild?: boolean } = { focusNextChild: true }): Promise<void> {
    const actionRouteMatch = this.select(Router.actionsMatchSelector);

    if (actionRouteMatch?.params.actionNodeID) {
      const focusedNodeID = this.focus.getTarget();

      if (focusedNodeID) {
        this.setActive(focusedNodeID);
      } else {
        this.clearActivation({ skipSaveLocations: true });
      }

      await this.node.removeMany([actionRouteMatch.params.actionNodeID]);
    } else if (this.activation.hasTargets) {
      // keep reference to targets before clearing
      const activeTargets = this.activation.getTargets();
      const isSingleTarget = activeTargets.length === 1;
      const siblingID = isSingleTarget && focusNextChild ? this.getNextAvailableSibling(activeTargets[0]) : null;

      if (siblingID && focusNextChild) {
        this.setActive(siblingID);
      } else {
        this.clearActivation({ skipSaveLocations: true });
      }

      await this.node.removeMany(activeTargets);
    }
  }

  /**
   * copy the active nodes to the clipboard
   */
  copyActive(nodeID?: string | null, options?: { disableSuccessToast?: boolean }): void {
    if (nodeID) {
      const nodeIDs = [nodeID, ...this.node.getAllLinkedOutActionsNodeIDs([nodeID])];

      this.clipboard.copy(nodeIDs, options);
    } else if (this.activation.hasTargets) {
      const targets = this.activation.getTargets();
      const nodeIDs = [...targets, ...this.node.getAllLinkedOutActionsNodeIDs(targets)];

      this.clipboard.copy(nodeIDs, options);
    }
  }

  /**
   * attempt to convert text and copy canvas entities
   */
  paste(pastedText: string, coords: Coords): void {
    this.clearActivation();
    this.clipboard.paste(pastedText, coords);
  }

  getHomeNodeID(): string | null {
    const startNode = Array.from(this.nodes.entries()).find(([, { type }]) => type === BlockType.START);

    return startNode?.[0] ?? null;
  }

  focusStart(options: { open?: boolean; skipURLSync?: boolean } = {}): void {
    const diagram = this.select(DiagramV2.active.diagramSelector);
    const isRootDiagramActive = this.select(CreatorV2.isRootDiagramActiveSelector);

    // topics do not have start node, focus first intent step
    if (!isRootDiagramActive && diagram?.type === BaseModels.Diagram.DiagramType.TOPIC) {
      const intentStepID = diagram.intentStepIDs[0];

      if (intentStepID) {
        this.focusNode(intentStepID, options);
      }
    } else {
      const nodeID = this.getHomeNodeID();

      if (nodeID) {
        this.focusNode(nodeID, options);
      }
    }
  }

  focusNode(nodeID: string, { open, skipURLSync }: { open?: boolean; skipURLSync?: boolean } = {}): void {
    this.node.center(nodeID, !this.comment.isModeActive);
    this.setActive(nodeID, { isSelection: !open, skipURLSync });
    this.comment.forceRedrawThreads();
    this.log.info(this.log.success(`focused on the ${nodeID} node`));
  }

  centerHome(): void {
    const nodeID = this.getHomeNodeID();

    if (nodeID) {
      this.centerNode(nodeID);
    }
  }

  centerNode(nodeID: string): void {
    this.node.center(nodeID, !this.comment.isModeActive);
    this.comment.forceRedrawThreads();
    this.log.info(this.log.success(`centered on the ${nodeID} node`));
  }

  focusDiagramNode(diagramID: string | null, nodeID: string) {
    if (!diagramID || this.getDiagramID() === diagramID) {
      this.focusNode(nodeID, { open: true });
    } else {
      this.store.dispatch(Router.goToDiagram(diagramID, nodeID));
    }
  }

  getCanvasMousePosition(): Point {
    if (!this.canvas || !this.mousePosition.current) return [0, 0];

    return this.canvas.transformPoint(this.mousePosition.current);
  }

  getMouseCoords(): Coords {
    return new Coords(this.mousePosition.current!);
  }

  center([centerX, centerY]: Point, animate = true): void {
    const xOffset = window.innerWidth / 2;
    const yOffset = window.innerHeight / 2;

    const canvasAPI = this.canvas!;
    const nextPosition: Point = [(xOffset - centerX) * 0.8, (yOffset - centerY - 100) * 0.8];

    if (animate) {
      canvasAPI.applyTransition();
    }

    canvasAPI.setZoom(80, { raf: animate });
    canvasAPI.setPosition(nextPosition, { raf: animate });
  }

  async createComponent(): Promise<string> {
    PageProgress.start(PageProgressBar.COMPONENT_CREATING);

    const targets = this.activation.getTargets();
    const nodeIDs = [...targets, ...this.node.getAllLinkedOutActionsNodeIDs(targets)];

    const clipboardData = this.clipboard.getClipboardContext(nodeIDs);

    const { center } = getNodesGroupCenter(
      clipboardData.nodes.map((node) => ({ data: clipboardData.data[node.id], node })),
      clipboardData.links
    );

    const coords = this.canvas!.toCoords(center);

    const { name, diagramID, incomingLinkSource, outgoingLinkTarget } = await this.store.dispatch(Diagram.convertToComponent(clipboardData));

    await this.store.dispatch(
      History.transaction(async () => {
        // TODO: would be good if we could have the removal of these targets
        // and link creation as part of the component creation operation
        // probably by creating its own explicit action on the realtime service
        await this.node.removeMany(targets);

        const componentNodeID = await this.node.add(BlockType.COMPONENT, coords, { name, diagramID });

        const componentNode = this.getNodeByID(componentNodeID);

        if (componentNode) {
          await Promise.all([
            incomingLinkSource && this.link.add(incomingLinkSource.portID, componentNode.ports.in[0]),
            outgoingLinkTarget && this.link.add(componentNode.ports.out.builtIn[BaseModels.PortType.NEXT]!, outgoingLinkTarget.portID),
          ]);
        }

        PageProgress.stop(PageProgressBar.COMPONENT_CREATING);
      })
    );

    return diagramID;
  }

  async reset(): Promise<void> {
    this.log.debug(this.log.pending('resetting engine'));

    await Promise.all(this.services.map((service) => service.reset()));

    this.log.info(this.log.reset('reset engine'));
  }

  async teardown(): Promise<void> {
    this.log.debug(this.log.pending('shutting down engine'));

    await this.reset();
    await Promise.all(this.services.map((service) => service.teardown()));
    window.vf_engine = null;

    this.log.info(this.log.reset('engine shut down'));
  }
}

export default Engine;
