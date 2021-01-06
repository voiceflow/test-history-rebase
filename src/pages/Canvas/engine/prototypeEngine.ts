import * as Prototype from '@/ducks/prototype';
import { CANVAS_PROTOTYPE_RUNNING_CLASSNAME } from '@/pages/Canvas/constants';
import { diff } from '@/utils/array';
import { noop } from '@/utils/functional';

import { EngineConsumer } from './utils';

class PrototypeEngine extends EngineConsumer {
  log = this.engine.log.child('prototype');

  highlightedNodeIDs: string[] = [];

  highlightedLinkIDs: string[] = [];

  teardownSubscription = noop;

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
    this.engine.addClass(CANVAS_PROTOTYPE_RUNNING_CLASSNAME);
    this.dispatch(Prototype.startPrototype(diagramID, nodeID));
    this.teardownSubscription = this.engine.store.subscribe(() => this.redrawHighlighted());

    this.log.info(this.log.success('prototype initialized'));
  }

  redrawHighlighted() {
    const highlightedNodeIDs = this.select(Prototype.activePathBlockIDsSelector);
    const highlightedLinkIDs = this.select(Prototype.activePathLinkIDsSelector);

    const nodeDiff = diff(this.highlightedNodeIDs, highlightedNodeIDs);
    const linkDiff = diff(this.highlightedLinkIDs, highlightedLinkIDs);

    this.highlightedNodeIDs = highlightedNodeIDs;
    this.highlightedLinkIDs = highlightedLinkIDs;

    nodeDiff.forEach((id) => this.engine.node.redraw(id));
    linkDiff.forEach((id) => {
      const link = this.engine.getLinkByID(id);

      this.engine.link.redraw(id);
      if (link) {
        this.engine.link.redrawPorts(link);
      }
    });
  }

  reset() {
    const nodeIDs = this.highlightedNodeIDs;
    const linkIDs = this.highlightedLinkIDs;

    this.log.debug(this.log.pending('resetting prototype'));
    this.teardownSubscription();
    this.teardownSubscription = noop;
    this.highlightedNodeIDs = [];
    this.highlightedLinkIDs = [];

    this.dispatch(Prototype.resetPrototype());
    this.engine.activation.reset();
    this.engine.removeClass(CANVAS_PROTOTYPE_RUNNING_CLASSNAME);
    nodeIDs.forEach((nodeID) => this.engine.node.redraw(nodeID));
    linkIDs.forEach((linkID) => this.engine.link.redraw(linkID));

    this.log.info(this.log.reset('reset prototype'));
  }
}

export default PrototypeEngine;
