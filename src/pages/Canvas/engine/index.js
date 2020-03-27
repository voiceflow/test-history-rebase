import moize from 'moize';
import React from 'react';
import { useSelector, useStore } from 'react-redux';

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

  /* eslint-disable compat/compat */
  nodes = new Map();

  ports = new Map();

  links = new Map();
  /* eslint-enable compat/compat */

  canvas = null;

  supportedLinks = [];

  get services() {
    return [this.drag, this.activation, this.focus, this.selection, this.clipboard, this.diagram, this.merge, this.link, this.port, this.node];
  }

  constructor(store, mousePosition, realtimeSubscription) {
    this.store = store;
    this.mousePosition = mousePosition;
    this.linkIDs = Creator.allLinkIDsSelector(store.getState());

    // do not change these to property declarations, they depend on this.store being set
    this.realtime = new RealtimeEngine(realtimeSubscription, this);
    this.dispatcher = new Dispatcher(this);
  }

  // store accessors

  select = (selector) => selector(this.store.getState());

  getNodeByID = (nodeID) => this.select(Creator.nodeByIDSelector)(nodeID);

  getDataByNodeID = (nodeID) => this.select(Creator.dataByNodeIDSelector)(nodeID);

  isNodeMovementLocked = (nodeID) => this.select(Realtime.isNodeMovementLockedSelector)(nodeID);

  getDeleteLockedNodes = () => this.select(Realtime.deletionLockedNodesSelector);

  getLinkByID = (linkID) => this.select(Creator.linkByIDSelector)(linkID);

  getPortByID = (portID) => this.select(Creator.portByIDSelector)(portID);

  hasLinksByPortID = (portID) => this.select(Creator.hasLinksByPortIDSelector)(portID);

  getLinkIDsByPortID = (portID) => this.select(Creator.linkIDsByPortIDSelector)(portID);

  getLinkIDsByNodeID = (nodeID) => this.select(Creator.linkIDsByNodeIDSelector)(nodeID);

  getRootNodeIDs = () => this.select(Creator.rootNodeIDsSelector);

  isRootNode = (nodeID) => this.select(Creator.isRootNodeSelector)(nodeID);

  getDiagramByID = (diagramID) => this.select(Diagram.diagramByIDSelector)(diagramID);

  isRootDiagram = () => this.select(Skill.isRootDiagramSelector);

  isFeatureEnabled = (featureID) => this.select(Feature.isFeatureEnabledSelector)(featureID);

  // entity registration methods

  registerCanvas(canvas) {
    this.canvas = canvas;
  }

  registerNode({ id, x, y, type }, api) {
    this.nodes.set(id, { x, y, api, type });
  }

  expireNode(nodeID, api) {
    if (this.nodes.has(nodeID) && this.nodes.get(nodeID).api === api) {
      this.nodes.delete(nodeID);
    }
  }

  registerPort(portID, api) {
    this.ports.set(portID, { api });

    this.addSupportedLinks(portID);
  }

  expirePort(portID, api) {
    if (this.ports.has(portID) && this.ports.get(portID).api === api) {
      this.ports.delete(portID);
    }
  }

  registerLink(linkID, api) {
    this.links.set(linkID, { api });
  }

  expireLink(linkID) {
    this.links.delete(linkID);
  }

  // canvas orchestration methods

  /**
   * check if node has any links which are not ready to render yet
   *
   * @param {Node} node
   * @returns {boolean}
   */
  hasMissingLinks(node) {
    return this.getLinkIDsByNodeID(node.id).some((linkID) => !this.supportedLinks.includes(linkID));
  }

  /**
   * render all missing links for the port with the given ID
   *
   * @param {string} portID
   * @returns {void}
   */
  addSupportedLinks(portID) {
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
   *
   * @param {number} x
   * @param {number} y
   * @param {number} zoom
   * @returns {void}
   */
  updateViewport(x, y, zoom) {
    this.store.dispatch(Creator.updateViewport({ x, y, zoom }));
  }

  async dragNode(nodeID, movement) {
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

      // eslint-disable-next-line jest/no-disabled-tests
      const mergeTarget = this.merge.predicates.find(({ test }) => test(this.mousePosition.current));
      if (mergeTarget) {
        this.merge.prepare(mergeTarget.id);
      } else {
        this.merge.cancel();
      }
    }
  }

  dropNode() {
    this.saveActiveLocations();

    this.merge.confirm();
    this.saveHistory();
    this.drag.reset();
  }

  async transitionNested(nodeID, [x, y]) {
    // TODO: position is always the top-middle of the block, it should be center of mass
    // the -20 is a hard coded value meant to make it feel a little more natural
    await this.node.unmerge(nodeID, [x, y - 20]);
    this.selection.replace([nodeID]);
    this.node.api(nodeID)?.forceDrag?.();
  }

  /**
   * check to see if a node is active
   *
   * @param {string} nodeID
   * @returns {boolean}
   */
  isActive(nodeID) {
    return this.focus.isTarget(nodeID) || this.selection.isTarget(nodeID);
  }

  /**
   * check to see if a node or its parent parent is active
   *
   * @param {string} nodeID
   * @returns {boolean}
   */
  isBranchActive(nodeID) {
    const node = this.getNodeByID(nodeID);

    return !!node.parentNode && this.isActive(node.parentNode);
  }

  /**
   * check to see if any of the nested nodes are active
   *
   * @param {string} parentNodeID
   * @returns {boolean}
   */
  isNestedNodeActive(parentNodeID) {
    const { combinedNodes } = this.getNodeByID(parentNodeID);

    return combinedNodes.some((combinedNodeId) => this.isActive(combinedNodeId));
  }

  saveActiveLocations() {
    if (this.selection.hasTargets) {
      this.selection.getTargets().forEach((nodeID) => this.node.saveLocation(nodeID));
    }
    if (this.drag.hasTarget) {
      this.node.saveLocation(this.drag.target);
    }
  }

  setActivation(nodeID, isSelection) {
    if (isSelection) {
      this.selection.toggle(nodeID);
    } else {
      this.focus.set(nodeID);
    }
  }

  /**
   * remove any selected or focused nodes
   *
   * @returns {void}
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
   *
   * @param {string} nodeID
   * @returns {void}
   */
  copyActive(nodeID) {
    if (nodeID) {
      this.clipboard.copy([nodeID]);
    } else if (this.activation.hasTargets) {
      this.clipboard.copy(this.activation.getTargets());
    }
  }

  /**
   * attempt to convert text and copy canvas entities
   *
   * @param {string} pastedText
   * @param {[number, number]} mousePosition
   * @returns {void}
   */
  paste(pastedText, mousePosition) {
    this.clearActivation();
    this.clipboard.paste(pastedText, mousePosition);
    this.saveHistory();
  }

  /**
   * clear all active nodes
   *
   * @returns {void}
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

  React.useEffect(() => () => engine.reset(), [currentDiagramID]);

  useTeardown(() => engine.teardown());

  return engine;
}

export default useEngine;
