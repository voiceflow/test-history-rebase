import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import { OverlayType } from '@/pages/Canvas/constants';
import { RealtimeCursorOverlayAPI } from '@/pages/Canvas/types';
import { Pair, Point } from '@/types';
import { preventDefault } from '@/utils/dom';

import { ANIMATION_DURATION, CURSOR_EXPIRY_TIMEOUT } from '../constants';
import AbstractOverlay, { ConnectedRealtimeOverlayProps, connectOverlay, RealtimeViewer } from './AbstractOverlay';
import Cursor from './RealtimeOverlayCursor';
import Nametag from './RealtimeOverlayNametag';

function clearTimer(timers: Record<string, NodeJS.Timeout | null>, id: string) {
  if (timers[id] !== null) {
    clearTimeout(timers[id]!);
    timers[id] = null;
  }
}

class RealtimeCursorOverlay extends AbstractOverlay<RealtimeCursorOverlayAPI> {
  cursorLocations: Record<string, Point | null> = {};

  cursorTimers: Record<string, NodeJS.Timeout | null> = {};

  cursorAnimationTimers: Record<string, NodeJS.Timeout | null> = {};

  api: RealtimeCursorOverlayAPI = {
    moveMouse: (tabID, location) => {
      const transformedPoint = this.props.engine.canvas!.reverseTransformPoint(location, true);
      this.cursorLocations[tabID] = transformedPoint;

      this.animateElement(tabID, (cursorEl) => {
        if (!cursorEl) return;

        cursorEl.style.opacity = String(1);
        cursorEl.style.left = `${transformedPoint[0]}px`;
        cursorEl.style.top = `${transformedPoint[1]}px`;
      });

      this.clearCursorTimers(tabID);

      this.cursorTimers[tabID] = setTimeout(() => this.removeCursor(tabID), CURSOR_EXPIRY_TIMEOUT);
      this.cursorAnimationTimers[tabID] = setTimeout(() => this.fadeCursor(tabID), CURSOR_EXPIRY_TIMEOUT - ANIMATION_DURATION);
    },

    zoomViewport: (calculateMovement) =>
      this.state.items.forEach((tabID) => {
        const [moveX, moveY] = calculateMovement(this.cursorLocations[tabID]!);

        this.translateCursor(tabID, [moveX, moveY]);
      }),

    panViewport: (movement) => this.state.items.forEach((tabID) => this.translateCursor(tabID, movement)),

    removeUser: (tabID) => this.removeCursor(tabID),
  };

  constructor(props: ConnectedRealtimeOverlayProps) {
    super(OverlayType.CURSOR, props);
  }

  clearCursorTimers(tabID: string) {
    clearTimer(this.cursorTimers, tabID);
    clearTimer(this.cursorAnimationTimers, tabID);
  }

  translateCursor(tabID: string, [moveX, moveY]: Pair<number>) {
    const [x, y] = this.cursorLocations[tabID]!;
    const cursorEl = this.getElement(tabID);

    const nextLocation: Point = [x + moveX, y + moveY];
    this.cursorLocations[tabID] = nextLocation;

    window.requestAnimationFrame(() => {
      if (!cursorEl) return;

      cursorEl.style.left = `${nextLocation[0]}px`;
      cursorEl.style.top = `${nextLocation[1]}px`;
    });
  }

  fadeCursor(tabID: string) {
    const cursorEl = this.getElement(tabID);

    window.requestAnimationFrame(() => {
      if (!cursorEl) return;

      cursorEl.style.opacity = String(0);
    });
  }

  removeCursor(tabID: string) {
    this.clearCursorTimers(tabID);
    this.cursorLocations[tabID] = null;

    this.removeItem(tabID);
  }

  renderItem(tabID: string, viewer: RealtimeViewer, ref: React.RefObject<HTMLDivElement>) {
    const [x, y] = this.cursorLocations[tabID]!;
    const color = viewer.color.includes('|') ? `#${viewer.color.split('|')[0]}` : '#f8758f';
    const backgroundColor = viewer.color.includes('|') ? `#${viewer.color.split('|')[1]}` : '#fddae1';

    return (
      <Cursor key={tabID} style={{ left: `${x}px`, top: `${y}px` }} onClick={preventDefault()} ref={ref}>
        <SvgIcon icon="cursor" color={color} />
        <div style={{ position: 'relative' }}>
          <Nametag color={color} backgroundColor={backgroundColor}>
            {viewer.name}
          </Nametag>
        </div>
      </Cursor>
    );
  }
}

export default connectOverlay(RealtimeCursorOverlay);
