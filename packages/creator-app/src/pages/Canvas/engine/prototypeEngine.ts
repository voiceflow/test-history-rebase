import { Utils } from '@voiceflow/common';
import { matchPath } from 'react-router';

import { Path } from '@/config/routes';
import * as Prototype from '@/ducks/prototype';

import { EngineConsumer } from './utils';

class PrototypeEngine extends EngineConsumer {
  finalNodeID: string | null = null;

  log = this.engine.log.child('prototype');

  highlightedNodeIDs = new Set<string>();

  highlightedLinkIDs = new Set<string>();

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
    return this.highlightedNodeIDs.has(nodeID);
  }

  /**
   * check to see if the link is highlighted
   */
  isLinkHighlighted(linkID: string) {
    return this.highlightedLinkIDs.has(linkID);
  }

  /**
   * check to see if the port is highlighted
   */
  isPortHighlighted(portID: string) {
    const linkIDs = this.engine.getLinkIDsByPortID(portID);

    return !!linkIDs.length && this.highlightedLinkIDs.has(linkIDs[0]);
  }

  subscribe() {
    this.reset();
    this.teardownSubscription = this.engine.store.subscribe(() => this.redrawHighlighted());
  }

  redrawHighlighted() {
    const diagramID = this.engine.getDiagramID();
    const { blockIDs, linkIDs } = this.select(Prototype.activePathByDiagramIDSelector)(diagramID!);

    blockIDs.forEach((nodeID) => {
      if (this.highlightedNodeIDs.has(nodeID)) return;

      this.highlightedNodeIDs.add(nodeID);
      this.engine.node.redraw(nodeID);
    });

    linkIDs.forEach((linkID) => {
      if (this.highlightedLinkIDs.has(linkID)) return;
      this.highlightedLinkIDs.add(linkID);
      this.engine.link.redrawLinked(linkID);
    }, []);
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
    const nodeIDs = [...this.highlightedNodeIDs];
    const linkIDs = [...this.highlightedLinkIDs];

    this.highlightedNodeIDs.clear();
    this.highlightedLinkIDs.clear();
    this.setFinalNodeID(null);
    this.teardownSubscription();
    this.teardownSubscription = Utils.functional.noop;

    nodeIDs.forEach((id) => this.engine.node.redraw(id));
    linkIDs.forEach((id) => this.engine.link.redrawLinked(id));
  }

  teardown() {
    this.teardownSubscription();
  }
}

export default PrototypeEngine;
