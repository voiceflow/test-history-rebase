import moize from 'moize';
import React from 'react';
import { useStore } from 'react-redux';

import { BlockType } from '@/constants';
import { MousePositionContext } from '@/contexts';
import * as Creator from '@/ducks/creator';
import { diagramByIDSelector } from '@/ducks/diagram';
import { activePlatformSelector, isRootDiagramSelector } from '@/ducks/skill';
import { setCanvasError } from '@/ducks/user';
import { useEnableDisable } from '@/hooks';

import ActivationEngine from './activationEngine';
import ClipboardEngine from './clipboardEngine';
import Dispatcher from './dispatcher';
import DragEngine from './dragEngine';
import FocusEngine from './focusEngine';
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

  clipboard = new ClipboardEngine(this);

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

  constructor(store, finalize, mousePosition) {
    this.store = store;
    this.finalize = finalize;
    this.mousePosition = mousePosition;
    this.linkIDs = Creator.allLinkIDsSelector(store.getState());

    // do not change these to property declarations, they depend on this.store being set
    this.realtime = new RealtimeEngine(this);
    this.dispatcher = new Dispatcher(this);
  }

  // store accessors

  getNodeByID = (nodeID) => Creator.nodeByIDSelector(this.store.getState())(nodeID);

  getDataByNodeID = (nodeID) => Creator.dataByNodeIDSelector(this.store.getState())(nodeID);

  getLinkByID = (linkID) => Creator.linkByIDSelector(this.store.getState())(linkID);

  getPortByID = (portID) => Creator.portByIDSelector(this.store.getState())(portID);

  hasLinksByPortID = (portID) => Creator.hasLinksByPortIDSelector(this.store.getState())(portID);

  getLinkIDsByPortID = (portID) => Creator.linkIDsByPortIDSelector(this.store.getState())(portID);

  getLinkIDsByNodeID = (nodeID) => Creator.linkIDsByNodeIDSelector(this.store.getState())(nodeID);

  getRootNodeIDs = () => Creator.rootNodeIDsSelector(this.store.getState());

  getDiagramByID = (diagramID) => diagramByIDSelector(this.store.getState())(diagramID);

  isRootDiagram = () => isRootDiagramSelector(this.store.getState());

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

      const platform = activePlatformSelector(this.store.getState());
      if (
        this.supportedLinks.length ===
        this.linkIDs
          .map(this.getLinkByID)
          .filter(Boolean)
          .filter((link) => {
            const port = this.getPortByID(link.source.portID);

            return !port.platform || port.platform === platform;
          }).length
      ) {
        this.finalize();
      }
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

  dragNode(nodeID, movement) {
    const hasMultipleActivationTargets = this.activation.targets.size > 1;

    if (this.selection.isTarget(nodeID) && hasMultipleActivationTargets) {
      this.node.translateMany(this.selection.getTargets(), movement);
    } else {
      if (hasMultipleActivationTargets) {
        this.selection.clear();
      }

      this.drag.set(nodeID);

      this.node.translate(nodeID, movement);

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
    this.drag.clear();
  }

  transitionNested(nodeID, [x, y]) {
    // TODO: position is always the top-middle of the block, it should be center of mass
    // the -20 is a hard coded value meant to make it feel a little more natural
    this.node.unmerge(nodeID, [x, y - 20]);
    this.selection.replace([nodeID]);
    this.node.api(nodeID)?.forceDrag();
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
  removeActive() {
    if (this.activation.hasTargets) {
      // keep reference to targets before clearing
      const activeTargets = this.activation.getTargets();

      this.clearActivation();
      this.node.removeMany(activeTargets);
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
  }

  /**
   * clear all active nodes
   *
   * @returns {void}
   */
  clearActivation() {
    this.saveActiveLocations();

    this.focus.clear();
    this.selection.clear();
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
    this.store.dispatch(setCanvasError('Cannot combine blocks'));
  }

  teardown() {
    this.focus.clear();
    this.selection.clear();
    this.drag.clear();
    this.merge.clear();
    this.dispatcher.teardown();
    this.realtime.teardown();
    this.links.clear();
    this.ports.clear();
    this.nodes.clear();
  }
}

const createEngine = moize.simple((store, finalize, mousePosition) => new Engine(store, finalize, mousePosition));

function useEngine() {
  const store = useStore();
  const state = store.getState();
  const linkIDs = Creator.allLinkIDsSelector(state);
  const [isFinalized, finalize] = useEnableDisable(linkIDs.length === 0);
  const mousePosition = React.useContext(MousePositionContext);
  const engine = React.useMemo(() => createEngine(store, finalize, mousePosition));

  React.useEffect(() => () => engine.teardown(), []);

  return {
    engine,
    isFinalized,
  };
}

export default useEngine;
