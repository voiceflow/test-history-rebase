import { logger } from '@voiceflow/ui';
import EventEmitter from 'eventemitter3';
import moize from 'moize';
import React from 'react';
import { useSelector, useStore } from 'react-redux';

import { CanvasAPI } from '@/components/Canvas';
import { MovementCalculator } from '@/components/Canvas/types';
import { isDebug } from '@/config';
import { FeatureFlag } from '@/config/features';
import { BlockType } from '@/constants';
import { MousePositionContext } from '@/contexts';
import * as Creator from '@/ducks/creator';
import * as Diagram from '@/ducks/diagram';
import * as Feature from '@/ducks/feature';
import * as Project from '@/ducks/project';
import * as Realtime from '@/ducks/realtime';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Thread from '@/ducks/thread';
import * as Version from '@/ducks/version';
import { RealtimeSubscriptionContext, RealtimeSubscriptionValue } from '@/gates/RealtimeLoadingGate/contexts';
import { useMouseMove } from '@/hooks';
import { NodeData } from '@/models';
import { CanvasAction } from '@/pages/Canvas/constants';
import { CanvasContainerAPI } from '@/pages/Canvas/types';
import { Selector, Store } from '@/store/types';
import { Pair, Point } from '@/types';
import { Coords } from '@/utils/geometry';

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

export class Engine extends ComponentManager<{ container: CanvasContainerAPI }> {
  log = logger.child('engine');

  emitter = new EventEmitter<string>();

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

  select = <T extends Selector<any>>(selector: T): ReturnType<T> => selector(this.store.getState());

  getNodeByID = (nodeID: string) => this.select(Creator.nodeByIDSelector)(nodeID);

  getDataByNodeID = <T>(nodeID: string): NodeData<T> => this.select(Creator.dataByNodeIDSelector)(nodeID);

  isNodeMovementLocked = (nodeID: string) => this.select(Realtime.isNodeMovementLockedSelector)(nodeID);

  isNodeFocused = () => this.select(Creator.hasFocusedNode);

  getLockOwner = (nodeID: string) => this.select(Realtime.editLockOwnerSelector)(nodeID);

  getDeleteLockedNodes = () => this.select(Realtime.deletionLockedNodesSelector);

  getLinkByID = (linkID: string) => this.select(Creator.linkByIDSelector)(linkID);

  getPortByID = (portID: string) => this.select(Creator.portByIDSelector)(portID);

  hasLinksByPortID = (portID: string) => this.select(Creator.hasLinksByPortIDSelector)(portID);

  hasLinksByNodeID = (nodeID: string) => this.select(Creator.hasLinksByNodeIDSelector)(nodeID);

  getThreadIDsByNodeID = (nodeID: string) => this.select(Thread.threadIDsByNodeIDSelector)(nodeID);

  getLinkIDsByPortID = (portID: string) => this.select(Creator.linkIDsByPortIDSelector)(portID);

  getLinkIDsByNodeID = (nodeID: string) => this.select(Creator.linkIDsByNodeIDSelector)(nodeID);

  getRootNodeIDs = () => this.select(Creator.rootNodeIDsSelector);

  isRootNode = (nodeID: string) => this.select(Creator.isRootNodeSelector)(nodeID);

  getDiagramByID = (diagramID: string) => this.select(Diagram.diagramByIDSelector)(diagramID);

  isRootDiagram = () => this.select(Version.isRootDiagramActiveSelector);

  getDiagramID = () => this.select(Session.activeDiagramIDSelector);

  isFeatureEnabled = (featureID: FeatureFlag) => this.select(Feature.isFeatureEnabledSelector)(featureID);

  isStraightLinks = () => this.select(Project.isStraightLinksSelector);

  // entity registration methods

  registerCanvas(canvas: CanvasAPI | null) {
    this.canvas = canvas;

    if (canvas) {
      this.emitter.emit(CanvasAction.RENDERED);
    }
    this.log.debug(this.log.init(canvas ? 'registered' : 'expired'), this.log.value('<Canvas>'));
  }

  registerNode(nodeID: string, api: NodeEntity) {
    const { id, x, y, type } = this.getNodeByID(nodeID);

    this.nodes.set(id, { x, y, api, type });
  }

  expireNode(nodeID: string, instanceID: string) {
    expireInstance(this.nodes, nodeID, instanceID);
  }

  registerPort(portID: string, api: PortEntity) {
    this.ports.set(portID, { api });

    this.addSupportedLinks(portID);
  }

  expirePort(portID: string, instanceID: string) {
    expireInstance(this.ports, portID, instanceID);
  }

  registerLink(linkID: string, api: LinkEntity) {
    this.links.set(linkID, { api });
  }

  expireLink(linkID: string, instanceID: string) {
    expireInstance(this.links, linkID, instanceID);
  }

  registerThread(threadID: string, api: ThreadEntity) {
    this.threads.set(threadID, { api });
  }

  expireThread(threadID: string, instanceID: string) {
    expireInstance(this.threads, threadID, instanceID);
  }

  registerPortLinkInstance(linkID: string, api: PortLinkInstance) {
    this.portLinkInstances.set(linkID, { api });
  }

  expirePortLinkInstance(linkID: string) {
    this.portLinkInstances.delete(linkID);
  }

  // canvas orchestration methods

  disableAllModes() {
    return this.store.dispatch(Router.goToCurrentCanvas());
  }

  get isCanvasBusy() {
    return this.linkCreation.isDrawing || this.groupSelection.isDrawing || this.drag.hasTarget || this.drag.hasGroup;
  }

  addClass(className: string) {
    this.components.container?.addClass(className);
    this.log.debug(this.log.init('added class'), this.log.value(className));
  }

  removeClass(className: string) {
    this.components.container?.removeClass(className);
    this.log.debug(this.log.reset('removed class'), this.log.value(className));
  }

  showCanvas() {
    this.store.dispatch(Creator.showCanvas());
  }

  hideCanvas() {
    this.store.dispatch(Creator.hideCanvas());
  }

  /**
   * render all missing links for the port with the given ID
   */
  addSupportedLinks(portID: string) {
    const links = this.getLinkIDsByPortID(portID)
      .filter((linkID) => !this.supportedLinks.includes(linkID))
      .map(this.getLinkByID)
      .filter((link) => this.ports.has(link.source.portID) && this.ports.has(link.target.portID));

    if (links.length) {
      this.supportedLinks.push(...links.map((link) => link.id));
    }
  }

  /**
   * update the store entry for the viewport
   */
  updateViewport(x: number, y: number, zoom: number) {
    this.emitter.emit(CanvasAction.IDLE);
    this.store.dispatch(Creator.updateViewport({ x, y, zoom }));
    this.comment.generateCandidates();
  }

  panViewport(movement: Pair<number>) {
    this.emitter.emit(CanvasAction.PAN, movement);
    this.realtime.panViewport(movement);
  }

  zoomViewport(calculateMovement: MovementCalculator) {
    this.emitter.emit(CanvasAction.ZOOM, calculateMovement);
    this.realtime.zoomViewport(calculateMovement);
  }

  saveActiveLocations() {
    if (this.selection.hasTargets) {
      this.selection.getTargets().forEach((nodeID) => this.node.saveLocation(nodeID));
    }

    if (this.drag.hasTarget) {
      this.node.saveLocation(this.drag.target!);
    }
  }

  setActive(nodeID: string, isSelection?: boolean) {
    if (isSelection) {
      this.selection.toggle(nodeID);
    } else {
      this.focus.set(nodeID);
    }
  }

  /**
   * clear activation state of all nodes
   */
  clearActivation() {
    this.saveActiveLocations();

    this.focus.reset();
    this.selection.reset();
    this.transformation.reset();
  }

  /**
   * remove any selected or focused nodes
   */
  async removeActive() {
    if (this.activation.hasTargets) {
      // keep reference to targets before clearing
      const activeTargets = this.activation.getTargets();

      this.clearActivation();
      await this.node.removeMany(activeTargets);
    }
  }

  /**
   * copy the active nodes to the clipboard
   */
  copyActive(nodeID?: string) {
    if (nodeID) {
      this.clipboard.copy([nodeID]);
    } else if (this.activation.hasTargets) {
      this.clipboard.copy(this.activation.getTargets());
    }
  }

  /**
   * attempt to convert text and copy canvas entities
   */
  paste(pastedText: string, coords: Coords) {
    this.clearActivation();
    this.clipboard.paste(pastedText, coords);
    this.saveHistory();
  }

  focusHome() {
    const startNode = Array.from(this.nodes.entries()).find(([, { type }]) => type === BlockType.START);

    if (startNode) {
      const [nodeID] = startNode;

      this.node.center(nodeID, !this.comment.isActive);
      this.selection.replace([nodeID]);
      this.comment.forceRedrawThreads();
      this.log.info(this.log.success('focused on the home block'));
    }
  }

  centerHome(): void {
    const startNode = Array.from(this.nodes.entries()).find(([, { type }]) => type === BlockType.START);

    if (startNode) {
      const [nodeID] = startNode;

      this.node.center(nodeID, !this.comment.isActive);
      this.comment.forceRedrawThreads();
      this.log.info(this.log.success('centered on the home block'));
    }
  }

  saveHistory() {
    this.store.dispatch(Creator.saveHistory());
    this.log.debug(this.log.success('history saved'));
  }

  getCanvasMousePosition() {
    return this.canvas!.transformPoint(this.mousePosition.current!);
  }

  getMouseCoords() {
    return new Coords(this.mousePosition.current!);
  }

  center([centerX, centerY]: Point, animate = true) {
    const xOffset = window.innerWidth / 2;
    const yOffset = window.innerHeight / 2;

    const canvasAPI = this.canvas!;
    const nextPosition: Point = [(xOffset - centerX) * 0.8, (yOffset - centerY - 100) * 0.8];

    if (animate) {
      canvasAPI.applyTransition();
    }
    canvasAPI.setZoom(80);
    canvasAPI.setPosition(nextPosition);
  }

  async reset() {
    this.log.debug(this.log.pending('resetting engine'));

    await Promise.all(this.services.map((service) => service.reset()));

    this.log.info(this.log.reset('reset engine'));
  }

  async teardown() {
    this.log.debug(this.log.pending('shutting down engine'));

    await this.reset();
    await Promise.all(this.services.map((service) => service.teardown()));
    window.vf_engine = null;

    this.log.info(this.log.reset('engine shut down'));
  }
}

const createEngine = moize.simple((...args: ConstructorParameters<typeof Engine>) => new Engine(...args));

function useEngine() {
  const store = useStore();
  const diagramID = useSelector(Creator.creatorDiagramIDSelector);
  const mousePosition = React.useContext(MousePositionContext);
  const realtimeSubscription = React.useContext(RealtimeSubscriptionContext);
  const engine = React.useMemo(() => createEngine(store as any, mousePosition!, realtimeSubscription), []);

  useMouseMove((event) => engine.emitter.emit(CanvasAction.MOVE_MOUSE, new Coords([event.clientX, event.clientY])), []);

  React.useEffect(
    () => () => {
      engine.reset();
      createEngine.clear();
    },
    [diagramID]
  );

  return engine;
}

export default useEngine;
