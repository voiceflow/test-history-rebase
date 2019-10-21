import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import { withEngine } from '@/containers/CanvasV2/contexts';
import { connect } from '@/hocs';
import { diagramViewersLookupSelector } from '@/store/selectors';
import { withoutValue } from '@/utils/array';
import { preventDefault } from '@/utils/dom';
import { compose } from '@/utils/functional';

import { Cursor, Nametag } from './components';
import { ANIMATION_DURATION, CURSOR_EXPIRY_TIMEOUT } from './constants';

class RealtimeOverlay extends React.PureComponent {
  state = {
    cursors: [],
  };

  rootRef = React.createRef();

  cursorRefs = {};

  cursorLocations = {};

  cursorTimers = {};

  cursorAnimationTimers = {};

  api = {
    moveMouse: (tabID, location) => {
      const transformedPoint = this.props.engine.canvas.reverseTransformPoint(location, true);
      this.cursorLocations[tabID] = transformedPoint;

      if (this.state.cursors.includes(tabID)) {
        const cursorEl = this.cursorRefs[tabID].current;

        // eslint-disable-next-line compat/compat
        window.requestAnimationFrame(() => {
          cursorEl.style.opacity = 1;
          cursorEl.style.left = `${transformedPoint[0]}px`;
          cursorEl.style.top = `${transformedPoint[1]}px`;
        });
      } else {
        this.cursorRefs[tabID] = React.createRef();
        this.setState({ cursors: [...this.state.cursors, tabID] });
      }

      this.clearCursorTimers(tabID);

      this.cursorTimers[tabID] = setTimeout(() => this.removeCursor(tabID), CURSOR_EXPIRY_TIMEOUT);
      this.cursorAnimationTimers[tabID] = setTimeout(() => this.fadeCursor(tabID), CURSOR_EXPIRY_TIMEOUT - ANIMATION_DURATION);
    },

    zoomViewport: (calculateMovement) =>
      this.state.cursors.forEach((tabID) => {
        const [moveX, moveY] = calculateMovement(this.cursorLocations[tabID]);

        this.translateCursor(tabID, moveX, moveY);
      }),

    panViewport: (moveX, moveY) => this.state.cursors.forEach((tabID) => this.translateCursor(tabID, moveX, moveY)),

    removeUser: (tabID) => this.removeCursor(tabID),
  };

  clearCursorTimers(tabID) {
    clearTimer(this.cursorTimers, tabID);
    clearTimer(this.cursorAnimationTimers, tabID);
  }

  translateCursor(tabID, moveX, moveY) {
    const [x, y] = this.cursorLocations[tabID];
    const cursorEl = this.cursorRefs[tabID].current;

    const nextLocation = [x + moveX, y + moveY];
    this.cursorLocations[tabID] = nextLocation;

    // eslint-disable-next-line compat/compat
    window.requestAnimationFrame(() => {
      cursorEl.style.left = `${nextLocation[0]}px`;
      cursorEl.style.top = `${nextLocation[1]}px`;
    });
  }

  fadeCursor(tabID) {
    const cursorEl = this.cursorRefs[tabID].current;

    // eslint-disable-next-line compat/compat
    window.requestAnimationFrame(() => {
      cursorEl.style.opacity = 0;
    });
  }

  removeCursor(tabID) {
    this.clearCursorTimers(tabID);
    this.cursorLocations[tabID] = null;

    this.setState({ cursors: withoutValue(this.state.cursors, tabID) });
  }

  componentDidMount() {
    this.props.engine.realtime.registerOverlay(this.api);
  }

  componentWillUnmount() {
    this.props.engine.realtime.expireOverlay();
  }

  render() {
    const { viewersLookup } = this.props;
    const { cursors } = this.state;

    return cursors.map((tabID) => {
      const viewer = viewersLookup[tabID];

      // TODO: this is only a case because we use tabId as the lookup
      if (!viewer) return null;

      const [x, y] = this.cursorLocations[tabID];
      const color = viewer.image.includes('|') ? `#${viewer.image.split('|')[0]}` : '#f8758f';
      const backgroundColor = viewer.image.includes('|') ? `#${viewer.image.split('|')[1]}` : '#fddae1';

      return (
        <Cursor key={tabID} style={{ left: `${x}px`, top: `${y}px` }} onClick={preventDefault()} ref={this.cursorRefs[tabID]}>
          <SvgIcon icon="cursor" color={color} />
          <div style={{ position: 'relative' }}>
            {viewersLookup[tabID] && (
              <Nametag color={color} backgroundColor={backgroundColor}>
                {viewersLookup[tabID].name}
              </Nametag>
            )}
          </div>
        </Cursor>
      );
    });
  }
}

const mapStateToProps = {
  viewersLookup: diagramViewersLookupSelector,
};

export default compose(
  connect(mapStateToProps),
  withEngine
)(RealtimeOverlay);

function clearTimer(timers, id) {
  if (timers[id] !== null) {
    clearTimeout(timers[id]);
    timers[id] = null;
  }
}
