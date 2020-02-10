import React from 'react';

import { withCanvas } from '@/components/Canvas/contexts';
import * as Realtime from '@/ducks/realtime';
import { connect } from '@/hocs';
import LinkPath from '@/pages/Canvas/components/Link/components/LinkPath';
import { buildPath } from '@/pages/Canvas/components/Link/utils';
import { withEngine, withLinkCreation } from '@/pages/Canvas/contexts';
import { compose } from '@/utils/functional';
import MouseMovement from '@/utils/mouseMovement';

const extractPoints = (canvas, { right, top, height }, [mouseX, mouseY]) => {
  const startPoint = [right, top + height / 2];
  const endPoint = [mouseX, mouseY];

  return [canvas.transformPoint(startPoint), canvas.transformPoint(endPoint, true)];
};

class NewLink extends React.PureComponent {
  linkRef = React.createRef();

  points = null;

  mouseMovement = new MouseMovement();

  onMouseMove = (event) => {
    this.mouseMovement.track(event);

    const [movementX, movementY] = this.mouseMovement.getMovement();

    const zoom = this.props.canvas.getZoom();
    const [start, [endX, endY]] = this.points;

    const nextPoints = [start, [endX + movementX / zoom, endY + movementY / zoom]];
    this.points = nextPoints;
    this.props.moveLink({ points: this.points });
    const linkEl = this.linkRef.current;

    // eslint-disable-next-line compat/compat
    window.requestAnimationFrame(() => linkEl.setAttribute('d', buildPath(nextPoints)));
  };

  onMouseUp = () => {
    this.removeEventListeners();
    this.props.moveLink({ reset: true });

    if (!this.props.linkCreation.completing) {
      this.props.linkCreation.onAbort();
    }
  };

  removeEventListeners() {
    this.mouseMovement.clear();

    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mousemove', this.onMouseMove);
  }

  componentWillUnmount() {
    this.removeEventListeners();
  }

  render() {
    const { canvas, engine, linkCreation } = this.props;

    // NOTE: extra protection against linkCreation being falsy needed for HMR
    if (!linkCreation?.isDrawing) {
      this.points = null;
      return null;
    }

    if (this.points === null) {
      this.points = extractPoints(canvas, engine.port.getRect(linkCreation.sourcePortID), linkCreation.mouseOrigin);
      this.props.moveLink({ points: this.points });
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    }

    const path = buildPath(this.points);

    return <LinkPath d={path} markerEnd="url(#head)" ref={this.linkRef} />;
  }
}

const mapDispatchToProps = {
  moveLink: (movement) => Realtime.sendRealtimeVolatileUpdate(Realtime.moveLink(movement)),
};

export default compose(
  withCanvas,
  withLinkCreation,
  withEngine,
  connect(
    null,
    mapDispatchToProps
  )
)(NewLink);
