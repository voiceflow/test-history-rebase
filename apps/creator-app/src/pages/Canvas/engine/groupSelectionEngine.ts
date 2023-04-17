import { Utils } from '@voiceflow/common';

import { SelectionMarqueeAPI } from '@/pages/Canvas/types';
import { Point } from '@/types';
import { isRootOrMarkupBlockType } from '@/utils/typeGuards';

import { CANVAS_SELECTING_GROUP_CLASSNAME } from '../constants';
import { EngineConsumer, getCandidates, NodeCandidate } from './utils';

class GroupSelectionEngine extends EngineConsumer<{ selectionMarquee: SelectionMarqueeAPI }> {
  log = this.engine.log.child('group-selection');

  rect: DOMRect | null = null;

  candidates: NodeCandidate[] = [];

  mouseOrigin: [number, number] | null = null;

  get isDrawing() {
    return !!this.mouseOrigin;
  }

  start(origin: Point) {
    this.log.debug(this.log.pending('starting selection'));

    this.rect = new DOMRect(origin[0], origin[1], 0, 0);
    this.engine.addClass(CANVAS_SELECTING_GROUP_CLASSNAME);
    this.mouseOrigin = origin;

    this.candidates = getCandidates(
      [...this.engine.nodes.keys()].filter((nodeID) => this.engine.isNodeOfType(nodeID, isRootOrMarkupBlockType)),
      this.engine
    );

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

    const targets = this.engine.selection.getTargets();
    const nextTargets = this.candidates.filter(({ isWithin }) => isWithin(rect)).map(({ nodeID }) => nodeID);
    const updateTargets = Utils.array.diff(targets, nextTargets);

    this.engine.selection.replace(nextTargets, true);

    updateTargets.forEach((nodeID) => this.engine.node.redraw(nodeID));
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
