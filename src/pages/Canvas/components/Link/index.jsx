import React from 'react';

import { LINK_WIDTH } from '@/pages/Canvas/components/PortV2/constants';
import { withEditPermission, withEngine, withLink, withPlatform } from '@/pages/Canvas/contexts';
import { compose } from '@/utils/functional';

import { Group, HeadMarker, Overlay, Path, RemoveButton } from './components';
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

      const nextPoints = isSource
        ? [
            [startX + moveX, startY + moveY],
            [endX, endY],
          ]
        : [
            [startX, startY],
            [endX + moveX, endY + moveY],
          ];
      // eslint-disable-next-line react/no-direct-mutation-state
      this.points = nextPoints;

      this.drawFromPoints(this.virtualPoints);
    },
  };

  get isDraggingNode() {
    return this.props.engine.drag.hasTarget;
  }

  get virtualPoints() {
    if (!this.points || !this.props.engine.isBlockRedesignEnabled()) {
      return this.points;
    }

    const [[x1, y1], [x2, y2]] = this.points;

    return [
      [x1 + LINK_WIDTH, y1],
      [x2, y2],
    ];
  }

  matchesPlatform(platform) {
    const sourcePort = this.props.engine.getPortByID(this.props.link.source.portID);

    return !sourcePort.platform || sourcePort.platform === platform;
  }

  drawFromPoints(nextPoints) {
    const pathEl = this.pathRef.current;
    const hiddenPathEl = this.hiddenPathRef.current;

    window.requestAnimationFrame(() => {
      const nextPath = buildPath(nextPoints);

      pathEl.setAttribute('d', nextPath);
      hiddenPathEl.setAttribute('d', nextPath);
    });
  }

  onMouseEnter = () => {
    const { linkID, engine } = this.props;

    if (!this.isDraggingNode && !engine.linkCreation.isDrawing) {
      this.setState({ isHovering: true });
      engine.link.setHighlight(linkID);
    }
  };

  onMouseLeave = (event) => {
    if (this.state.isHovering && (!this.containerRef.current || !this.containerRef.current.contains(event.relatedTarget))) {
      this.setState({ isHovering: false });
      this.props.engine.link.clearHighlight(this.props.linkID);
    }
  };

  onRemove = () => {
    const { engine, linkID } = this.props;

    engine.link.remove(linkID);
    engine.link.clearHighlight(linkID);
  };

  componentDidMount() {
    this.props.engine.registerLink(this.props.linkID, this.api);
  }

  componentWillUnmount() {
    this.props.engine.expireLink(this.props.linkID);
  }

  render() {
    const { linkID, points, editPermission, platform, engine, isActive } = this.props;
    const { isHovering, pointsChanged } = this.state;
    const isBlockRedesignEnabled = engine.isBlockRedesignEnabled();

    if (pointsChanged) {
      this.points = points;
    }

    const path = buildPath(this.virtualPoints);
    const [centerX, centerY] = buildCenter(this.virtualPoints);
    const linkProps = isBlockRedesignEnabled ? { isNewStyle: true, ...(isHovering && { strokeColor: '#2c85ff' }) } : {};
    const linkHeadProps = isBlockRedesignEnabled && isHovering ? { color: '#2c85ff' } : {};
    const linkOverlayProps = isBlockRedesignEnabled ? { isNewStyle: true } : {};

    return (
      <Group isActive={isActive} style={{ visibility: this.matchesPlatform(platform) ? 'visible' : 'hidden' }} ref={this.containerRef}>
        <HeadMarker id={linkID} {...linkHeadProps} />
        {/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */}
        <Overlay
          d={path}
          isHovering={isHovering}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          {...linkOverlayProps}
          ref={this.hiddenPathRef}
        />
        <Path d={path} markerEnd={`url(#head-${linkID})`} isHovering={isHovering} {...linkProps} ref={this.pathRef} />
        {/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */}
        {editPermission.canEdit && (
          <RemoveButton x={centerX} y={centerY} isHovering={isHovering} onMouseLeave={this.onMouseLeave} onClick={this.onRemove} />
        )}
      </Group>
    );
  }
}

export default compose(withLink, withLinkLifecycle, withEngine, withPlatform, withEditPermission)(Link);
