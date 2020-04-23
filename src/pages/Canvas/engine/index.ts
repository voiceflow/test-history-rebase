import moize from 'moize';
import React from 'react';
import { useSelector, useStore } from 'react-redux';

import { RealtimeSubscription } from '@/client/socket/types';
import { CanvasAPI } from '@/components/Canvas/types';
import { FeatureFlag } from '@/config/features';
import { BlockType } from '@/constants';
import { MousePositionContext } from '@/contexts';
import * as Creator from '@/ducks/creator';
import * as Diagram from '@/ducks/diagram';
import * as Feature from '@/ducks/feature';
import * as Realtime from '@/ducks/realtime';
import * as Skill from '@/ducks/skill';
import * as User from '@/ducks/user';
import { RealtimeSubscriptionContext } from '@/gates/RealtimeLoadingGate/contexts';
import { useTeardown } from '@/hooks';
import { Node, NodeData } from '@/models';
import { AnyNodeAPI, LinkAPI, PortAPI } from '@/pages/Canvas/types';
import { Selector, Store } from '@/store/types';
import { Pair, Point } from '@/types';

import ActivationEngine from './activationEngine';
import ClipboardEngine from './clipboardEngine';
import DiagramEngine from './diagramEngine';
import Dispatcher from './dispatcher';
import DragEngine from './dragEngine';
import FocusEngine from './focusEngine';
import LinkCreationEngine from './linkCreationEngine';
import LinkManager from './linkManager';
import MergeEngine from './mergeEngine';
import NodeManager from './nodeManager';
import PortManager from './portManager';
import RealtimeEngine from './realtimeEngine';
import SelectionEngine from './selectionEngine';

export class Engine {
  drag = new DragEngine(this);

  activation = new ActivationEngine(this);

  focus = new FocusEngine(this);

  selection = new SelectionEngine(this);

  linkCreation = new LinkCreationEngine(this);

  clipboard = new ClipboardEngine(this);

  diagram = new DiagramEngine(this);

  merge = new MergeEngine(this);

  link = new LinkManager(this);

  port = new PortManager(this);

  node = new NodeManager(this);

  nodes = new Map<string, { type: BlockType; x: number; y: number; api: AnyNodeAPI }>();

  ports = new Map<string, { api: PortAPI }>();

  links = new Map<string, { api: LinkAPI }>();

  supportedLinks: string[] = [];

  canvas: CanvasAPI | null = null;

  realtime: RealtimeEngine;

  dispatcher: Dispatcher;

  linkIDs: string[];

  get services() {
    return [this.drag, this.activation, this.focus, this.selection, this.clipboard, this.diagram, this.merge, this.link, this.port, this.node];
  }

  constructor(public store: Store, public mousePosition: React.RefObject<Point>, realtimeSubscription: RealtimeSubscription) {
    this.linkIDs = Creator.allLinkIDsSelector(store.getState());

    // do not change these to property declarations, they depend on this.store being set
    this.realtime = new RealtimeEngine(realtimeSubscription, this);
    this.dispatcher = new Dispatcher(this);
  }

  // store accessors

  select = <T extends Selector<any>>(selector: T): ReturnType<T> => selector(this.store.getState());

  getNodeByID = (nodeID: string) => this.select(Creator.nodeByIDSelector)(nodeID);

  getDataByNodeID = <T>(nodeID: string): NodeData<T> => this.select(Creator.dataByNodeIDSelector)(nodeID);

  isNodeMovementLocked = (nodeID: string) => this.select(Realtime.isNodeMovementLockedSelector)(nodeID);

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
  }

  registerNode(nodeID: string, api: AnyNodeAPI) {
    const { id, x, y, type } = this.getNodeByID(nodeID);

    this.nodes.set(id, { x, y, api, type });
  }

  expireNode(nodeID: string, instanceID: string) {
    if (this.nodes.has(nodeID) && this.nodes.get(nodeID)!.api.instanceID === instanceID) {
      this.nodes.delete(nodeID);
    }
  }

  registerPort(portID: string, api: PortAPI) {
    this.ports.set(portID, { api });

    this.addSupportedLinks(portID);
  }

  expirePort(portID: string, instanceID: string) {
    if (this.ports.has(portID) && this.ports.get(portID)!.api.instanceID === instanceID) {
      this.ports.delete(portID);
    }
  }

  registerLink(linkID: string, api: LinkAPI) {
    this.links.set(linkID, { api });
  }

  expireLink(linkID: string) {
    this.links.delete(linkID);
  }

  // canvas orchestration methods

  /**
   * check if node has any links which are not ready to render yet
   */
  hasMissingLinks(node: Node) {
    return this.getLinkIDsByNodeID(node.id).some((linkID) => !this.supportedLinks.includes(linkID));
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
    this.store.dispatch(Creator.updateViewport({ x, y, zoom }));
  }

  async dragNode(nodeID: string, movement: Pair<number>) {
    const hasMultipleActivationTargets = this.activation.targets.size > 1;

    if (this.selection.isTarget(nodeID) && hasMultipleActivationTargets) {
      const targets = this.selection.getTargets();

      await this.drag.setGroup(targets);
      await this.node.translateMany(targets, movement);
    } else {
      if (hasMultipleActivationTargets) {
        this.selection.reset();
      }

      await this.drag.set(nodeID);
      await this.node.translate(nodeID, movement);

      this.merge.updateCandidates();
    }
  }

  async dropNode() {
    this.saveActiveLocations();
    this.saveHistory();

    await this.drag.reset();
  }

  async transitionNested(nodeID: string, [x, y]: Point) {
    // TODO: position is always the top-middle of the block, it should be center of mass
    // the -20 is a hard coded value meant to make it feel a little more natural
    await this.node.unmerge(nodeID, [x, y - 20]);
    this.selection.replace([nodeID]);
    this.node.api(nodeID)?.forceDrag?.();
  }

  /**
   * check to see if a node is active
   */
  isActive(nodeID: string) {
    return this.focus.isTarget(nodeID) || this.selection.isTarget(nodeID);
  }

  /**
   * check to see if a node or its parent parent is active

   */
  isBranchActive(nodeID: string) {
    const node = this.getNodeByID(nodeID);

    return this.isActive(node?.parentNode ? node.parentNode : nodeID);
  }

  /**
   * check to see if any of the nested nodes are active
   */
  isNestedNodeActive(parentNodeID: string) {
    const { combinedNodes } = this.getNodeByID(parentNodeID);

    return combinedNodes.some((combinedNodeId) => this.isActive(combinedNodeId));
  }

  saveActiveLocations() {
    if (this.selection.hasTargets) {
      this.selection.getTargets().forEach((nodeID) => this.node.saveLocation(nodeID));
    }
    if (this.drag.hasTarget) {
      this.node.saveLocation(this.drag.target!);
    }
  }

  setActivation(nodeID: string, isSelection?: boolean) {
    if (isSelection) {
      this.selection.toggle(nodeID);
    } else {
      this.focus.set(nodeID);
    }
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
    if (nodeID && this.getNodeByID(nodeID).type === BlockType.COMBINED) {
      this.clipboard.copy([nodeID]);
    } else if (this.activation.hasTargets) {
      this.clipboard.copy(this.activation.getTargets());
    }
  }

  /**
   * attempt to convert text and copy canvas entities
   */
  paste(pastedText: string, mousePosition: Point) {
    this.clearActivation();
    this.clipboard.paste(pastedText, mousePosition);
    this.saveHistory();
  }

  /**
   * clear all active nodes
   */
  clearActivation() {
    this.saveActiveLocations();

    this.focus.reset();
    this.selection.reset();
  }

  focusHome() {
    const startNode = Array.from(this.nodes.entries()).find(([, { type }]) => type === BlockType.START);

    if (startNode) {
      const [nodeID] = startNode;

      this.node.center(nodeID);
      this.selection.replace([nodeID]);
    }
  }

  showMergeWarning() {
    this.store.dispatch(User.setCanvasError('Cannot combine blocks'));
  }

  saveHistory() {
    this.store.dispatch(Creator.saveHistory());
  }

  getCanvasMousePosition() {
    return this.canvas!.transformPoint(this.mousePosition.current!);
  }

  async reset() {
    await Promise.all(this.services.map((service) => service.reset()));
  }

  async teardown() {
    await this.reset();
    await Promise.all(this.services.map((service) => service.teardown()));
  }
}

const createEngine = moize.simple((store, mousePosition, realtimeSubscription) => new Engine(store, mousePosition, realtimeSubscription));

function useEngine() {
  const store = useStore();
  const currentDiagramID = useSelector(Creator.creatorDiagramIDSelector);
  const mousePosition = React.useContext(MousePositionContext);
  const realtimeSubscription = React.useContext(RealtimeSubscriptionContext);
  const engine = React.useMemo(() => createEngine(store, mousePosition, realtimeSubscription), []);

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
