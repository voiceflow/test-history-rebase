import { Utils } from '@voiceflow/common';
import { matchPath } from 'react-router';

import { Path } from '@/config/routes';
import * as Prototype from '@/ducks/prototype';

import { EngineConsumer } from './utils';

class PrototypeEngine extends EngineConsumer {
  finalNodeID: string | null = null;

  log = this.engine.log.child('prototype');

  highlightedNodeIDs: string[] = [];

  highlightedLinkIDs: string[] = [];

  teardownSubscription = Utils.functional.noop;

  get isActive() {
    const currentPath = this.engine.currentPathName();
    const match = matchPath(currentPath, { path: Path.PROJECT_PROTOTYPE });

    return !!match;
  }

  /**
   * check to see if the node is highlighted
   */
  isNodeHighlightedLink(nodeID: string) {
    return this.highlightedNodeIDs.includes(nodeID);
  }

  /**
   * check to see if the link is highlighted
   */
  isLinkHighlighted(linkID: string) {
    return this.highlightedLinkIDs.includes(linkID);
  }

  /**
   * check to see if the port is highlighted
   */
  isPortHighlighted(portID: string) {
    const linkIDs = this.engine.getLinkIDsByPortID(portID);

    return !!linkIDs.length && this.highlightedLinkIDs.includes(linkIDs[0]);
  }

  start(diagramID?: string | null, nodeID?: string | null) {
    this.log.debug(this.log.pending('initializing prototype'));
    this.dispatch(Prototype.startPrototype(diagramID, nodeID));
    this.teardownSubscription = this.engine.store.subscribe(() => this.redrawHighlighted());

    this.log.info(this.log.success('prototype initialized'));
  }

  redrawHighlighted() {
    const highlightedNodeIDs = this.select(Prototype.activePathBlockIDsSelector);
    const highlightedLinkIDs = this.select(Prototype.activePathLinkIDsSelector);

    const nodeDiff = Utils.array.diff(this.highlightedNodeIDs, highlightedNodeIDs);
    const linkDiff = Utils.array.diff(this.highlightedLinkIDs, highlightedLinkIDs);

    this.highlightedNodeIDs = highlightedNodeIDs;
    this.highlightedLinkIDs = highlightedLinkIDs;

    nodeDiff.forEach((id) => this.engine.node.redraw(id));
    linkDiff.forEach((id) => this.engine.link.redrawLinked(id));
  }

  setFinalNodeID(nodeID: string | null) {
    const previousFinalNodeID = this.finalNodeID;
    this.finalNodeID = nodeID;

    if (previousFinalNodeID) {
      this.engine.node.redrawPorts(previousFinalNodeID);
    }
    if (nodeID) {
      this.engine.node.redrawPorts(nodeID);
    }
  }

  reset() {
    const nodeIDs = this.highlightedNodeIDs;
    const linkIDs = this.highlightedLinkIDs;

    this.log.debug(this.log.pending('resetting prototype'));
    this.teardownSubscription();
    this.teardownSubscription = Utils.functional.noop;
    this.setFinalNodeID(null);
    this.highlightedNodeIDs = [];
    this.highlightedLinkIDs = [];

    this.dispatch(Prototype.resetPrototype());
    nodeIDs.forEach((id) => this.engine.node.redraw(id));
    linkIDs.forEach((id) => this.engine.link.redrawLinked(id));

    this.log.info(this.log.reset('reset prototype'));
  }
}

export default PrototypeEngine;
