import React from 'react';

import { withCanvas } from '@/components/Canvas/contexts';
import { withEditPermission, withEngine, withLink, withPlatform } from '@/containers/CanvasV2/contexts';
import { compose } from '@/utils/functional';

import { Overlay, Path, RemoveButton } from './components';
import { withLinkLifecycle } from './hocs';
import { buildCenter, buildPath } from './utils';

export class Link extends React.PureComponent {
  // keep track of changes to points
  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.points) {
      return null;
    }

    return {
      points: nextProps.points,
      pointsChanged: prevState.points !== nextProps.points,
    };
  }

  state = {
    isHovering: false,
    points: null,
    pointsChanged: false,
  };

  containerRef = React.createRef();

  pathRef = React.createRef();

  hiddenPathRef = React.createRef();

  points = null;

  api = {
    translatePoint: ([moveX, moveY], isSource) => {
      const [[startX, startY], [endX, endY]] = this.points;

      const nextPoints = isSource ? [[startX + moveX, startY + moveY], [endX, endY]] : [[startX, startY], [endX + moveX, endY + moveY]];
      // eslint-disable-next-line react/no-direct-mutation-state
      this.points = nextPoints;

      this.drawFromPoints(nextPoints);
    },
  };

  get isDraggingNode() {
    return this.props.engine.drag.hasTarget;
  }

  matchesPlatform(platform) {
    const sourcePort = this.props.engine.getPortByID(this.props.link.source.portID);

    return !sourcePort.platform || sourcePort.platform === platform;
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

  onRemove = () => this.props.engine.link.remove(this.props.linkID);

  componentDidMount() {
    this.props.engine.registerLink(this.props.linkID, this.api);
  }

  componentWillUnmount() {
    this.props.engine.expireLink(this.props.linkID);
  }

  render() {
    const { points, editPermission, platform } = this.props;
    const { isHovering, pointsChanged } = this.state;

    if (pointsChanged) {
      this.points = points;
    }

    const path = buildPath(this.points);
    const [centerX, centerY] = buildCenter(this.points);

    return (
      <g ref={this.containerRef} style={{ visibility: this.matchesPlatform(platform) ? 'visible' : 'hidden' }}>
        {/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */}
        <Overlay d={path} isHovering={isHovering} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} ref={this.hiddenPathRef} />
        <Path d={path} markerEnd="url(#head)" isHovering={isHovering} ref={this.pathRef} />
        {/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */}
        {editPermission.canEdit && (
          <RemoveButton x={centerX} y={centerY} isHovering={isHovering} onMouseLeave={this.onMouseLeave} onClick={this.onRemove} />
        )}
      </g>
    );
  }
}

export default compose(
  withLink,
  withLinkLifecycle,
  withEngine,
  withCanvas,
  withPlatform,
  withEditPermission
)(Link);
