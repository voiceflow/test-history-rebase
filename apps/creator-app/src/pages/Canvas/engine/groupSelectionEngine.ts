import { Utils } from '@voiceflow/common';

import { SelectionMarqueeAPI } from '@/pages/Canvas/types';
import { Point } from '@/types';
import { isRootOrMarkupBlockType } from '@/utils/typeGuards';

import { CANVAS_SELECTING_GROUP_CLASSNAME } from '../constants';
import { EntityType } from './constants';
import { EngineConsumer, getNodeCandidates, getThreadCandidates, NodeCandidate, ThreadCandidate } from './utils';

class GroupSelectionEngine extends EngineConsumer<{ selectionMarquee: SelectionMarqueeAPI }> {
  log = this.engine.log.child('group-selection');

  rect: DOMRect | null = null;

  candidates: Array<ThreadCandidate | NodeCandidate> = [];

  mouseOrigin: [number, number] | null = null;

  get isDrawing() {
    return !!this.mouseOrigin;
  }

  start(origin: Point) {
    this.log.debug(this.log.pending('starting selection'));

    this.rect = new DOMRect(origin[0], origin[1], 0, 0);
    this.engine.addClass(CANVAS_SELECTING_GROUP_CLASSNAME);
    this.mouseOrigin = origin;

    this.candidates = getNodeCandidates(
      [...this.engine.nodes.keys()].filter((nodeID) => this.engine.isNodeOfType(nodeID, isRootOrMarkupBlockType)),
      this.engine
    );

    if (this.engine.comment.isModeActive || this.engine.comment.isVisible) {
      this.candidates = [...this.candidates, ...getThreadCandidates([...this.engine.threads.keys()], this.engine)];
    }

    this.components.selectionMarquee?.show();

    this.log.debug('discoverd selection candidates', this.log.value(this.candidates.length));
    this.log.debug(this.log.init('started selection'));
  }

  updateCandidates([mouseX, mouseY]: Point) {
    const { rect, mouseOrigin } = this;
    if (!mouseOrigin || !rect) return;

    const [originX, originY] = mouseOrigin;

    rect.x = Math.min(originX, mouseX);
    rect.y = Math.min(originY, mouseY);
    rect.width = Math.abs(mouseX - originX);
    rect.height = Math.abs(mouseY - originY);

    this.log.debug(this.log.pending('updating candidates'));

    const nextCandidates = this.candidates.filter(({ isWithin }) => isWithin(rect));

    const nodeTargets = this.engine.selection.getTargets(EntityType.NODE);
    const nextNodeTargets = nextCandidates.filter((target): target is NodeCandidate => 'nodeID' in target).map(({ nodeID }) => nodeID);
    const updateNodeTargets = Utils.array.diff(nodeTargets, nextNodeTargets);

    this.engine.selection.replaceNode(nextNodeTargets, true);
    updateNodeTargets.forEach((nodeID) => this.engine.node.redraw(nodeID));

    if (this.engine.comment.isModeActive || this.engine.comment.isVisible) {
      const threadTargets = this.engine.selection.getTargets(EntityType.THREAD);
      const nextThreadTargets = nextCandidates.filter((target): target is ThreadCandidate => 'threadID' in target).map(({ threadID }) => threadID);
      const updateThreadTargets = Utils.array.diff(threadTargets, nextThreadTargets);

      this.engine.activation.replace(EntityType.THREAD, nextThreadTargets);
      updateThreadTargets.forEach((threadID) => this.engine.comment.redrawThread(threadID));
    }
  }

  complete() {
    this.log.debug(this.log.pending('completing selection'));

    this.reset();

    this.log.debug(this.log.success('completed selection'));
  }

  reset() {
    this.log.debug(this.log.pending('resetting group selection'));

    this.engine.removeClass(CANVAS_SELECTING_GROUP_CLASSNAME);

    this.rect = null;
    this.mouseOrigin = null;
    this.candidates = [];

    this.log.debug(this.log.reset('reset group selection'));
  }
}

export default GroupSelectionEngine;
