import React from 'react';
import { withProps } from 'recompose';

import { withCanvas } from '@/components/Canvas/contexts';
import { withEngine, withTestingMode } from '@/containers/CanvasV2/contexts';
import { compose } from '@/utils/functional';

import { Overlay, Path, RemoveButton } from './components';
import { buildCenter, buildPath, extractPoints } from './utils';

export class Link extends React.PureComponent {
  state = {
    isHovering: false,
  };

  points = null;

  containerRef = React.createRef();

  pathRef = React.createRef();

  hiddenPathRef = React.createRef();

  api = {
    translatePoint: ([moveX, moveY], isSource) => {
      const [[startX, startY], [endX, endY]] = this.points;

      const nextPoints = isSource ? [[startX + moveX, startY + moveY], [endX, endY]] : [[startX, startY], [endX + moveX, endY + moveY]];
      // eslint-disable-next-line react/no-direct-mutation-state
      this.points = nextPoints;

      this.drawFromPoints(nextPoints);
    },

    redraw: () => {
      const { canvas } = this.props;

      if (!this.hasPort('source') || !this.hasPort('target')) {
        return;
      }

      const nextPoints = extractPoints(canvas, this.getPortRect('source'), this.getPortRect('target'));

      if (nextPoints) {
        this.points = nextPoints;

        if (this.containerRef.current) {
          this.drawFromPoints(nextPoints);
        } else {
          // force initial render
          this.forceUpdate();
        }
      }
    },
  };

  get isDraggingNode() {
    return this.props.engine.drag.hasTarget;
  }

  hasPort(relationship) {
    return this.props.engine.ports.has(this.props.link[relationship].portID);
  }

  getPortRect(relationship) {
    return this.props.engine.port.getRect(this.props.link[relationship].portID);
  }

  drawFromPoints(nextPoints) {
    const pathEl = this.pathRef.current;
    const hiddenPathEl = this.hiddenPathRef.current;

    // eslint-disable-next-line compat/compat
    window.requestAnimationFrame(() => {
      const nextPath = buildPath(nextPoints);

      pathEl.setAttribute('d', nextPath);
      hiddenPathEl.setAttribute('d', nextPath);
    });
  }

  onMouseEnter = () => !this.isDraggingNode && this.setState({ isHovering: true });

  onMouseLeave = (event) => {
    if (this.state.isHovering && (!this.containerRef.current || !this.containerRef.current.contains(event.relatedTarget))) {
      this.setState({ isHovering: false });
    }
  };

  onRemove = () => this.props.engine.link.remove(this.props.link.id);

  componentDidMount() {
    this.props.engine.registerLink(this.props.link, this.api);
  }

  componentWillUnmount() {
    this.props.engine.expireLink(this.props.link);
  }

  render() {
    const { isTesting } = this.props;
    const { isHovering } = this.state;

    if (!this.hasPort('source') || !this.hasPort('target')) {
      return null;
    }

    if (!this.points) {
      this.points = extractPoints(this.props.canvas, this.getPortRect('source'), this.getPortRect('target'));
    }

    const path = buildPath(this.points);
    const [centerX, centerY] = buildCenter(this.points);

    return (
      <g ref={this.containerRef}>
        {/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */}
        <Overlay d={path} isHovering={isHovering} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} ref={this.hiddenPathRef} />
        <Path d={path} markerEnd="url(#head)" isHovering={isHovering} ref={this.pathRef} />
        {/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */}
        {!isTesting && <RemoveButton x={centerX} y={centerY} isHovering={isHovering} onMouseLeave={this.onMouseLeave} onClick={this.onRemove} />}
      </g>
    );
  }
}

export default compose(
  withEngine,
  withCanvas,
  withTestingMode,
  withProps(({ linkID, engine }) => ({
    link: engine.getLinkByID(linkID),
  }))
)(Link);
