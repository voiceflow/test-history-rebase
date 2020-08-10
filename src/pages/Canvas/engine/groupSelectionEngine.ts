import { MARKUP_NODES, ROOT_NODES } from '@/constants';
import { SelectionMarqueeAPI } from '@/pages/Canvas/types';
import { Point } from '@/types';
import { findUnion } from '@/utils/array';
import { buildVirtualDOMRect } from '@/utils/dom';

import { CANVAS_SELECTING_GROUP_CLASSNAME } from '../constants';
import { EngineConsumer, NodeCandidate, getCandidates } from './utils';

class GroupSelectionEngine extends EngineConsumer<{ selectionMarquee: SelectionMarqueeAPI }> {
  log = this.engine.log.child('group-selection');

  candidates: NodeCandidate[] = [];

  mouseOrigin: [number, number] | null = null;

  get isDrawing() {
    return !!this.mouseOrigin;
  }

  start(origin: Point) {
    this.log.debug(this.log.pending('starting selection'));

    this.engine.addClass(CANVAS_SELECTING_GROUP_CLASSNAME);
    this.mouseOrigin = origin;
    this.candidates = getCandidates(
      Array.from(this.engine.nodes.keys()).filter((nodeID) => {
        const node = this.engine.getNodeByID(nodeID);
        if (this.engine.markup.isActive) {
          return MARKUP_NODES.includes(node.type);
        }
        return ROOT_NODES.includes(node.type);
      }),
      this.engine
    );

    this.components.selectionMarquee?.show();

    this.log.debug('discoverd selection candidates', this.log.value(this.candidates.length));
    this.log.debug(this.log.init('started selection'));
  }

  updateCandidates([mouseX, mouseY]: Point) {
    const [originX, originY] = this.mouseOrigin!;
    const rect = buildVirtualDOMRect(
      [Math.min(originX, mouseX), Math.min(originY, mouseY)],
      [Math.abs(mouseX - originX), Math.abs(mouseY - originY)]
    );

    this.log.debug(this.log.pending('updating candidates'));

    const targets = this.engine.selection.getTargets();
    const nextTargets = this.candidates.filter(({ isWithin }) => isWithin(rect)).map(({ nodeID }) => nodeID);
    const { lhsOnly: oldTargets, rhsOnly: newTargets } = findUnion(targets, nextTargets);

    this.engine.selection.replace(nextTargets, true);

    [...oldTargets, ...newTargets].forEach((nodeID) => this.engine.node.redraw(nodeID));
  }

  complete() {
    this.log.debug(this.log.pending('completing selection'));

    this.reset();

    this.log.debug(this.log.success('completed selection'));
  }

  reset() {
    this.log.debug(this.log.pending('resetting group selection'));

    this.engine.removeClass(CANVAS_SELECTING_GROUP_CLASSNAME);

    this.mouseOrigin = null;
    this.candidates = [];

    this.log.debug(this.log.reset('reset group selection'));
  }
}

export default GroupSelectionEngine;
