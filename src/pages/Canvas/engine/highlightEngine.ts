import { EngineConsumer } from './utils';

export enum HighlightTarget {
  LINK = 'link',
  PORT = 'PORT',
}

class HighlightEngine extends EngineConsumer {
  log = this.engine.log.child('highlight');

  target: string | null = null;

  type: HighlightTarget | null = null;

  isTarget(id: string) {
    return this.target === id;
  }

  isLinkTarget(linkID: string) {
    return this.type === HighlightTarget.LINK && this.isTarget(linkID);
  }

  isPortTarget(portID: string) {
    if (!this.target) return false;

    if (this.type === HighlightTarget.PORT) {
      return this.isTarget(portID);
    }

    const linkIDs = this.engine.getLinkIDsByPortID(portID);

    return linkIDs.some((linkID) => this.isTarget(linkID));
  }

  isNodeTarget(nodeID: string) {
    if (!this.target) return false;

    const link = this.engine.getLinkByID(this.target!);

    if (!link) {
      return false;
    }

    return link.target.nodeID === nodeID;
  }

  setLinkTarget(linkID: string) {
    if (this.engine.isCanvasBusy) return;

    this.log.debug(this.log.pending('setting highlighted link'), this.log.slug(linkID));

    this.target = linkID;
    this.type = HighlightTarget.LINK;
    this.engine.link.redrawLinked(linkID);

    this.log.debug(this.log.success('set highlighted link'), this.log.slug(linkID));
  }

  setPortTarget(portID: string) {
    this.log.debug(this.log.pending('setting highlighted port'), this.log.slug(portID));

    this.target = portID;
    this.type = HighlightTarget.PORT;
    this.engine.port.redraw(portID);

    this.log.debug(this.log.success('set highlighted port'), this.log.slug(portID));
  }

  reset() {
    if (!this.target) return;

    const { target } = this;
    const { type } = this;

    this.log.debug(this.log.pending(`resetting ${type} highlight`), this.log.slug(target));

    this.target = null;
    this.type = null;

    switch (type) {
      case HighlightTarget.LINK:
        this.engine.link.redrawLinked(target);
        break;
      case HighlightTarget.PORT:
        this.engine.port.redraw(target);
        break;
      default:
    }

    this.log.debug(this.log.reset(`reset ${type} highlight`), this.log.slug(target));
  }
}

export default HighlightEngine;
