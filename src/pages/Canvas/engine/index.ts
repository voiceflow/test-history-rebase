import EventEmitter from 'eventemitter3';
import moize from 'moize';
import React from 'react';
import { useSelector, useStore } from 'react-redux';

import { CanvasAPI } from '@/components/Canvas';
import { MovementCalculator } from '@/components/Canvas/types';
import { FeatureFlag } from '@/config/features';
import { BlockType, COPY_NODES, MARKUP_NODES } from '@/constants';
import { MousePositionContext } from '@/contexts';
import * as Creator from '@/ducks/creator';
import * as Diagram from '@/ducks/diagram';
import * as Feature from '@/ducks/feature';
import * as Realtime from '@/ducks/realtime';
import * as Skill from '@/ducks/skill';
import { RealtimeSubscriptionContext } from '@/gates/RealtimeLoadingGate/contexts';
import RealtimeSubscription from '@/gates/RealtimeLoadingGate/subscription';
import { useMouseMove, useTeardown } from '@/hooks';
import { NodeData } from '@/models';
import { CanvasAction } from '@/pages/Canvas/constants';
import { Selector, Store } from '@/store/types';
import { Pair, Point } from '@/types';
import { Coords } from '@/utils/geometry';
import logger from '@/utils/logger';

import ActivationEngine from './activationEngine';
import ClipboardEngine from './clipboardEngine';
import CommentEngine from './commentEngine';
import DiagramEngine from './diagramEngine';
import Dispatcher from './dispatcher';
import DragEngine from './dragEngine';
import LinkEntity from './entities/linkEntity';
import NodeEntity from './entities/nodeEntity';
import PortEntity from './entities/portEntity';
import FocusEngine from './focusEngine';
import GroupSelectionEngine from './groupSelectionEngine';
import HighlightEngine from './highlightEngine';
import LinkCreationEngine from './linkCreationEngine';
import LinkManager from './linkManager';
import MarkupEngine from './markupEngine';
import MergeEngine from './mergeEngine';
import NodeManager from './nodeManager';
import PortManager from './portManager';
import RealtimeEngine from './realtimeEngine';
import SelectionEngine from './selectionEngine';
import TransformationEngine from './transformationEngine';

const expireInstance = (entities: Map<string, { api: { instanceID: string } }>, entityID: string, instanceID: string) => {
  if (entities.has(entityID) && entities.get(entityID)!.api.instanceID === instanceID) {
    entities.delete(entityID);
  }
};

export class Engine {
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

  nodes = new Map<string, { api: NodeEntity; type: BlockType; x: number; y: number }>();

  ports = new Map<string, { api: PortEntity }>();

  links = new Map<string, { api: LinkEntity }>();

  supportedLinks: string[] = [];

  canvas: CanvasAPI | null = null;

  realtime: RealtimeEngine;

  dispatcher: Dispatcher;

  get services() {
    return [
      this.drag,
      this.activation,
      this.focus,
      this.selection,
      this.groupSelection,
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
    ];
  }

  constructor(public store: Store, public mousePosition: React.RefObject<Point>, realtimeSubscription: RealtimeSubscription) {
    // do not change these to property declarations, they depend on this.store being set
    this.realtime = new RealtimeEngine(realtimeSubscription, this);
    this.dispatcher = new Dispatcher(this);

    this.log.info(this.log.init('initialized canvas engine'), this.log.value(this.select(Skill.activeSkillIDSelector)));
  }

  // store accessors

  select = <T extends Selector<any>>(selector: T): ReturnType<T> => selector(this.store.getState());

  getNodeByID = (nodeID: string) => this.select(Creator.nodeByIDSelector)(nodeID);

  getDataByNodeID = <T>(nodeID: string): NodeData<T> => this.select(Creator.dataByNodeIDSelector)(nodeID);

  isNodeMovementLocked = (nodeID: string) => this.select(Realtime.isNodeMovementLockedSelector)(nodeID);

  getLockOwner = (nodeID: string) => this.select(Realtime.editLockOwnerSelector)(nodeID);

  getDeleteLockedNodes = () => this.select(Realtime.deletionLockedNodesSelector);

  getLinkByID = (linkID: string) => this.select(Creator.linkByIDSelector)(linkID);

  getPortByID = (portID: string) => this.select(Creator.portByIDSelector)(portID);

  hasLinksByPortID = (portID: string) => this.select(Creator.hasLinksByPortIDSelector)(portID);

  hasLinksByNodeID = (portID: string) => this.select(Creator.hasLinksByNodeIDSelector)(portID);

  getLinkIDsByPortID = (portID: string) => this.select(Creator.linkIDsByPortIDSelector)(portID);

  getLinkIDsByNodeID = (nodeID: string) => this.select(Creator.linkIDsByNodeIDSelector)(nodeID);

  getRootNodeIDs = () => this.select(Creator.rootNodeIDsSelector);

  isRootNode = (nodeID: string) => this.select(Creator.isRootNodeSelector)(nodeID);

  getDiagramByID = (diagramID: string) => this.select(Diagram.diagramByIDSelector)(diagramID);

  isRootDiagram = (): boolean => this.select(Skill.isRootDiagramSelector);

  isFeatureEnabled = (featureID: FeatureFlag) => this.select(Feature.isFeatureEnabledSelector)(featureID);

  // entity registration methods

  registerCanvas(canvas: CanvasAPI | null) {
    this.canvas = canvas;

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

  // canvas orchestration methods

  get isCanvasBusy() {
    return this.linkCreation.isDrawing || this.groupSelection.isDrawing || this.drag.hasTarget;
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
    const node = this.getNodeByID(nodeID);

    if (isSelection && !MARKUP_NODES.includes(node.type)) {
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
    if (nodeID && COPY_NODES.includes(this.getNodeByID(nodeID).type)) {
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

      this.node.center(nodeID);
      this.selection.replace([nodeID]);
      this.log.info(this.log.success('focused on the home block'));
    }
  }

  saveHistory() {
    this.store.dispatch(Creator.saveHistory());
    this.log.debug(this.log.success('history saved'));
  }

  getCanvasMousePosition() {
    return this.canvas!.transformPoint(this.mousePosition.current!);
  }

  getMousePoint() {
    return new Coords(this.mousePosition.current!);
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

    this.log.info(this.log.reset('engine shut down'));
  }
}

const createEngine = moize.simple((store, mousePosition, realtimeSubscription) => new Engine(store, mousePosition, realtimeSubscription));

function useEngine() {
  const store = useStore();
  const currentDiagramID = useSelector(Creator.creatorDiagramIDSelector);
  const mousePosition = React.useContext(MousePositionContext);
  const realtimeSubscription = React.useContext(RealtimeSubscriptionContext);
  const engine = React.useMemo(() => createEngine(store, mousePosition, realtimeSubscription), []);

  useMouseMove((event) => engine.emitter.emit(CanvasAction.MOVE_MOUSE, new Coords([event.clientX, event.clientY])), []);

  React.useEffect(
    () => () => {
      engine.reset();
    },
    [currentDiagramID]
  );

  useTeardown(() => engine.teardown());

  return engine;
}

export default useEngine;
